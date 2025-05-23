namespace Script {
    import ƒ = FudgeCore;

    export function findFirstComponentInGraph<T extends ƒ.Component>(_graph: ƒ.Node, _cmp: new () => T): T {
        let foundCmp = _graph.getComponent(_cmp);
        if (foundCmp) return foundCmp;
        for (let child of _graph.getChildren()) {
            foundCmp = findFirstComponentInGraph(child, _cmp);
            if (foundCmp) return foundCmp;
        }
        return undefined;
    }

    export function enumToArray<T extends object>(anEnum: T): T[keyof T][] {
        return Object.keys(anEnum)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
    }

    export function randomEnum<T extends object>(anEnum: T): T[keyof T] {
        const enumValues = enumToArray(anEnum);
        const randomIndex = Math.floor(Math.random() * enumValues.length)
        const randomEnumValue = enumValues[randomIndex]
        return randomEnumValue;
    }

    export function mobileOrTabletCheck() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    interface CreateElementAdvancedOptions {
        classes: string[],
        id: string,
        innerHTML: string,
        attributes: [string, string][],
    }
    export function createElementAdvanced<K extends keyof HTMLElementTagNameMap>(_type: K, _options: Partial<CreateElementAdvancedOptions> = {}): HTMLElementTagNameMap[K] {
        let el = document.createElement(_type);

        if (_options.id) {
            el.id = _options.id;
        }
        if (_options.classes) {
            el.classList.add(..._options.classes);
        }
        if (_options.innerHTML) {
            el.innerHTML = _options.innerHTML;
        }
        if (_options.attributes) {
            for (let attribute of _options.attributes) {
                el.setAttribute(attribute[0], attribute[1]);
            }
        }

        return el;
    }

    export function shuffleArray<T>(_array: Array<T>): Array<T> {
        for (let i: number = _array.length - 1; i >= 0; i--) {
            const k = Math.floor(Math.random() * (i + 1));
            [_array[i], _array[k]] = [_array[k], _array[i]];
        }
        return _array;
    }

    export async function waitMS(_ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, _ms);
        })
    }

    export function randomArrayElement<T>(_array: Array<T>): T | undefined {
        if (_array.length === 0) return undefined;
        return _array[Math.floor(Math.random() * _array.length)];
    }

    export function randomRange(min: number = 0, max: number = 1): number {
        const range = max - min;
        return Math.random() * range + min;
    }

    export function randomString(length: number): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let counter = 0; counter < length; counter++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    export function capitalize(s: string): string {
        return s.charAt(0).toLocaleUpperCase() + s.slice(1);
    }

    export function getPlanePositionFromMousePosition(_mousePosition: ƒ.Vector2): ƒ.Vector3 {
        let ray = viewport.getRayFromClient(_mousePosition);
        let pos = ray.intersectPlane(ƒ.Vector3.ZERO(), ƒ.Vector3.Y(1));
        return pos;
    }

    export function getDerivedComponent<T extends ƒ.Component>(node: ƒ.Node, component: abstract new () => T): T | undefined {
        return <T>node.getAllComponents().find(c => (c instanceof component));
    }
    export function getDerivedComponents<T extends ƒ.Component>(node: ƒ.Node, component: abstract new () => T): T[] {
        return <T[]>node.getAllComponents().filter(c => (c instanceof component));
    }
    export function vector2Distance(_a: ƒ.Vector2, _b: ƒ.Vector2): number {
        return Math.sqrt(
            Math.pow(_a.x - _b.x, 2) +
            Math.pow(_a.y - _b.y, 2)
        )
    }
}
