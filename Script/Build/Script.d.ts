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
        getTilePosition(_pos: ƒ.Vector2, _out?: ƒ.Vector2): ƒ.Vector2;
        getTile(_pos: ƒ.Vector2): Tile | undefined | null;
        setTile(_tile: Tile | undefined, _pos: ƒ.Vector2): void;
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
