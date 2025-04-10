/// <reference path="Grid/Controller.ts" />


namespace Script {
    import ƒ = FudgeCore;

    export interface ToggleableUI {
        enable: () => void;
        disable: () => void;
    }

    export function setupUI() {
        if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;

        const uis = new Map<string, ToggleableUI>([
            ["build", new GridBuilder(new Grid(new ƒ.Vector2(44, 44)))],
            ["close", new PickController()],
        ])
        let activeUI: ToggleableUI = uis.get("close");
        activeUI?.enable();

        document.querySelectorAll("button[data-target]").forEach((btn) => {
            btn.addEventListener("click", () => {
                let nextUI = uis.get((<HTMLElement>btn).dataset.target);
                if (!nextUI) return;
                if (activeUI) activeUI.disable();
                nextUI.enable();
                activeUI = nextUI;
            })
        });

        new CameraController().enable();

    }

    class CameraController implements ToggleableUI {
        canvas = document.querySelector("canvas");
        camera = findFirstCameraInGraph(viewport.getBranch());
        currentZoom: number = 0;
        zoomFactor: number = 10;


        enable() {
            this.canvas.addEventListener("wheel", this.zoom);
            this.canvas.addEventListener("mousedown", this.mouseEvent);
            this.canvas.addEventListener("mouseup", this.mouseEvent);
            this.canvas.addEventListener("mousemove", this.mouseEvent);
            this.canvas.addEventListener("contextmenu", this.preventDefault);
        };
        disable() {
            this.canvas.removeEventListener("wheel", this.zoom);
            this.canvas.removeEventListener("mousedown", this.mouseEvent);
            this.canvas.removeEventListener("mouseup", this.mouseEvent);
            this.canvas.removeEventListener("mousemove", this.mouseEvent);
            this.canvas.removeEventListener("contextmenu", this.preventDefault);
        };

        private zoom = (_event: WheelEvent) => {
            const direction = -Math.sign(_event.deltaY);

            const newZoom = this.currentZoom + direction;
            if (newZoom < 0 || newZoom > 10) return;
            this.currentZoom += direction;

            this.camera.node.mtxLocal.translateZ(direction * this.zoomFactor, true);

        }

        moving = false;
        prevPosition: ƒ.Vector3;
        private mouseEvent = (_event: MouseEvent) => {
            switch (_event.type) {
                case "mousedown": {
                    if (_event.button !== 2) return;
                    this.moving = true;
                    this.prevPosition = getPlanePositionFromMouseEvent(_event);
                    break;
                }
                case "mouseup": {
                    if (_event.button !== 2) return;
                    this.moving = false;
                    break;
                }
                case "mousemove": {
                    if (!this.moving) break;
                    let pos = getPlanePositionFromMouseEvent(_event);
                    let diff = pos.clone.subtract(this.prevPosition);
                    // console.log(_event.movementX, _event.movementY, pos, this.prevPosition, diff);
                    this.camera.node.mtxLocal.translate(diff.negate(), false);
                    requestAnimationFrame(() => {
                        this.prevPosition = getPlanePositionFromMouseEvent(_event);
                    })
                    // console.log(this.camera.node.mtxLocal.translation);
                    break;
                }
            }
        }

        private preventDefault = (_e: Event) => {
            _e.preventDefault();
        }
    }

    class PickController implements ToggleableUI {
        canvas = document.querySelector("canvas");
        wrapper = document.getElementById("main-menu");

        enable() {
            this.wrapper.classList.remove("hidden");
            this.canvas.addEventListener("click", this.click);
        }

        disable() {
            this.wrapper.classList.add("hidden");
            this.canvas.removeEventListener("click", this.click);
        }

        private click = (_event: MouseEvent) => {
            let picks = this.findAllPickedObjectsUsingPickSphere({ x: _event.clientX, y: _event.clientY });
            console.log(picks);
        }
        private findAllPickedObjectsUsingPickSphere(_pointer: { x: number, y: number }): ƒ.Node[] {
            const ray = viewport.getRayFromClient(new ƒ.Vector2(_pointer.x, _pointer.y));
            const picks = PickSphere.pick(ray, { sortBy: "distanceToRayOrigin" });

            return picks.map((p) => p.node);
        }
    }
}

