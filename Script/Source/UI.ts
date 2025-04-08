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
            ["build", new GridBuilder()],
            ["move", new CameraController()],
        ])
        let activeUI: ToggleableUI = uis.get("move");
        activeUI.enable();

        document.querySelectorAll("button[data-target]").forEach((btn) => {
            btn.addEventListener("click", () => {
                let nextUI = uis.get((<HTMLElement>btn).dataset.target);
                if (!nextUI) return;
                if (activeUI) activeUI.disable();
                nextUI.enable();
                activeUI = nextUI;
            })
        });

    }

    class CameraController implements ToggleableUI {
        wrapper: HTMLElement;
        canvas = document.querySelector("canvas");
        camera = findFirstCameraInGraph(viewport.getBranch());
        currentZoom: number = 0;
        zoomFactor: number = 10;

        constructor() {
            this.wrapper = document.getElementById("move-menu");
        }

        enable() {
            this.wrapper.classList.remove("hidden");
            this.canvas.addEventListener("wheel", this.zoom);
            this.canvas.addEventListener("mousedown", this.mouseEvent);
            this.canvas.addEventListener("mouseup", this.mouseEvent);
            this.canvas.addEventListener("mousemove", this.mouseEvent);
        };
        disable() {
            this.wrapper.classList.add("hidden");
            this.canvas.removeEventListener("wheel", this.zoom);
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
                    this.moving = true;
                    this.prevPosition = getPlanePositionFromMouseEvent(_event);
                    break;
                }
                case "mouseup": {
                    this.moving = false;
                    break;
                }
                case "mousemove": {
                    if (!this.moving) break;
                    let pos = getPlanePositionFromMouseEvent(_event);
                    let diff = pos.clone.subtract(this.prevPosition);
                    // console.log(_event.movementX, _event.movementY, pos, this.prevPosition, diff);
                    this.camera.node.mtxLocal.translate(diff.negate(), false);
                    this.prevPosition = pos;
                    // console.log(this.camera.node.mtxLocal.translation);
                    break;
                }
            }
        }
    }
}

