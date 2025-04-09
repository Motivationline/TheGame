namespace Script {
    import ƒ = FudgeCore;
    export class JobTaker extends UpdateScriptComponent {
        #job: JobProviderType = JobProviderType.GATHER_FOOD;
        #progress: number = 0;
        #executableJobs: Map<JobProviderType, Function>;
        #target: JobProvider;
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

        update(_e: CustomEvent<UpdateEvent>): void {
            this.#executableJobs.get(this.#job)?.(_e.detail.deltaTime);
        }

        private gatherResource = (deltaTime: number) => {
            console.log(this.#progress);
            switch (this.#progress) {
                case 0: {
                    // look for target
                    const target = JobTaker.findClosestJobProvider(this.#job, this.node.mtxWorld.translation);
                    if (target) {
                        this.#progress++
                        this.#target = target;
                        this.node.mtxLocal.lookAt(target.node.mtxWorld.translation);
                    }
                    break;
                }
                case 1:
                case 4: {
                    // move to target
                    let reachedTarget = this.moveToTarget(deltaTime);
                    if (reachedTarget) {
                        this.#progress++;
                        new ƒ.Timer(ƒ.Time.game, this.#progress === 2 ? 2000 : 100, 1, ()=>{this.#progress++});
                    }
                    break;
                }
                case 2: {
                    // at gathering site
                    // play animation or some junk
                    break;
                }
                case 3: {
                    // ready to find the place to drop stuff off
                    const target = JobTaker.findClosestJobProvider(JobProviderType.STORE_RESOURCE, this.node.mtxWorld.translation);
                    if(target) {
                        this.#progress++;
                        this.#target = target;
                        this.node.mtxLocal.lookAt(target.node.mtxWorld.translation);
                    }
                    break;
                }
                case 5: {
                    // at deploy site
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
            let distance = this.node.mtxWorld.translation.getDistance(this.#target.node.mtxWorld.translation);
            if (distance > this.#prevDistance) {
                // target reached
                this.node.mtxLocal.translate(this.node.mtxWorld.getTranslationTo(this.#target.node.mtxWorld));
                this.#prevDistance = Infinity;
                return true;
            }
            this.#prevDistance = distance;
            // move to target
            this.node.mtxLocal.translateZ(deltaTime / 1000 * this.speed);
            return false;
        }
    }
}