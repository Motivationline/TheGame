/// <reference path="../Plugins/UpdateScriptComponent.ts" />


namespace Script {
    import ƒ = FudgeCore;
    export enum JobProviderType {
        GATHER_STONE,
        GATHER_FOOD,
        STORE_RESOURCE,
        BUILD,
        NONE,
    }

    @ƒ.serialize
    export abstract class JobProvider extends UpdateScriptComponent {
        static JobProviders: JobProvider[] = [];
        @ƒ.serialize(JobProviderType)
        protected _jobType: JobProviderType;
        @ƒ.serialize(Number)
        jobDuration: number = 500;
        start(_e: CustomEvent<UpdateEvent>): void {
            JobProvider.JobProviders.push(this);
        }
        remove(_e: CustomEvent): void {
            let index = JobProvider.JobProviders.indexOf(this);
            JobProvider.JobProviders.splice(index, 1);
        }
        jobStart(): void {}
        jobFinish(): void {}
        get jobType(): JobProviderType {
            return this._jobType;
        }
    }

    export class JobProviderGatherFood extends JobProvider {
        _jobType: JobProviderType = JobProviderType.GATHER_FOOD;
        jobDuration: number = 2000;
    }
    export class JobProviderGatherStone extends JobProvider {
        _jobType: JobProviderType = JobProviderType.GATHER_STONE;
        jobDuration: number = 2000;
    }
    export class JobProviderStoreResource extends JobProvider {
        jobDuration: number = 2000;
        _jobType: JobProviderType = JobProviderType.STORE_RESOURCE;
    }
    export class JobProviderBuild extends JobProvider {
        _jobType: JobProviderType = JobProviderType.BUILD;
    }
}