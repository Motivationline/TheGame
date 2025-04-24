
namespace Script {
    import ƒ = FudgeCore;

    export class GridBuilder implements ToggleableInteraction {
        wrapper: HTMLElement;
        buildings: HTMLElement;
        canvas = document.querySelector("canvas");
        selectedBuilding: Build;
        marker: ƒ.Node;
        currentPosition: ƒ.Vector2;
        currentWorldPosition: ƒ.Vector2;
        currentPositionOccupied: boolean;

        constructor(public grid: Grid = new Grid(new ƒ.Vector2(10, 10))) {
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;

            this.wrapper = document.getElementById("build-menu").parentElement;
            this.buildings = document.getElementById("build-menu-buildings");

            // set center to occupied
            let pos: ƒ.Vector2 = new ƒ.Vector2();
            for (let y: number = -2; y <= 2; y++) {
                for (let x: number = -2; x <= 2; x++) {
                    this.grid.setTile({ origin: false, type: "goddess" }, pos.set(Math.floor(grid.size.x / 2) + x, Math.floor(grid.size.y / 2) + y));
                }
            }
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
                if (!build.includeInMenu) continue;
                const button = createElementAdvanced("button", {
                    innerHTML: `
                    <span class="build-name">${build.name ?? build.graph.name}</span>
                    <img src="Assets/UI/${build.name.toLocaleLowerCase()}_button.svg" />
                    <div class="build-cost">
                        <span class="build-cost-food">${build.costFood}</span>
                        <span class="build-cost-stone">${build.costStone}</span>
                    </div>
                    <span class="build-description">${build.description}</span>`,
                    classes: ["build", "no-button"],
                })
                if (Data.food < build.costFood || Data.stone < build.costStone) button.disabled = true;
                button.dataset.costFood = build.costFood.toString();
                button.dataset.costStone = build.costStone.toString();
                button.addEventListener("click", () => {
                    this.selectBuilding(build);
                });
                buttons.push(button);
            }

            this.buildings.replaceChildren(...buttons);
            Data.food += 0;
        }


        private highlightGrid = (_event: MouseEvent) => {
            if (!this.selectedBuilding) return;
            let tilePos = this.tilePositionFromMouseEvent(_event);
            let newPosInGrid = this.checkAndSetCurrentPosition(tilePos);
            if (newPosInGrid === false) return;
            this.marker.mtxLocal.translation = new ƒ.Vector3(this.currentWorldPosition.x, 0.01, this.currentWorldPosition.y);
            this.marker.activate(true);
        }

        private placeOnGrid = async (_event: MouseEvent) => {
            if (_event.button !== 0) return;
            if (!this.selectedBuilding) return;
            if (!Data.buyBuilding(this.selectedBuilding)) return;
            let tilePos = this.tilePositionFromMouseEvent(_event);
            this.checkAndSetCurrentPosition(tilePos);
            if (this.currentPositionOccupied) return;
            this.forEachSelectedTile(this.currentPosition, this.selectedBuilding.size, (tile, pos) => {
                this.grid.setTile({ type: "test", origin: this.currentPosition.equals(pos) }, pos);
            });
            this.highlightGrid(_event);

            let marker = await this.placeGraphOnGrid(this.currentPosition, this.selectedBuilding.size, this.selectedBuilding.graph);

            // make it so building needs to be built before it takes effect
            getDerivedComponents(marker, JobProvider).forEach((jobCmp) => { jobCmp.activate(false); });
            marker.getComponents(BonusProvider).forEach((bonusCmp) => { bonusCmp.activate(false) });

            const buildupCmp = new JobProviderBuild(this.selectedBuilding.costFood + this.selectedBuilding.costStone);
            marker.addComponent(buildupCmp);

            // place temporary node & hide current child
            let graphToPlace = marker.getComponent(BuildData)?.buildUpGraph;
            if (graphToPlace) {
                let placeholder = await ƒ.Project.createGraphInstance(graphToPlace);
                buildupCmp.nodeToRemove = placeholder;
                marker.addChild(placeholder);
                
                buildupCmp.nodeToEnable = marker.getChild(0);
                marker.getChild(0)?.activate(false);
            }

            // close this UI
            enableUI("close");
        }

        public async placeGraphOnGrid(_posOfTile: ƒ.Vector2, _size: number, _graph: ƒ.Graph): Promise<ƒ.Node> {
            this.forEachSelectedTile(_posOfTile, _size, (t, pos) => {
                this.grid.setTile({ type: "test", origin: _posOfTile.equals(pos) }, pos);
            });

            // visually add building
            let marker = await ƒ.Project.createGraphInstance(_graph);
            viewport.getBranch().appendChild(marker);
            let worldPos = this.grid.tilePosToWorldPos(_posOfTile);
            marker.mtxLocal.translation = new ƒ.Vector3(worldPos.x + _size / 2, 0, worldPos.y + _size / 2);

            setTimeout(() => {
                EumlingCreator.updateButton();
            }, 1);

            return marker;
        }

        private checkAndSetCurrentPosition(_startPos: ƒ.Vector2): boolean {
            let occupied: boolean = false;
            let valid: boolean = true;
            this.forEachSelectedTile(_startPos, this.selectedBuilding.size, (tile) => {
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
            this.currentWorldPosition = this.grid.tilePosToWorldPos(this.currentPosition);
            this.currentPositionOccupied = occupied;
            return true;
        }

        private forEachSelectedTile(_startPos: ƒ.Vector2, _size: number, callback: (tile?: Tile, pos?: ƒ.Vector2) => void) {
            let pos = ƒ.Recycler.get(ƒ.Vector2);
            for (let x: number = _startPos.x; x < _startPos.x + _size; x++) {
                for (let y: number = _startPos.y; y < _startPos.y + _size; y++) {
                    let tile = this.grid.getTile(pos.set(x, y), false);
                    callback(tile, pos);
                }
            }
            ƒ.Recycler.store(pos);
        }

        private changeTileColor(_color: ƒ.Color) {
            this.marker.getComponent(ƒ.ComponentMaterial).clrPrimary = _color;
        }

        private tilePositionFromMouseEvent(_event: MouseEvent): ƒ.Vector2 {
            let pos = getPlanePositionFromMousePosition(new ƒ.Vector2(_event.clientX, _event.clientY));
            let tilePos = this.grid.worldPosToTilePos(new ƒ.Vector2(pos.x, pos.z));
            return tilePos;
        }

        private selectBuilding(_build: Build) {
            this.selectedBuilding = _build;
            this.marker.mtxLocal.scaling = ƒ.Vector3.ONE(_build.size);
            this.currentPosition = undefined;
            
            this.wrapper.classList.add("hidden");
        }

    }

}