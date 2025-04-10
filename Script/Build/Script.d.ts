declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    interface Tile {
        type: string;
        origin: boolean;
    }
    class Grid {
        #private;
        constructor(_size: ƒ.Vector2);
        set size(_size: ƒ.Vector2);
        getTile(_pos: ƒ.Vector2, inWorldCoordinates?: boolean): Tile | undefined | null;
        setTile(_tile: Tile | undefined, _pos: ƒ.Vector2): void;
        worldPosToTilePos(_pos: ƒ.Vector2, _out?: ƒ.Vector2): ƒ.Vector2;
        tilePosToWorldPos(_pos: ƒ.Vector2, _out?: ƒ.Vector2): ƒ.Vector2;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GridBuilder implements ToggleableUI {
        grid: Grid;
        wrapper: HTMLElement;
        buildings: HTMLElement;
        canvas: HTMLCanvasElement;
        selectedBuilding: Build;
        marker: ƒ.Node;
        currentPosition: ƒ.Vector2;
        currentWorldPosition: ƒ.Vector2;
        currentPositionOccupied: boolean;
        constructor(grid?: Grid);
        enable(): Promise<void>;
        disable(): void;
        private generateBuildingButtons;
        private highlightGrid;
        private placeOnGrid;
        private checkAndSetCurrentPosition;
        private forEachSelectedTile;
        private changeTileColor;
        private tilePositionFromMouseEvent;
        private selectBuilding;
    }
}
declare namespace Script {
    interface ToggleableUI {
        enable: () => void;
        disable: () => void;
    }
    function setupUI(): void;
}
declare namespace Script {
    import ƒ = FudgeCore;
    interface Build {
        graph: ƒ.Graph;
        size: number;
        name: string;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Building extends ƒ.Component implements Build {
        static all: Build[];
        get isSingleton(): boolean;
        graph: ƒ.Graph;
        size: number;
        name: string;
        constructor();
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    interface UpdateEvent {
        deltaTime: number;
    }
    abstract class UpdateScriptComponent extends ƒ.Component {
        constructor();
        static updateAllInBranch(_branch: ƒ.Node): void;
        prestart?(_e: CustomEvent<UpdateEvent>): void;
        start?(_e: CustomEvent<UpdateEvent>): void;
        update?(_e: CustomEvent<UpdateEvent>): void;
        remove?(_e: CustomEvent): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    type AnimationType = JobProviderType | NonJobAnimations;
    enum NonJobAnimations {
        WALK = "walk"
    }
    class JobAnimation extends UpdateScriptComponent {
        #private;
        animIdle: ƒ.Animation;
        animWalk: ƒ.Animation;
        animGatherFood: ƒ.Animation;
        animGatherStone: ƒ.Animation;
        animBuild: ƒ.Animation;
        start(_e: CustomEvent<UpdateEvent>): void;
        playAnimation(anim: AnimationType): void;
    }
}
declare namespace Script {
    enum JobProviderType {
        GATHER_STONE = 0,
        GATHER_FOOD = 1,
        STORE_RESOURCE = 2,
        BUILD = 3,
        NONE = 4
    }
    abstract class JobProvider extends UpdateScriptComponent {
        static JobProviders: JobProvider[];
        protected _jobType: JobProviderType;
        jobDuration: number;
        start(_e: CustomEvent<UpdateEvent>): void;
        remove(_e: CustomEvent): void;
        jobStart(): void;
        jobFinish(): void;
        get jobType(): JobProviderType;
    }
    class JobProviderGatherFood extends JobProvider {
        _jobType: JobProviderType;
        jobDuration: number;
    }
    class JobProviderGatherStone extends JobProvider {
        _jobType: JobProviderType;
        jobDuration: number;
    }
    class JobProviderStoreResource extends JobProvider {
        jobDuration: number;
        _jobType: JobProviderType;
    }
    class JobProviderBuild extends JobProvider {
        _jobType: JobProviderType;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class JobTaker extends UpdateScriptComponent {
        #private;
        speed: number;
        constructor();
        set job(_job: JobProviderType);
        static findClosestJobProvider(_job: JobProviderType, _location: ƒ.Vector3): JobProvider | undefined;
        start(_e: CustomEvent<UpdateEvent>): void;
        update(_e: CustomEvent<UpdateEvent>): void;
        private gatherResource;
        private build;
        private moveToTarget;
        private findAndSetTargetForJob;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    export class PickSphere extends ƒ.Component {
        #private;
        static readonly iSubclass: number;
        constructor();
        get radius(): number;
        set radius(_r: number);
        get radiusSquared(): number;
        offset: ƒ.Vector3;
        get mtxPick(): ƒ.Matrix4x4;
        drawGizmos(_cmpCamera?: ƒ.ComponentCamera): void;
        /**
         * finds all pickSpheres within the given ray
         * @param ray the ray to check against
         * @param options options
         */
        static pick(ray: ƒ.Ray, options?: Partial<PickSpherePickOptions>): PickSphere[];
        private static get defaultOptions();
    }
    interface PickSpherePickOptions {
        /** Sets by what metric to sort the results. Unsorted if undefined */
        sortBy?: "distanceToRay" | "distanceToRayOrigin";
        branch: ƒ.Node;
    }
    export {};
}
declare namespace Script {
    import ƒ = FudgeCore;
    export function findFirstCameraInGraph(_graph: ƒ.Node): ƒ.ComponentCamera;
    export function enumToArray<T extends object>(anEnum: T): T[keyof T][];
    export function randomEnum<T extends object>(anEnum: T): T[keyof T];
    export function mobileOrTabletCheck(): boolean;
    interface CreateElementAdvancedOptions {
        classes: string[];
        id: string;
        innerHTML: string;
        attributes: [string, string][];
    }
    export function createElementAdvanced<K extends keyof HTMLElementTagNameMap>(_type: K, _options?: Partial<CreateElementAdvancedOptions>): HTMLElementTagNameMap[K];
    export function shuffleArray<T>(_array: Array<T>): Array<T>;
    export function waitMS(_ms: number): Promise<void>;
    export function randomArrayElement<T>(_array: Array<T>): T | undefined;
    export function randomRange(min?: number, max?: number): number;
    export function randomString(length: number): string;
    export function capitalize(s: string): string;
    export function getPlanePositionFromMouseEvent(_event: MouseEvent): ƒ.Vector3;
    export {};
}
