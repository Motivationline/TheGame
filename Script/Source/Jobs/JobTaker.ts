namespace Script {
    import ƒ = FudgeCore;
    @ƒ.serialize
    export class JobTaker extends UpdateScriptComponent {
        #job: JobType = JobType.NONE;
        #currentJob: JobType = JobType.NONE;
        #progress: number = 0;
        #executableJobs: Map<JobType, Function>;
        #target: JobProvider;
        #animator: JobAnimation;
        #timers: ƒ.Timer[] = [];
        @ƒ.serialize(Number)
        speed: number = 1;


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

        set job(_job: JobType) {
            this.#job = _job;
            this.#animator.setModel(this.#job);
            this.#animator.playAnimation(JobType.NONE);
            this.#progress = 0;
            this.#timers.forEach(t => t.clear());
            this.#timers.length = 0;
        }

        static findClosestJobProvider(_job: JobType, _location: ƒ.Vector3): JobProvider | undefined {
            const foundProviders: JobProvider[] = [];
            for (let provider of JobProvider.JobProviders) {
                if (provider.jobType === _job) {
                    foundProviders.push(provider);
                }
            }
            if (!foundProviders.length) return undefined;
            foundProviders.sort((a, b) => a.node.mtxWorld.translation.getDistance(_location) - b.node.mtxWorld.translation.getDistance(_location));
            return foundProviders[0];
        }

        start(_e: CustomEvent<UpdateEvent>): void {
            this.#animator = this.node.getComponent(JobAnimation);
        }

        update(_e: CustomEvent<UpdateEvent>): void {
            this.#executableJobs.get(this.#job)?.(_e.detail.deltaTime);
        }

        private gatherResource = (deltaTime: number) => {
            switch (this.#progress) {
                case 0: {
                    // look for target
                    this.#currentJob = JobType.NONE;
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
                        new ƒ.Timer(ƒ.Time.game, this.#target.jobDuration, 1, () => {
                            this.#progress++;
                            this.#target.jobFinish();
                        });
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
                        Data.food += Math.max(1, Math.floor(1 * Data.gatherBonusFood));
                    } else if (this.#job === JobType.GATHER_STONE) {
                        Data.stone += Math.max(1, Math.floor(1 * Data.gatherBonusStone));
                    }
                    this.#progress = 0;
                    break;
                }
            }
        }
        private build = () => {

        }
        private idle = (deltaTime: number) => {
            switch (this.#progress) {
                case 0: {
                    this.#animator.playAnimation(this.#job);
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
                    const node = new ƒ.Node("walk_target");
                    const jp = new JobProviderNone();
                    node.addComponent(jp);
                    node.addComponent(new ƒ.ComponentTransform);
                    this.node.getParent().addChild(node);
                    node.mtxLocal.translateX(Math.max(-20, Math.min(20, randomRange(-4, 4) + this.node.mtxWorld.translation.x)));
                    node.mtxLocal.translateZ(Math.max(-20, Math.min(20, randomRange(-4, 4) + this.node.mtxWorld.translation.z)));
                    this.#target = jp;
                    this.node.mtxLocal.lookAt(node.mtxLocal.translation);
                    this.#progress = 3;
                    break;
                }
                case 3: {
                    const reached = this.moveToTarget(deltaTime);
                    if (reached) {
                        this.#target.node.getParent().removeChild(this.#target.node);
                        this.#progress = 0;
                    }
                }
            }
        }

        #prevDistance: number = Infinity;
        private moveToTarget(deltaTime: number): boolean {
            this.#animator.playAnimation(NonJobAnimations.WALK);
            let distance = this.node.mtxWorld.translation.getDistance(this.#target.node.mtxWorld.translation);
            if (distance > this.#prevDistance) {
                // target reached
                this.node.mtxLocal.translate(this.node.mtxWorld.getTranslationTo(this.#target.node.mtxWorld));
                this.#prevDistance = Infinity;
                return true;
            }
            this.#prevDistance = distance;
            // move to target
            deltaTime = Math.min(1000, deltaTime); // limit delta time to 1 second max to prevent lag causing super big jumps
            this.node.mtxLocal.translateZ(deltaTime / 1000 * this.speed);
            return false;
        }

        private findAndSetTargetForJob(_job: JobType): JobProvider | undefined {
            this.#animator.playAnimation(JobType.NONE);
            const target = JobTaker.findClosestJobProvider(_job, this.node.mtxWorld.translation);
            if (!target) return undefined;
            this.#target = target;
            this.#currentJob = _job;
            this.node.mtxLocal.lookAt(target.node.mtxWorld.translation);
            return target;
        }
    }
}