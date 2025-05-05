/// <reference path="MoveTo.ts" />

namespace Script {
    import ƒ = FudgeCore;
    @ƒ.serialize
    export class JobTaker extends MoveTo {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(JobTaker);

        #job: JobType = JobType.NONE;
        #currentJob: JobType = JobType.NONE;
        #progress: number = 0;
        #executableJobs: Map<JobType, Function>;
        #target: JobProvider;
        #animator: JobAnimation;
        #timers: ƒ.Timer[] = [];
        @ƒ.serialize(Number)
        speed: number = 1;
        #paused: boolean = false;
        #defaultGatherAmount: number = 2;

        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.#executableJobs = new Map<JobType, Function>([
                [JobType.NONE, this.idle],
                [JobType.BUILD, this.build],
                [JobType.GATHER_FOOD, this.gatherResource],
                [JobType.GATHER_STONE, this.gatherResource],
            ])
        }

        #needToRemoveTarget: boolean = false;
        set job(_job: JobType) {
            if (this.#needToRemoveTarget) {
                this.removeTarget();
            }
            this.#job = _job;
            this.#animator.setModel(this.#job);
            this.#animator.playAnimation(JobType.NONE);
            this.#progress = 0;
            this.#timers.forEach(t => t.clear());
            this.#timers.length = 0;

            this.paused = false;
        }

        set paused(_paused: boolean) {
            this.#paused = _paused;
            if (_paused) {
                this.pause();
            } else {
                this.unpause();
            }
        }

        static findClosestJobProviderWithPath(_job: JobType, _location: ƒ.Vector3): { job: JobProvider, path: MovePath } | undefined {
            const foundProviders: JobProvider[] = [];
            // console.log(_job, JobProvider.JobProviders);
            for (let provider of JobProvider.JobProviders) {
                if (provider.jobType === _job && !provider.targeted) {
                    foundProviders.push(provider);
                }
            }
            if (!foundProviders.length) return undefined;
            foundProviders.sort((a, b) => a.node.mtxWorld.translation.getDistance(_location) - b.node.mtxWorld.translation.getDistance(_location));

            for (let provider of foundProviders) {
                let path = this.findPathToJobProvider(provider, _location);
                if (path)
                    return { job: provider, path }
            }
            // TODO mark this job taker as blocked so they don't lag the main thread trying over and over again.
            return undefined;
        }

        static findPathToJobProvider(_job: JobProvider, _startLocation: ƒ.Vector3): MovePath | undefined {
            // get grid position(s) of job location
            let worldPos = new ƒ.Vector2(_job.node.mtxWorld.translation.x, _job.node.mtxWorld.translation.z);
            let tilePos = grid.worldPosToTilePos(worldPos);

            let startPos = grid.worldPosToTilePos(new ƒ.Vector2(_startLocation.x, _startLocation.z));

            // find all surrounding, non-blocked blocks
            const positionsToCheck: ƒ.Vector2[] = [tilePos];
            const checkedPositions: Set<string> = new Set();
            const candidates: ƒ.Vector2[] = [];
            while (positionsToCheck.length > 0) {
                let currentPos = positionsToCheck.pop();
                checkedPositions.add(currentPos.toString());
                for (let x: number = -1; x <= 1; x++) {
                    for (let y: number = -1; y <= 1; y++) {
                        let newPos = new ƒ.Vector2(currentPos.x + x, currentPos.y + y);
                        if (checkedPositions.has(newPos.toString())) continue;
                        let tile = grid.getTile(newPos, false);
                        if (tile === null) continue;
                        if (tile === undefined) {
                            candidates.push(newPos);
                            continue;
                        }
                        if (tile.node === _job.node) {
                            positionsToCheck.push(newPos);
                        }
                    }
                }
            }

            if (!candidates.length) return undefined;

            // sort candidates by distance
            candidates.sort((a, b) => vector2Distance(a, startPos) - vector2Distance(b, startPos));

            // check which one I can find a path to
            for (let candidate of candidates) {
                let path = grid.getPath(startPos, candidate);
                if (path && path.length) return path;
            }

            return undefined;
        }

        start(_e: CustomEvent<UpdateEvent>): void {
            super.start(_e);
            this.#animator = this.node.getComponent(JobAnimation);
        }

        update(_e: CustomEvent<UpdateEvent>): void {
            if (this.#paused) return;
            this.#executableJobs.get(this.#job)?.(_e.detail.deltaTime);
        }

        moveAwayNow() {
            if (this.#job !== JobType.NONE && this.#job !== JobType.BUILD) {
                return;
            }
            this.#progress = 2;
            this.#timers.forEach(t => t.clear());
            this.#timers.length = 0;
        }

        private gatherResource = (deltaTime: number) => {
            switch (this.#progress) {
                case 0: {
                    // look for target
                    this.#currentJob = JobType.NONE;
                    this.#animator.playAnimation(JobType.NONE);
                    const target = this.findAndSetTargetForJob(this.#job);
                    if (target) {
                        this.#progress++
                    }
                    break;
                }
                case 1:
                case 4: {
                    // move to target
                    let reachedTarget = this.moveToTarget(deltaTime);
                    if (reachedTarget) {
                        this.#progress++;
                        this.#target.jobStart();
                        let timer = new ƒ.Timer(ƒ.Time.game, this.#target.jobDuration, 1, () => {
                            this.#progress++;
                            this.#target.jobFinish();
                        });
                        this.#timers.push(timer);
                        // lookat target
                        this.node.mtxLocal.lookAt(this.#target.node.mtxLocal.translation);
                    }
                    break;
                }
                case 2: {
                    // at gathering site
                    // play animation or some junk
                    this.#animator.playAnimation(this.#currentJob);
                    break;
                }
                case 3: {
                    // ready to find the place to drop stuff off
                    this.#animator.playAnimation(JobType.NONE);
                    const target = this.findAndSetTargetForJob(JobType.STORE_RESOURCE);
                    if (target) {
                        this.#progress++;
                    }
                    break;
                }
                case 5: {
                    // at deploy site
                    this.#animator.playAnimation(this.#currentJob);
                    break;
                }
                case 6: {
                    // dropped off the resources
                    if (this.#job === JobType.GATHER_FOOD) {
                        Data.food += Math.max(1, BonusProvider.getBonus(BonusData.FOOD, this.#defaultGatherAmount));
                    } else if (this.#job === JobType.GATHER_STONE) {
                        Data.stone += Math.max(1, BonusProvider.getBonus(BonusData.STONE, this.#defaultGatherAmount));
                    }
                    this.#progress = 0;
                    break;
                }
            }
        }
        private build = (deltaTime: number) => {
            // console.log(this.#progress);
            if (this.#progress < 10) {
                const target = this.findAndSetTargetForJob(this.#job);
                if (target) {
                    this.#progress = 10;
                } else {
                    this.idle(deltaTime);
                }
            }
            switch (this.#progress) {
                case 10: {
                    let reachedTarget = this.moveToTarget(deltaTime);
                    this.#animator.playAnimation(this.#job);
                    if (reachedTarget) {
                        this.#progress = 11;
                        this.#target.jobStart();
                        let timer = new ƒ.Timer(ƒ.Time.game, this.#target.jobDuration, 1, () => {
                            this.#progress = 12;
                            this.#target.jobFinish();
                        });
                        this.#timers.push(timer);
                    }
                    break;
                }
                case 11: {
                    // building
                    break;
                }
                case 12: {
                    // done building
                    this.#progress = 2;
                }
            }
        }
        private idle = (deltaTime: number) => {
            switch (this.#progress) {
                case 0: {
                    this.#animator.playAnimation(JobType.NONE);
                    this.#progress++;
                    this.#timers.push(new ƒ.Timer(ƒ.Time.game, randomRange(1000, 5000), 1, () => {
                        this.#progress = 2;
                    }));
                    break;
                }
                case 1: {
                    // just idling around

                    break;
                }
                case 2: {
                    // create a random walk target
                    let pos: ƒ.Vector2 = new ƒ.Vector2(this.node.mtxWorld.translation.x, this.node.mtxWorld.translation.z);
                    grid.worldPosToTilePos(pos, pos);

                    for (let i: number = 0; i < 10; i++) {
                        const newPos = new ƒ.Vector2(
                            Math.max(0, Math.min(grid.size.x, Math.floor(Math.sign(randomRange(-1, 1)) * randomRange(3, 5) + pos.x))),
                            Math.max(0, Math.min(grid.size.y, Math.floor(Math.sign(randomRange(-1, 1)) * randomRange(3, 5) + pos.y))),
                        )
                        let path = this.setTarget(newPos, false);
                        if (path.length > 0) break;
                    }

                    // const node = new ƒ.Node("walk_target");
                    // const jp = new JobProviderNone();
                    // node.addComponent(jp);
                    // node.addComponent(new ƒ.ComponentTransform);
                    // this.node.getParent().addChild(node);
                    // node.mtxLocal.translateX(Math.max(-20, Math.min(20, Math.sign(randomRange(-1, 1)) * randomRange(3, 5) + this.node.mtxWorld.translation.x)));
                    // node.mtxLocal.translateZ(Math.max(-20, Math.min(20, Math.sign(randomRange(-1, 1)) * randomRange(3, 5) + this.node.mtxWorld.translation.z)));
                    // this.#target = jp;
                    // this.node.mtxLocal.lookAt(node.mtxLocal.translation);
                    // this.#needToRemoveTarget = true;
                    this.#progress = 3;
                    break;
                }
                case 3: {
                    const reached = this.moveToTarget(deltaTime);
                    if (reached) {
                        this.removeTarget();
                        this.#progress = 0;
                    }
                }
            }
        }

        private pause = () => {
            this.#animator.playAnimation(NonJobAnimations.SELECTED);
            this.node.mtxLocal.lookIn(new ƒ.Vector3(-1, 0, -1));
        }
        private unpause = () => {
            if (this.#target && this.#target.node)
                this.node.mtxLocal.lookAt(this.#target.node.mtxWorld.translation);
        }

        private removeTarget() {
            this.#needToRemoveTarget = false;
            if (!this.#target || !this.#target.node) return;
            this.#target.target(false);
            let node = this.#target.node;
            node.removeComponent(this.#target);
            node.getParent().removeChild(node);
        }

        // #prevDistance: number = Infinity;
        protected moveToTarget(deltaTime: number): boolean {
            this.#animator.playAnimation(NonJobAnimations.WALK);
            return super.moveToTarget(deltaTime);
            //     let distance = this.node.mtxWorld.translation.getDistance(this.#target.node.mtxWorld.translation);
            //     if (distance < this.#target.node.getComponent(BuildData)?.interactionRadius) {
            //         // target reached
            //         this.#prevDistance = Infinity;
            //         return true;
            //     }
            //     else if (distance > this.#prevDistance) {
            //         // algorithm failed
            //         this.node.mtxLocal.translate(this.node.mtxWorld.getTranslationTo(this.#target.node.mtxWorld));
            //         this.#prevDistance = Infinity;
            //         return true;
            //     }
            //     this.#prevDistance = distance;
            //     // move to target
            //     // this.node.mtxLocal.lookAt(this.#target.node.mtxWorld.translation);
            //     deltaTime = Math.min(1000, deltaTime); // limit delta time to 1 second max to prevent lag causing super big jumps
            //     this.node.mtxLocal.translateZ(deltaTime / 1000 * this.speed);
            //     return false;
        }

        private findAndSetTargetForJob(_job: JobType): JobProvider | undefined {
            const target = JobTaker.findClosestJobProviderWithPath(_job, this.node.mtxWorld.translation);
            if (!target) {
                return undefined;
            }
            target.job.target(true);
            this.#target = target.job;
            this.#currentJob = _job;
            this.node.mtxLocal.lookAt(target.job.node.mtxWorld.translation);
            this.setPath(target.path);
            return target.job;
        }

        drawGizmos(_cmpCamera?: ƒ.ComponentCamera): void {
            super.drawGizmos(_cmpCamera);
        }
    }
}