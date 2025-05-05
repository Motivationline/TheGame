/// <reference path="Pathfinder.ts" />

namespace Script {
    import ƒ = FudgeCore;

    export interface Tile {
        type: string,
        origin: boolean,
        node: ƒ.Node,
    }

    export class Grid {
        #size: ƒ.Vector2;
        #tiles: (Tile | undefined)[][] = [];
        #pathfinder: Pathfinder;

        constructor(_size: ƒ.Vector2) {
            this.size = _size;
            this.#pathfinder = new Pathfinder(this);
        }

        set size(_size: ƒ.Vector2) {
            this.#size = _size;
            const newTiles: (Tile | undefined)[][] = [];
            for (let y: number = 0; y < _size.y; y++) {
                newTiles[y] = [];
                for (let x: number = 0; x < _size.x; x++) {
                    newTiles[y][x] = this.#tiles[y]?.[x] ?? undefined;
                }
            }
            this.#tiles = newTiles;
        }

        get size() {
            return this.#size;
        }

        /**
         * @returns null if outside the grid, undefined if empty, else the found Tile
         */
        public getTile(_pos: ƒ.Vector2, inWorldCoordinates: boolean): Tile | undefined | null {
            if (inWorldCoordinates)
                _pos = this.worldPosToTilePos(_pos);
            if (_pos.x < 0 || _pos.y < 0) return null;
            if (_pos.x > this.#size.x - 1 || _pos.y > this.#size.y - 1) return null;
            return this.#tiles[_pos.y][_pos.x];
        }
        public setTile(_tile: Tile | undefined, _pos: ƒ.Vector2) {
            if(this.getTile(_pos, false) === null) return;
            this.#tiles[_pos.y][_pos.x] = _tile;
        }

        public worldPosToTilePos(_pos: ƒ.Vector2, _out: ƒ.Vector2 = new ƒ.Vector2()): ƒ.Vector2 {
            return _out.set(
                Math.floor(_pos.x + this.#size.x / 2),
                Math.floor(_pos.y + this.#size.y / 2),
            )
        }
        public tilePosToWorldPos(_pos: ƒ.Vector2, _out: ƒ.Vector2 = new ƒ.Vector2()): ƒ.Vector2 {
            return _out.set(
                _pos.x - this.#size.x / 2,
                _pos.y - this.#size.y / 2,
            )
        }
        public getPath(_from: ƒ.Vector2, _to: ƒ.Vector2): MovePath {
            return this.#pathfinder.getPath(_from, _to);
        }
    }

    export class GridDisplayComponent extends ƒ.Component {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(GridDisplayComponent);

        drawGizmos(_cmpCamera?: ƒ.ComponentCamera): void {
            const corners: ƒ.Vector3[] = [];
            for (let x: number = 0; x < grid.size.x; x++) {
                corners.push(
                    ƒ.Recycler.reuse(ƒ.Vector3).set(x, 0, 0),
                    ƒ.Recycler.reuse(ƒ.Vector3).set(x, 0, grid.size.y),
                )
            }
            for (let y: number = 0; y < grid.size.y; y++) {
                corners.push(
                    ƒ.Recycler.reuse(ƒ.Vector3).set(0, 0, y),
                    ƒ.Recycler.reuse(ƒ.Vector3).set(grid.size.x, 0.01, y),
                )
            }
            let mtx = ƒ.Recycler.get(ƒ.Matrix4x4);
            mtx.translateX(-grid.size.x / 2);
            mtx.translateZ(-grid.size.y / 2);
            ƒ.Gizmos.drawLines(corners, mtx, new ƒ.Color(0, 0, 0, 1));
            corners.forEach(v => ƒ.Recycler.store(v));
            ƒ.Recycler.store(mtx)
        }
    }
}