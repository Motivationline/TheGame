
namespace Script {
    import ƒ = FudgeCore;

    export class GridBuilder implements ToggleableUI {
        wrapper: HTMLElement;
        buildings: HTMLElement;
        canvas = document.querySelector("canvas");
        selectedBuilding: Build;
        marker: ƒ.Node;
        currentPosition: ƒ.Vector2;
        currentPositionOccupied: boolean;

        constructor(public grid: Grid = new Grid(new ƒ.Vector2(10, 10))) {
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;

            this.wrapper = document.getElementById("build-menu");
            this.buildings = document.getElementById("build-menu-buildings");
        }

        async enable(): Promise<void> {
            this.wrapper.classList.remove("hidden");
            this.selectedBuilding = undefined;
            this.currentPosition = undefined;
            this.canvas.addEventListener("mousemove", this.highlightGrid);
            this.canvas.addEventListener("mouseup", this.placeOnGrid);

            if (!this.marker) {
                this.generateBuildingButtons();
                let graph = <ƒ.Graph>ƒ.Project.getResourcesByName("Tile")[0];
                this.marker = await ƒ.Project.createGraphInstance(graph);
                viewport.getBranch().appendChild(this.marker);
            }
        }
        disable(): void {
            this.wrapper.classList.add("hidden");
            this.marker.activate(false);
            this.canvas.removeEventListener("mousemove", this.highlightGrid);
            this.canvas.removeEventListener("mouseup", this.placeOnGrid);
        }

        private generateBuildingButtons() {
            const buttons: HTMLButtonElement[] = [];

            for (let build of Building.all) {
                const button = document.createElement("button");
                button.innerText = `${build.name ?? build.graph.name} (${build.size}x${build.size})`;
                button.addEventListener("click", () => {
                    this.selectBuilding(build);
                });
                buttons.push(button);
            }

            this.buildings.replaceChildren(...buttons);
        }


        private highlightGrid = (_event: MouseEvent) => {
            if (!this.selectedBuilding) return;
            let tilePos = this.tilePositionFromMouseEvent(_event);
            let newPosInGrid = this.checkAndSetCurrentPosition(tilePos);
            if (newPosInGrid === false) return;
            this.marker.mtxLocal.translation = new ƒ.Vector3(this.currentPosition.x, 0.01, this.currentPosition.y);
            this.marker.activate(true);
        }

        private placeOnGrid = async (_event: MouseEvent) => {
            if (_event.button !== 0) return;
            if (!this.selectedBuilding) return;
            console.log("place on grid");
            let tilePos = this.tilePositionFromMouseEvent(_event);
            let newPosInGrid = this.checkAndSetCurrentPosition(tilePos);
            if (this.currentPositionOccupied) return;
            this.forEachSelectedTile(this.currentPosition, (tile, pos) => {
                this.grid.setTile({ type: "test", origin: this.currentPosition.equals(pos) }, pos);
            });
            this.highlightGrid(_event);

            // visually add building
            let marker = await ƒ.Project.createGraphInstance(this.selectedBuilding.graph);
            viewport.getBranch().appendChild(marker);
            marker.mtxLocal.translation = new ƒ.Vector3(this.currentPosition.x + this.selectedBuilding.size / 2, 0, this.currentPosition.y + this.selectedBuilding.size / 2);
        }

        private checkAndSetCurrentPosition(_startPos: ƒ.Vector2): boolean {
            let occupied: boolean = false;
            let valid: boolean = true;
            this.forEachSelectedTile(_startPos, (tile) => {
                if (tile === null) {
                    valid = false;
                }
                else if (tile !== undefined) {
                    occupied = true;
                }
            })
            if (!valid) return false;
            if (occupied) {
                this.changeTileColor(ƒ.Color.CSS("red"));
            } else {
                this.changeTileColor(ƒ.Color.CSS("white"));
            }
            this.currentPosition = _startPos.clone;
            this.currentPositionOccupied = occupied;
            return true;
        }

        private forEachSelectedTile(_startPos: ƒ.Vector2, callback: (tile?: Tile, pos?: ƒ.Vector2) => void) {
            let pos = ƒ.Recycler.get(ƒ.Vector2);
            for (let x: number = _startPos.x; x < _startPos.x + this.selectedBuilding.size; x++) {
                for (let y: number = _startPos.y; y < _startPos.y + this.selectedBuilding.size; y++) {
                    let tile = this.grid.getTile(pos.set(x, y));
                    callback(tile, pos);
                }
            }
            ƒ.Recycler.store(pos);
        }

        private changeTileColor(_color: ƒ.Color) {
            this.marker.getComponent(ƒ.ComponentMaterial).clrPrimary = _color;
        }

        private tilePositionFromMouseEvent(_event: MouseEvent) {
            let pos = getPlanePositionFromMouseEvent(_event);
            let tilePos = this.grid.getTilePosition(new ƒ.Vector2(pos.x, pos.z));
            return tilePos;
        }

        private selectBuilding(_build: Build) {
            this.selectedBuilding = _build;
            this.marker.mtxLocal.scaling = ƒ.Vector3.ONE(_build.size);
            this.currentPosition = undefined;
        }

    }

}