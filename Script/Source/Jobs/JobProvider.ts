/// <reference path="../Plugins/UpdateScriptComponent.ts" />


namespace Script {
    import ƒ = FudgeCore;
    export enum JobType {
        GATHER_STONE,
        GATHER_FOOD,
        STORE_RESOURCE,
        BUILD,
        NONE,
    }

    @ƒ.serialize
    export abstract class JobProvider extends UpdateScriptComponent {
        static JobProviders: JobProvider[] = [];
        @ƒ.serialize(JobType)
        protected _jobType: JobType;
        @ƒ.serialize(Number)
        jobDuration: number = 500;
        @ƒ.serialize(Number)
        cooldown: number = 30000;
        #currentCooldown = 0;
        start(_e: CustomEvent<UpdateEvent>): void {
            JobProvider.JobProviders.push(this);
        }
        remove(_e: CustomEvent): void {
            let index = JobProvider.JobProviders.indexOf(this);
            JobProvider.JobProviders.splice(index, 1);
        }
        jobStart(): void { }
        jobFinish(): void {
            this.#currentCooldown = this.cooldown;
        }
        get jobType(): JobType {
            if (this.#currentCooldown > 0) {
                return JobType.NONE;
            }
            return this._jobType;
        }
        update(_e: CustomEvent<UpdateEvent>): void {
            if (this.#currentCooldown > 0) {
                this.#currentCooldown -= _e.detail.deltaTime
            }
        }
    }

    export class JobProviderNone extends JobProvider {
        _jobType: JobType = JobType.NONE;
    }
    export class JobProviderGatherFood extends JobProvider {
        _jobType: JobType = JobType.GATHER_FOOD;
        jobDuration: number = 2000;
    }
    export class JobProviderGatherStone extends JobProvider {
        _jobType: JobType = JobType.GATHER_STONE;
        jobDuration: number = 2000;
    }
    export class JobProviderStoreResource extends JobProvider {
        jobDuration: number = 2000;
        _jobType: JobType = JobType.STORE_RESOURCE;
        cooldown: number = 0;
    }
    export class JobProviderBuild extends JobProvider {
        _jobType: JobType = JobType.BUILD;
    }
}