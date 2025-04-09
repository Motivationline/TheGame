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
        jobType: JobProviderType; 
        start(_e: CustomEvent<UpdateEvent>): void {
            JobProvider.JobProviders.push(this);
        }
        remove(_e: CustomEvent): void {
            let index = JobProvider.JobProviders.indexOf(this);
            JobProvider.JobProviders.splice(index, 1);
        }
    }

    export class JobProviderGatherFood extends JobProvider {
        jobType: JobProviderType = JobProviderType.GATHER_FOOD;
    }
    export class JobProviderGatherStone extends JobProvider {
        jobType: JobProviderType = JobProviderType.GATHER_STONE;
    }
    export class JobProviderStoreResource extends JobProvider {
        jobType: JobProviderType = JobProviderType.STORE_RESOURCE;
    }
    export class JobProviderBuild extends JobProvider {
        jobType: JobProviderType = JobProviderType.BUILD;
    }
}