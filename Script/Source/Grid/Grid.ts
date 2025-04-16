
namespace Script {
    import ƒ = FudgeCore;

    export interface Tile {
        type: string,
        origin: boolean,
    }

    export class Grid {
        #size: ƒ.Vector2;
        #tiles: (Tile | undefined)[][] = [];

        constructor(_size: ƒ.Vector2) {
            this.size = _size;
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

        public getTile(_pos: ƒ.Vector2, inWorldCoordinates: boolean = true): Tile | undefined | null {
            if (inWorldCoordinates)
                _pos = this.worldPosToTilePos(_pos);
            if (_pos.x < 0 || _pos.y < 0) return null;
            if (_pos.x > this.#size.x - 1 || _pos.y > this.#size.y - 1) return null;
            return this.#tiles[_pos.y][_pos.x];
        }
        public setTile(_tile: Tile | undefined, _pos: ƒ.Vector2) {
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
    }

}