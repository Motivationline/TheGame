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
    enum BonusType {
        ADD = 0,
        MULTIPLY = 1
    }
    enum BonusData {
        EUMLING_AMOUNT = 0,
        STONE = 1,
        FOOD = 2
    }
    class BonusProvider extends UpdateScriptComponent {
        bonusType: BonusType;
        bonusData: BonusData;
        amount: number;
        static BonusProviders: Map<BonusData, Set<BonusProvider>>;
        start(_e: CustomEvent<UpdateEvent>): void;
        remove(_e: CustomEvent): void;
        static getBonus(data: BonusData, startAmount?: number): number;
    }
}
declare namespace Script {
    export class Data {
        #private;
        static set food(_food: number);
        static set stone(_stone: number);
        static get food(): number;
        static get stone(): number;
        static get eumlingLimit(): number;
        static buildingCost(build: Build): BuildCost;
        static canAffordBuilding(building: Build): boolean;
        static buyBuilding(building: Build): boolean;
        private static updateCostButtons;
    }
    interface BuildCost {
        stone: number;
        food: number;
    }
    export {};
}
declare namespace Script {
    class EumlingCreator {
        private static eumlingPriceMultiplier;
        static eumlingPrices: {
            stone: number;
            food: number;
        }[];
        static eumlingAmount: number;
        static createEumling: () => Promise<void>;
        static updateButton(): void;
        static eumlingPrice(_eumlingNumber: number): {
            stone: number;
            food: number;
        };
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    export class Pathfinder {
        private grid;
        openList: Map<string, AStarNode>;
        closedList: Set<string>;
        target: ƒ.Vector2;
        constructor(grid: Grid);
        getPath(_from: ƒ.Vector2, _to: ƒ.Vector2): MovePath;
        private nodesToArray;
        private expandNode;
        private expandNodeNeighbor;
    }
    interface AStarNode {
        node: ƒ.Vector2;
        previous?: AStarNode;
        f: number;
        g: number;
        blocked: boolean;
    }
    export {};
}
declare namespace Script {
    import ƒ = FudgeCore;
    interface Tile {
        type: string;
        origin: boolean;
        node: ƒ.Node;
    }
    class Grid {
        #private;
        constructor(_size: ƒ.Vector2);
        set size(_size: ƒ.Vector2);
        get size(): ƒ.Vector2;
        /**
         * @returns null if outside the grid, undefined if empty, else the found Tile
         */
        getTile(_pos: ƒ.Vector2, inWorldCoordinates: boolean): Tile | undefined | null;
        setTile(_tile: Tile | undefined, _pos: ƒ.Vector2): void;
        worldPosToTilePos(_pos: ƒ.Vector2, _out?: ƒ.Vector2): ƒ.Vector2;
        tilePosToWorldPos(_pos: ƒ.Vector2, _out?: ƒ.Vector2): ƒ.Vector2;
        getPath(_from: ƒ.Vector2, _to: ƒ.Vector2): MovePath;
    }
    class GridDisplayComponent extends ƒ.Component {
        static readonly iSubclass: number;
        drawGizmos(_cmpCamera?: ƒ.ComponentCamera): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GridBuilder implements ToggleableInteraction {
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
        placeGraphOnGrid(_posOfTile: ƒ.Vector2, _size: number, _graph: ƒ.Graph): Promise<ƒ.Node>;
        private checkAndSetCurrentPosition;
        private forEachSelectedTile;
        private changeTileColor;
        private tilePositionFromMouseEvent;
        private selectBuilding;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    export enum JobType {
        GATHER_STONE = 0,
        GATHER_FOOD = 1,
        STORE_RESOURCE = 2,
        BUILD = 3,
        NONE = 4
    }
    interface JobTypeInfo {
        name: string;
        description: string;
        img: string;
    }
    export const jobTypeInfo: Map<JobType, JobTypeInfo>;
    export abstract class JobProvider extends UpdateScriptComponent {
        #private;
        static JobProviders: Set<JobProvider>;
        protected _jobType: JobType;
        jobDuration: number;
        cooldown: number;
        animationActive: ƒ.Animation;
        animationCooldown: ƒ.Animation;
        start(_e: CustomEvent<UpdateEvent>): void;
        remove(_e: CustomEvent): void;
        jobStart(): void;
        jobFinish(): void;
        target(_targeted: boolean): void;
        get jobType(): JobType;
        get targeted(): boolean;
        update(_e: CustomEvent<UpdateEvent>): void;
    }
    export class JobProviderNone extends JobProvider {
        _jobType: JobType;
    }
    export class JobProviderGatherFood extends JobProvider {
        _jobType: JobType;
        jobDuration: number;
    }
    export class JobProviderGatherStone extends JobProvider {
        _jobType: JobType;
        jobDuration: number;
    }
    export class JobProviderStoreResource extends JobProvider {
        jobDuration: number;
        _jobType: JobType;
        cooldown: number;
        target(_targeted: boolean): void;
    }
    export class JobProviderBuild extends JobProvider {
        _jobType: JobType;
        nodeToRemove: ƒ.Node;
        nodeToEnable: ƒ.Node;
        constructor(resourceAmt: number);
        jobFinish(): void;
    }
    export {};
}
declare namespace Script {
    const availableJobs: Set<JobType>;
    const grid: Grid;
    const gridBuilder: GridBuilder;
    interface ToggleableInteraction {
        enable: () => void;
        disable: () => void;
    }
    function setupUI(): void;
    function enableUI(_type: string): void;
}
declare namespace Script {
    import ƒ = FudgeCore;
    export function findFirstComponentInGraph<T extends ƒ.Component>(_graph: ƒ.Node, _cmp: new () => T): T;
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
    export function getPlanePositionFromMousePosition(_mousePosition: ƒ.Vector2): ƒ.Vector3;
    export function getDerivedComponent<T extends ƒ.Component>(node: ƒ.Node, component: abstract new () => T): T | undefined;
    export function getDerivedComponents<T extends ƒ.Component>(node: ƒ.Node, component: abstract new () => T): T[];
    export function vector2Distance(_a: ƒ.Vector2, _b: ƒ.Vector2): number;
    export {};
}
declare namespace Script {
    export type Setting = SettingCategory | SettingNumber | SettingString;
    interface SettingsBase {
        type: string;
        name: string;
    }
    export interface SettingCategory extends SettingsBase {
        type: "category";
        settings: Setting[];
    }
    export interface SettingString extends SettingsBase {
        type: "string";
        value: string;
    }
    export interface SettingNumber extends SettingsBase {
        type: "number";
        value: number;
        min: number;
        max: number;
        step: number;
        variant: "range" | "percent";
    }
    export class Settings {
        private static settings;
        static proxySetting<T extends Setting>(_setting: T, onValueChange: (_old: any, _new: any) => void): T;
        static addSettings(..._settings: Setting[]): void;
        static generateHTML(_settings?: Setting[]): HTMLElement;
        private static generateSingleHTML;
        private static generateStringInput;
        private static generateNumberInput;
    }
    export {};
}
declare namespace Script {
    enum AUDIO_CHANNEL {
        MASTER = 0,
        SOUNDS = 1,
        MUSIC = 2
    }
    class AudioManager {
        private static Instance;
        private gainNodes;
        private constructor();
        static addAudioCmpToChannel(_cmpAudio: ComponentAudioMixed, _channel: AUDIO_CHANNEL): void;
        static setChannelVolume(_channel: AUDIO_CHANNEL, _volume: number): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ComponentAudioMixed extends ƒ.ComponentAudio {
        #private;
        static readonly iSubclass: number;
        private gainTarget;
        private isConnected;
        constructor(_audio?: ƒ.Audio, _loop?: boolean, _start?: boolean, _audioManager?: ƒ.AudioManager, _channel?: AUDIO_CHANNEL);
        get channel(): AUDIO_CHANNEL;
        set channel(_channel: AUDIO_CHANNEL);
        setGainTarget(node: AudioNode): void;
        connect(_on: boolean): void;
        fadeTo(_volume: number, _duration: number): void;
        drawGizmos(): void;
    }
}
declare namespace Script {
    class MusicController {
        #private;
        constructor();
        private checkEumlings;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    abstract class SoundEmitter extends UpdateScriptComponent {
        #private;
        static readonly iSubclass: number;
        protected singleton: boolean;
        volume: number;
        local: boolean;
        addRandomness: boolean;
        channel: AUDIO_CHANNEL;
        mtxPivot: ƒ.Matrix4x4;
        boxSize: ƒ.Vector3;
        surfaceOfBoxOnly: boolean;
        s0: ƒ.Audio;
        s1: ƒ.Audio;
        s2: ƒ.Audio;
        s3: ƒ.Audio;
        s4: ƒ.Audio;
        s5: ƒ.Audio;
        s6: ƒ.Audio;
        s7: ƒ.Audio;
        s8: ƒ.Audio;
        s9: ƒ.Audio;
        s10: ƒ.Audio;
        s11: ƒ.Audio;
        s12: ƒ.Audio;
        s13: ƒ.Audio;
        s14: ƒ.Audio;
        s15: ƒ.Audio;
        s16: ƒ.Audio;
        s17: ƒ.Audio;
        s18: ƒ.Audio;
        s19: ƒ.Audio;
        start(_e: CustomEvent<UpdateEvent>): void;
        playRandomSound: () => void;
        private getTranslation;
        drawGizmos(_cmpCamera?: ƒ.ComponentCamera): void;
    }
    class SoundEmitterInterval extends SoundEmitter {
        static readonly iSubclass: number;
        minWaitTimeMS: number;
        maxWaitTimeMS: number;
        start(_e: CustomEvent<UpdateEvent>): void;
        private startTimer;
    }
    class SoundEmitterOnEvent extends SoundEmitter {
        static readonly iSubclass: number;
        event: string;
        start(_e: CustomEvent<UpdateEvent>): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    interface Build {
        graph: ƒ.Graph;
        size: number;
        name: string;
        description: string;
        costFood: number;
        costStone: number;
        includeInMenu: boolean;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class BuildData extends UpdateScriptComponent {
        interactionRadius: number;
        buildUpGraph: ƒ.Graph;
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
        description: string;
        costFood: number;
        costStone: number;
        includeInMenu: boolean;
        constructor();
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    type AnimationType = JobType | NonJobAnimations;
    enum NonJobAnimations {
        WALK = "walk",
        SELECTED = "selected"
    }
    class JobAnimation extends UpdateScriptComponent {
        #private;
        modelBase: ƒ.Graph;
        modelMine: ƒ.Graph;
        modelBuild: ƒ.Graph;
        modelFood: ƒ.Graph;
        animIdle: ƒ.Animation;
        animWalk: ƒ.Animation;
        animGatherFood: ƒ.Animation;
        animGatherStone: ƒ.Animation;
        animBuild: ƒ.Animation;
        animSelected: ƒ.Animation;
        start(_e: CustomEvent<UpdateEvent>): Promise<void>;
        playAnimation(anim: AnimationType): void;
        setModel(model: JobType): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    type MovePath = ƒ.Vector2[];
    class MoveTo extends UpdateScriptComponent {
        #private;
        static readonly iSubclass: number;
        speed: number;
        start(_e: CustomEvent<UpdateEvent>): void;
        update(_e: CustomEvent<UpdateEvent>): void;
        setPath(_path: MovePath): void;
        setTarget(_pos: ƒ.Vector2, inWorldCoordinates?: boolean): MovePath;
        private setNextTarget;
        protected moveToTarget(deltaTime: number): boolean;
        drawGizmos(_cmpCamera?: ƒ.ComponentCamera): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class JobTaker extends MoveTo {
        #private;
        static readonly iSubclass: number;
        speed: number;
        constructor();
        set job(_job: JobType);
        set paused(_paused: boolean);
        static findClosestJobProviderWithPath(_job: JobType, _location: ƒ.Vector3): {
            job: JobProvider;
            path: MovePath;
        } | undefined;
        static findPathToJobProvider(_job: JobProvider, _startLocation: ƒ.Vector3): MovePath | undefined;
        start(_e: CustomEvent<UpdateEvent>): void;
        update(_e: CustomEvent<UpdateEvent>): void;
        moveAwayNow(): void;
        private gatherResource;
        private build;
        private idle;
        private pause;
        private unpause;
        private removeTarget;
        protected moveToTarget(deltaTime: number): boolean;
        private findAndSetTargetForJob;
        drawGizmos(_cmpCamera?: ƒ.ComponentCamera): void;
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
