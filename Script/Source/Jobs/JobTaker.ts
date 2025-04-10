namespace Script {
    import ƒ = FudgeCore;
    @ƒ.serialize
    export class JobTaker extends UpdateScriptComponent {
        #job: JobProviderType = JobProviderType.GATHER_FOOD;
        #currentJob: JobProviderType = JobProviderType.NONE;
        #progress: number = 0;
        #executableJobs: Map<JobProviderType, Function>;
        #target: JobProvider;
        #animator: JobAnimation;
        @ƒ.serialize(Number)
        speed: number = 1;


        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.#executableJobs = new Map<JobProviderType, Function>([
                [JobProviderType.BUILD, this.build],
                [JobProviderType.GATHER_FOOD, this.gatherResource],
                [JobProviderType.GATHER_STONE, this.gatherResource],
            ])
        }

        set job(_job: JobProviderType) {
            this.#job = _job;
            this.#progress = 0;
        }

        static findClosestJobProvider(_job: JobProviderType, _location: ƒ.Vector3): JobProvider | undefined {
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
                    this.#currentJob = JobProviderType.NONE;
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
                    const target = this.findAndSetTargetForJob(JobProviderType.STORE_RESOURCE);
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
                    this.#progress = 0;
                    break;
                }
            }
        }
        private build = () => {

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
        
        private findAndSetTargetForJob(_job: JobProviderType): JobProvider | undefined {
            this.#animator.playAnimation(JobProviderType.NONE);
            const target = JobTaker.findClosestJobProvider(_job, this.node.mtxWorld.translation);
            if (!target) return undefined;
            this.#target = target;
            this.#currentJob = _job;
            this.node.mtxLocal.lookAt(target.node.mtxWorld.translation);
            return target;
        }
    }
}