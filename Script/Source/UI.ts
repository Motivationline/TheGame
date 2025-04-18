/// <reference path="Grid/Controller.ts" />
/// <reference path="Jobs/JobProvider.ts" />


namespace Script {
    import ƒ = FudgeCore;

    export const availableJobs: Set<JobType> = new Set([JobType.NONE, JobType.GATHER_FOOD, JobType.GATHER_STONE, JobType.BUILD]);
    export const grid = new Grid(new ƒ.Vector2(44, 44));
    export const gridBuilder = new GridBuilder(grid)

    export interface ToggleableUI {
        enable: () => void;
        disable: () => void;
    }
    let uis: Map<string, ToggleableUI>;
    let activeUI: ToggleableUI;
    export function setupUI() {
        if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;

        uis = new Map<string, ToggleableUI>([
            ["build", gridBuilder],
            ["close", new PickController()],
            ["job", new JobController()],
        ])
        activeUI = uis.get("close");
        activeUI?.enable();

        document.querySelectorAll("button[data-target]").forEach((btn) => {
            btn.addEventListener("click", () => {
                enableUI((<HTMLElement>btn).dataset.target);
            })
        });

        new CameraController().enable();

    }

    function enableUI(_type: string) {
        let nextUI = uis.get(_type);
        if (!nextUI) return;
        if (activeUI) activeUI.disable();
        nextUI.enable();
        activeUI = nextUI;
    }

    class CameraController implements ToggleableUI {
        canvas = document.querySelector("canvas");
        camera = findFirstCameraInGraph(viewport.getBranch());
        currentZoom: number = 3;
        zoomFactor: number = 10;
        zoomFactorLimits: [number, number] = [0, 10];
        cameraPositionLimits: ƒ.Vector2 = new ƒ.Vector2(grid.size.x / 2, grid.size.y / 2);


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
            if (newZoom < this.zoomFactorLimits[0] || newZoom > this.zoomFactorLimits[1]) return;
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
                    this.prevPosition = getPlanePositionFromMousePosition(new ƒ.Vector2(_event.clientX, _event.clientY));
                    break;
                }
                case "mouseup": {
                    if (_event.button !== 2) return;
                    this.moving = false;
                    break;
                }
                case "mousemove": {
                    if (!this.moving) break;
                    let pos = getPlanePositionFromMousePosition(new ƒ.Vector2(_event.clientX, _event.clientY));
                    let diff = ƒ.Vector3.DIFFERENCE(pos, this.prevPosition).negate();


                    // console.log(_event.movementX, _event.movementY, pos, this.prevPosition, diff);
                    this.camera.node.mtxLocal.translate(diff, false);
                    requestAnimationFrame(() => {
                        this.prevPosition = getPlanePositionFromMousePosition(new ƒ.Vector2(_event.clientX, _event.clientY));
                        // check for boundaries
                        let centerPos = getPlanePositionFromMousePosition(new ƒ.Vector2(this.canvas.width / 2, this.canvas.height / 2));
                        let maxCenterPos = new ƒ.Vector3(
                            Math.min(this.cameraPositionLimits.x, Math.max(-this.cameraPositionLimits.x, centerPos.x)),
                            0,
                            Math.min(this.cameraPositionLimits.y, Math.max(-this.cameraPositionLimits.y, centerPos.z)),
                        )
                        let correction = ƒ.Vector3.DIFFERENCE(maxCenterPos, centerPos);
                        if (!correction.equals(ƒ.Vector3.ZERO())) {
                            this.camera.node.mtxLocal.translate(correction, false);
                            requestAnimationFrame(() => {
                                this.prevPosition = getPlanePositionFromMousePosition(new ƒ.Vector2(_event.clientX, _event.clientY));
                            });
                        }
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

    let selectedEumling: ƒ.Node;
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
            if (!picks.length) return;
            selectedEumling = picks[0];
            enableUI("job");
        }
        private findAllPickedObjectsUsingPickSphere(_pointer: { x: number, y: number }): ƒ.Node[] {
            const ray = viewport.getRayFromClient(new ƒ.Vector2(_pointer.x, _pointer.y));
            const picks = PickSphere.pick(ray, { sortBy: "distanceToRayOrigin" });

            return picks.map((p) => p.node);
        }
    }

    class JobController implements ToggleableUI {
        dialog: HTMLDialogElement = <HTMLDialogElement>document.getElementById("job-dialog");
        wrapper: HTMLDialogElement = <HTMLDialogElement>document.getElementById("job-wrapper");

        enable(): void {
            this.dialog.showPopover();
            this.dialog.addEventListener("toggle", <EventListener>this.close);

            let buttons: HTMLElement[] = [];
            let keys = availableJobs.values();
            for (let job of keys) {
                const btn = createElementAdvanced("button", { innerHTML: JobType[job] });
                btn.addEventListener("click", () => {
                    selectedEumling.getComponent(JobTaker).job = job;
                    enableUI("close");
                })
                buttons.push(btn);
            }
            this.wrapper.replaceChildren(...buttons);
        }
        close = (_e: ToggleEvent) => {
            if (_e.newState === "closed") {
                enableUI("close");
            }
        }

        disable = () => {
            this.dialog.removeEventListener("toggle", <EventListener>this.close);
            this.dialog.hidePopover();

        }

    }
}

