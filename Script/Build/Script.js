"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript); }
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Grid {
        #size;
        #tiles = [];
        constructor(_size) {
            this.size = _size;
        }
        set size(_size) {
            this.#size = _size;
            const newTiles = [];
            for (let y = 0; y < _size.y; y++) {
                newTiles[y] = [];
                for (let x = 0; x < _size.x; x++) {
                    newTiles[y][x] = this.#tiles[y]?.[x] ?? undefined;
                }
            }
            this.#tiles = newTiles;
        }
        getTilePosition(_pos, _out = new ƒ.Vector2()) {
            return _out.set(Math.floor(_pos.x), Math.floor(_pos.y));
        }
        getTile(_pos) {
            if (_pos.x < 0 || _pos.y < 0)
                return null;
            if (_pos.x > this.#size.x - 1 || _pos.y > this.#size.y - 1)
                return null;
            return this.#tiles[_pos.y][_pos.x];
        }
        setTile(_tile, _pos) {
            this.#tiles[_pos.y][_pos.x] = _tile;
        }
    }
    Script.Grid = Grid;
})(Script || (Script = {}));
/// <reference path="Grid/Grid.ts" />
var Script;
/// <reference path="Grid/Grid.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    document.addEventListener("interactiveViewportStarted", start);
    const canvas = document.querySelector("canvas");
    async function start(_event) {
        Script.viewport = _event.detail;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        Script.UpdateScriptComponent.updateAllInBranch(Script.viewport.getBranch());
        Script.viewport.draw();
        // ƒ.AudioManager.default.update();
    }
    document.addEventListener("click", startViewport, { once: true });
    async function startViewport() {
        await ƒ.Project.loadResourcesFromHTML();
        let graphId /* : string */ = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        let graph = ƒ.Project.resources[graphId];
        Script.viewport = new ƒ.Viewport();
        let camera = Script.findFirstCameraInGraph(graph);
        Script.viewport.initialize("game", graph, camera, canvas);
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: Script.viewport }));
        Script.setupUI();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class GridBuilder {
        constructor(grid = new Script.Grid(new ƒ.Vector2(10, 10))) {
            this.grid = grid;
            this.canvas = document.querySelector("canvas");
            this.highlightGrid = (_event) => {
                if (!this.selectedBuilding)
                    return;
                let tilePos = this.tilePositionFromMouseEvent(_event);
                let newPosInGrid = this.checkAndSetCurrentPosition(tilePos);
                if (newPosInGrid === false)
                    return;
                this.marker.mtxLocal.translation = new ƒ.Vector3(this.currentPosition.x, 0.01, this.currentPosition.y);
                this.marker.activate(true);
            };
            this.placeOnGrid = async (_event) => {
                if (_event.button !== 0)
                    return;
                if (!this.selectedBuilding)
                    return;
                console.log("place on grid");
                let tilePos = this.tilePositionFromMouseEvent(_event);
                let newPosInGrid = this.checkAndSetCurrentPosition(tilePos);
                if (this.currentPositionOccupied)
                    return;
                this.forEachSelectedTile(this.currentPosition, (tile, pos) => {
                    this.grid.setTile({ type: "test", origin: this.currentPosition.equals(pos) }, pos);
                });
                this.highlightGrid(_event);
                // visually add building
                let marker = await ƒ.Project.createGraphInstance(this.selectedBuilding.graph);
                Script.viewport.getBranch().appendChild(marker);
                marker.mtxLocal.translation = new ƒ.Vector3(this.currentPosition.x + this.selectedBuilding.size / 2, 0, this.currentPosition.y + this.selectedBuilding.size / 2);
            };
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            this.wrapper = document.getElementById("build-menu");
            this.buildings = document.getElementById("build-menu-buildings");
        }
        async enable() {
            this.wrapper.classList.remove("hidden");
            this.selectedBuilding = undefined;
            this.currentPosition = undefined;
            this.canvas.addEventListener("mousemove", this.highlightGrid);
            this.canvas.addEventListener("mouseup", this.placeOnGrid);
            if (!this.marker) {
                this.generateBuildingButtons();
                let graph = ƒ.Project.getResourcesByName("Tile")[0];
                this.marker = await ƒ.Project.createGraphInstance(graph);
                Script.viewport.getBranch().appendChild(this.marker);
            }
        }
        disable() {
            this.wrapper.classList.add("hidden");
            this.marker.activate(false);
            this.canvas.removeEventListener("mousemove", this.highlightGrid);
            this.canvas.removeEventListener("mouseup", this.placeOnGrid);
        }
        generateBuildingButtons() {
            const buttons = [];
            for (let build of Script.Building.all) {
                const button = document.createElement("button");
                button.innerText = `${build.name ?? build.graph.name} (${build.size}x${build.size})`;
                button.addEventListener("click", () => {
                    this.selectBuilding(build);
                });
                buttons.push(button);
            }
            this.buildings.replaceChildren(...buttons);
        }
        checkAndSetCurrentPosition(_startPos) {
            let occupied = false;
            let valid = true;
            this.forEachSelectedTile(_startPos, (tile) => {
                if (tile === null) {
                    valid = false;
                }
                else if (tile !== undefined) {
                    occupied = true;
                }
            });
            if (!valid)
                return false;
            if (occupied) {
                this.changeTileColor(ƒ.Color.CSS("red"));
            }
            else {
                this.changeTileColor(ƒ.Color.CSS("white"));
            }
            this.currentPosition = _startPos.clone;
            this.currentPositionOccupied = occupied;
            return true;
        }
        forEachSelectedTile(_startPos, callback) {
            let pos = ƒ.Recycler.get(ƒ.Vector2);
            for (let x = _startPos.x; x < _startPos.x + this.selectedBuilding.size; x++) {
                for (let y = _startPos.y; y < _startPos.y + this.selectedBuilding.size; y++) {
                    let tile = this.grid.getTile(pos.set(x, y));
                    callback(tile, pos);
                }
            }
            ƒ.Recycler.store(pos);
        }
        changeTileColor(_color) {
            this.marker.getComponent(ƒ.ComponentMaterial).clrPrimary = _color;
        }
        tilePositionFromMouseEvent(_event) {
            let pos = Script.getPlanePositionFromMouseEvent(_event);
            let tilePos = this.grid.getTilePosition(new ƒ.Vector2(pos.x, pos.z));
            return tilePos;
        }
        selectBuilding(_build) {
            this.selectedBuilding = _build;
            this.marker.mtxLocal.scaling = ƒ.Vector3.ONE(_build.size);
            this.currentPosition = undefined;
        }
    }
    Script.GridBuilder = GridBuilder;
})(Script || (Script = {}));
/// <reference path="Grid/Controller.ts" />
var Script;
/// <reference path="Grid/Controller.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    function setupUI() {
        if (ƒ.Project.mode === ƒ.MODE.EDITOR)
            return;
        const uis = new Map([
            ["build", new Script.GridBuilder(new Script.Grid(new ƒ.Vector2(21, 21)))],
            ["close", new PickController()],
        ]);
        let activeUI = uis.get("close");
        activeUI?.enable();
        document.querySelectorAll("button[data-target]").forEach((btn) => {
            btn.addEventListener("click", () => {
                let nextUI = uis.get(btn.dataset.target);
                if (!nextUI)
                    return;
                if (activeUI)
                    activeUI.disable();
                nextUI.enable();
                activeUI = nextUI;
            });
        });
        new CameraController().enable();
    }
    Script.setupUI = setupUI;
    class CameraController {
        constructor() {
            this.canvas = document.querySelector("canvas");
            this.camera = Script.findFirstCameraInGraph(Script.viewport.getBranch());
            this.currentZoom = 0;
            this.zoomFactor = 10;
            this.zoom = (_event) => {
                const direction = -Math.sign(_event.deltaY);
                const newZoom = this.currentZoom + direction;
                if (newZoom < 0 || newZoom > 10)
                    return;
                this.currentZoom += direction;
                this.camera.node.mtxLocal.translateZ(direction * this.zoomFactor, true);
            };
            this.moving = false;
            this.mouseEvent = (_event) => {
                switch (_event.type) {
                    case "mousedown": {
                        if (_event.button !== 2)
                            return;
                        this.moving = true;
                        this.prevPosition = Script.getPlanePositionFromMouseEvent(_event);
                        break;
                    }
                    case "mouseup": {
                        if (_event.button !== 2)
                            return;
                        this.moving = false;
                        break;
                    }
                    case "mousemove": {
                        if (!this.moving)
                            break;
                        let pos = Script.getPlanePositionFromMouseEvent(_event);
                        let diff = pos.clone.subtract(this.prevPosition);
                        // console.log(_event.movementX, _event.movementY, pos, this.prevPosition, diff);
                        this.camera.node.mtxLocal.translate(diff.negate(), false);
                        requestAnimationFrame(() => {
                            this.prevPosition = Script.getPlanePositionFromMouseEvent(_event);
                        });
                        // console.log(this.camera.node.mtxLocal.translation);
                        break;
                    }
                }
            };
            this.preventDefault = (_e) => {
                _e.preventDefault();
            };
        }
        enable() {
            this.canvas.addEventListener("wheel", this.zoom);
            this.canvas.addEventListener("mousedown", this.mouseEvent);
            this.canvas.addEventListener("mouseup", this.mouseEvent);
            this.canvas.addEventListener("mousemove", this.mouseEvent);
            this.canvas.addEventListener("contextmenu", this.preventDefault);
        }
        ;
        disable() {
            this.canvas.removeEventListener("wheel", this.zoom);
            this.canvas.removeEventListener("mousedown", this.mouseEvent);
            this.canvas.removeEventListener("mouseup", this.mouseEvent);
            this.canvas.removeEventListener("mousemove", this.mouseEvent);
            this.canvas.removeEventListener("contextmenu", this.preventDefault);
        }
        ;
    }
    class PickController {
        constructor() {
            this.canvas = document.querySelector("canvas");
            this.wrapper = document.getElementById("main-menu");
            this.click = (_event) => {
                let picks = this.findAllPickedObjectsUsingPickSphere({ x: _event.clientX, y: _event.clientY });
                console.log(picks);
            };
        }
        enable() {
            this.wrapper.classList.remove("hidden");
            this.canvas.addEventListener("click", this.click);
        }
        disable() {
            this.wrapper.classList.add("hidden");
            this.canvas.removeEventListener("click", this.click);
        }
        findAllPickedObjectsUsingPickSphere(_pointer) {
            const ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_pointer.x, _pointer.y));
            const picks = Script.PickSphere.pick(ray, { sortBy: "distanceToRayOrigin" });
            return picks.map((p) => p.node);
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let Building = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = ƒ.Component;
        let _instanceExtraInitializers = [];
        let _graph_decorators;
        let _graph_initializers = [];
        let _size_decorators;
        let _size_initializers = [];
        let _name_decorators;
        let _name_initializers = [];
        var Building = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _graph_decorators = [ƒ.serialize(ƒ.Graph)];
                _size_decorators = [ƒ.serialize(Number)];
                _name_decorators = [ƒ.serialize(String)];
                __esDecorate(null, null, _graph_decorators, { kind: "field", name: "graph", static: false, private: false, access: { has: obj => "graph" in obj, get: obj => obj.graph, set: (obj, value) => { obj.graph = value; } }, metadata: _metadata }, _graph_initializers, _instanceExtraInitializers);
                __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _instanceExtraInitializers);
                __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                Building = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.all = []; }
            get isSingleton() {
                return false;
            }
            constructor() {
                super();
                this.graph = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _graph_initializers, void 0));
                this.size = __runInitializers(this, _size_initializers, 1);
                this.name = __runInitializers(this, _name_initializers, "");
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, () => {
                    Building.all.push({ graph: this.graph, size: this.size, name: this.name });
                });
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return Building = _classThis;
    })();
    Script.Building = Building;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class UpdateScriptComponent extends ƒ.Component {
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("preupdate", this.prestart, { once: true });
            this.addEventListener("update", this.start, { once: true });
            this.addEventListener("update", this.update);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.remove);
            this.addEventListener("componentDeactivate" /* ƒ.EVENT.COMPONENT_DEACTIVATE */, this.remove);
        }
        // runs updates of all updateable components
        static updateAllInBranch(_branch) {
            let event = new CustomEvent("update", { detail: { deltaTime: ƒ.Loop.timeFrameGame } });
            let preEvent = new CustomEvent("preupdate", { detail: { deltaTime: ƒ.Loop.timeFrameGame } });
            for (let node of _branch) {
                for (let component of node.getAllComponents()) {
                    if (component instanceof UpdateScriptComponent) {
                        if (component.active)
                            component.dispatchEvent(preEvent);
                    }
                }
            }
            for (let node of _branch) {
                for (let component of node.getAllComponents()) {
                    if (component instanceof UpdateScriptComponent) {
                        if (component.active)
                            component.dispatchEvent(event);
                    }
                }
            }
        }
    }
    Script.UpdateScriptComponent = UpdateScriptComponent;
})(Script || (Script = {}));
/// <reference path="../Plugins/UpdateScriptComponent.ts" />
var Script;
/// <reference path="../Plugins/UpdateScriptComponent.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    let NonJobAnimations;
    (function (NonJobAnimations) {
        NonJobAnimations["WALK"] = "walk";
    })(NonJobAnimations = Script.NonJobAnimations || (Script.NonJobAnimations = {}));
    let JobAnimation = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = Script.UpdateScriptComponent;
        let _instanceExtraInitializers = [];
        let _animIdle_decorators;
        let _animIdle_initializers = [];
        let _animWalk_decorators;
        let _animWalk_initializers = [];
        let _animGatherFood_decorators;
        let _animGatherFood_initializers = [];
        let _animGatherStone_decorators;
        let _animGatherStone_initializers = [];
        let _animBuild_decorators;
        let _animBuild_initializers = [];
        var JobAnimation = class extends _classSuper {
            static { _classThis = this; }
            constructor() {
                super(...arguments);
                this.#animations = (__runInitializers(this, _instanceExtraInitializers), new Map());
                this.animIdle = __runInitializers(this, _animIdle_initializers, void 0);
                this.animWalk = __runInitializers(this, _animWalk_initializers, void 0);
                this.animGatherFood = __runInitializers(this, _animGatherFood_initializers, void 0);
                this.animGatherStone = __runInitializers(this, _animGatherStone_initializers, void 0);
                this.animBuild = __runInitializers(this, _animBuild_initializers, void 0);
            }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _animIdle_decorators = [ƒ.serialize(ƒ.Animation)];
                _animWalk_decorators = [ƒ.serialize(ƒ.Animation)];
                _animGatherFood_decorators = [ƒ.serialize(ƒ.Animation)];
                _animGatherStone_decorators = [ƒ.serialize(ƒ.Animation)];
                _animBuild_decorators = [ƒ.serialize(ƒ.Animation)];
                __esDecorate(null, null, _animIdle_decorators, { kind: "field", name: "animIdle", static: false, private: false, access: { has: obj => "animIdle" in obj, get: obj => obj.animIdle, set: (obj, value) => { obj.animIdle = value; } }, metadata: _metadata }, _animIdle_initializers, _instanceExtraInitializers);
                __esDecorate(null, null, _animWalk_decorators, { kind: "field", name: "animWalk", static: false, private: false, access: { has: obj => "animWalk" in obj, get: obj => obj.animWalk, set: (obj, value) => { obj.animWalk = value; } }, metadata: _metadata }, _animWalk_initializers, _instanceExtraInitializers);
                __esDecorate(null, null, _animGatherFood_decorators, { kind: "field", name: "animGatherFood", static: false, private: false, access: { has: obj => "animGatherFood" in obj, get: obj => obj.animGatherFood, set: (obj, value) => { obj.animGatherFood = value; } }, metadata: _metadata }, _animGatherFood_initializers, _instanceExtraInitializers);
                __esDecorate(null, null, _animGatherStone_decorators, { kind: "field", name: "animGatherStone", static: false, private: false, access: { has: obj => "animGatherStone" in obj, get: obj => obj.animGatherStone, set: (obj, value) => { obj.animGatherStone = value; } }, metadata: _metadata }, _animGatherStone_initializers, _instanceExtraInitializers);
                __esDecorate(null, null, _animBuild_decorators, { kind: "field", name: "animBuild", static: false, private: false, access: { has: obj => "animBuild" in obj, get: obj => obj.animBuild, set: (obj, value) => { obj.animBuild = value; } }, metadata: _metadata }, _animBuild_initializers, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                JobAnimation = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            #animations;
            #currentAnimation;
            #animator;
            start(_e) {
                this.#animations.set(NonJobAnimations.WALK, this.animWalk);
                this.#animations.set(Script.JobProviderType.NONE, this.animIdle);
                this.#animations.set(Script.JobProviderType.GATHER_FOOD, this.animGatherFood);
                this.#animations.set(Script.JobProviderType.GATHER_STONE, this.animGatherStone);
                this.#animations.set(Script.JobProviderType.BUILD, this.animBuild);
                this.#animator = this.node.getChild(0).getComponent(ƒ.ComponentAnimation);
            }
            playAnimation(anim) {
                if (anim === this.#currentAnimation)
                    return;
                let animationToPlay = this.#animations.get(anim);
                if (!animationToPlay)
                    return;
                this.#animator.animation = animationToPlay;
                this.#animator.jumpTo(0);
                this.#currentAnimation = anim;
            }
        };
        return JobAnimation = _classThis;
    })();
    Script.JobAnimation = JobAnimation;
})(Script || (Script = {}));
/// <reference path="../Plugins/UpdateScriptComponent.ts" />
var Script;
/// <reference path="../Plugins/UpdateScriptComponent.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    let JobProviderType;
    (function (JobProviderType) {
        JobProviderType[JobProviderType["GATHER_STONE"] = 0] = "GATHER_STONE";
        JobProviderType[JobProviderType["GATHER_FOOD"] = 1] = "GATHER_FOOD";
        JobProviderType[JobProviderType["STORE_RESOURCE"] = 2] = "STORE_RESOURCE";
        JobProviderType[JobProviderType["BUILD"] = 3] = "BUILD";
        JobProviderType[JobProviderType["NONE"] = 4] = "NONE";
    })(JobProviderType = Script.JobProviderType || (Script.JobProviderType = {}));
    let JobProvider = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = Script.UpdateScriptComponent;
        let _instanceExtraInitializers = [];
        let __jobType_decorators;
        let __jobType_initializers = [];
        let _jobDuration_decorators;
        let _jobDuration_initializers = [];
        var JobProvider = class extends _classSuper {
            static { _classThis = this; }
            constructor() {
                super(...arguments);
                this._jobType = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, __jobType_initializers, void 0));
                this.jobDuration = __runInitializers(this, _jobDuration_initializers, 500);
            }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                __jobType_decorators = [ƒ.serialize(JobProviderType)];
                _jobDuration_decorators = [ƒ.serialize(Number)];
                __esDecorate(null, null, __jobType_decorators, { kind: "field", name: "_jobType", static: false, private: false, access: { has: obj => "_jobType" in obj, get: obj => obj._jobType, set: (obj, value) => { obj._jobType = value; } }, metadata: _metadata }, __jobType_initializers, _instanceExtraInitializers);
                __esDecorate(null, null, _jobDuration_decorators, { kind: "field", name: "jobDuration", static: false, private: false, access: { has: obj => "jobDuration" in obj, get: obj => obj.jobDuration, set: (obj, value) => { obj.jobDuration = value; } }, metadata: _metadata }, _jobDuration_initializers, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                JobProvider = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.JobProviders = []; }
            start(_e) {
                JobProvider.JobProviders.push(this);
            }
            remove(_e) {
                let index = JobProvider.JobProviders.indexOf(this);
                JobProvider.JobProviders.splice(index, 1);
            }
            jobStart() { }
            jobFinish() { }
            get jobType() {
                return this._jobType;
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return JobProvider = _classThis;
    })();
    Script.JobProvider = JobProvider;
    class JobProviderGatherFood extends JobProvider {
        constructor() {
            super(...arguments);
            this._jobType = JobProviderType.GATHER_FOOD;
            this.jobDuration = 2000;
        }
    }
    Script.JobProviderGatherFood = JobProviderGatherFood;
    class JobProviderGatherStone extends JobProvider {
        constructor() {
            super(...arguments);
            this._jobType = JobProviderType.GATHER_STONE;
            this.jobDuration = 2000;
        }
    }
    Script.JobProviderGatherStone = JobProviderGatherStone;
    class JobProviderStoreResource extends JobProvider {
        constructor() {
            super(...arguments);
            this.jobDuration = 2000;
            this._jobType = JobProviderType.STORE_RESOURCE;
        }
    }
    Script.JobProviderStoreResource = JobProviderStoreResource;
    class JobProviderBuild extends JobProvider {
        constructor() {
            super(...arguments);
            this._jobType = JobProviderType.BUILD;
        }
    }
    Script.JobProviderBuild = JobProviderBuild;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let JobTaker = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = Script.UpdateScriptComponent;
        let _instanceExtraInitializers = [];
        let _speed_decorators;
        let _speed_initializers = [];
        var JobTaker = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _speed_decorators = [ƒ.serialize(Number)];
                __esDecorate(null, null, _speed_decorators, { kind: "field", name: "speed", static: false, private: false, access: { has: obj => "speed" in obj, get: obj => obj.speed, set: (obj, value) => { obj.speed = value; } }, metadata: _metadata }, _speed_initializers, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                JobTaker = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            #job;
            #currentJob;
            #progress;
            #executableJobs;
            #target;
            #animator;
            constructor() {
                super();
                this.#job = (__runInitializers(this, _instanceExtraInitializers), Script.JobProviderType.GATHER_FOOD);
                this.#currentJob = Script.JobProviderType.NONE;
                this.#progress = 0;
                this.speed = __runInitializers(this, _speed_initializers, 1);
                this.gatherResource = (deltaTime) => {
                    switch (this.#progress) {
                        case 0: {
                            // look for target
                            this.#currentJob = Script.JobProviderType.NONE;
                            const target = this.findAndSetTargetForJob(this.#job);
                            if (target) {
                                this.#progress++;
                            }
                            break;
                        }
                        case 1:
                        case 4: {
                            // move to target
                            let reachedTarget = this.moveToTarget(deltaTime);
                            if (reachedTarget) {
                                this.#progress++;
                                this.#target.jobStart();
                                new ƒ.Timer(ƒ.Time.game, this.#target.jobDuration, 1, () => {
                                    this.#progress++;
                                    this.#target.jobFinish();
                                });
                            }
                            break;
                        }
                        case 2: {
                            // at gathering site
                            // play animation or some junk
                            this.#animator.playAnimation(this.#currentJob);
                            break;
                        }
                        case 3: {
                            // ready to find the place to drop stuff off
                            const target = this.findAndSetTargetForJob(Script.JobProviderType.STORE_RESOURCE);
                            if (target) {
                                this.#progress++;
                            }
                            break;
                        }
                        case 5: {
                            // at deploy site
                            this.#animator.playAnimation(this.#currentJob);
                            break;
                        }
                        case 6: {
                            // dropped off the resources
                            this.#progress = 0;
                            break;
                        }
                    }
                };
                this.build = () => {
                };
                this.#prevDistance = Infinity;
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                this.#executableJobs = new Map([
                    [Script.JobProviderType.BUILD, this.build],
                    [Script.JobProviderType.GATHER_FOOD, this.gatherResource],
                    [Script.JobProviderType.GATHER_STONE, this.gatherResource],
                ]);
            }
            set job(_job) {
                this.#job = _job;
                this.#progress = 0;
            }
            static findClosestJobProvider(_job, _location) {
                const foundProviders = [];
                for (let provider of Script.JobProvider.JobProviders) {
                    if (provider.jobType === _job) {
                        foundProviders.push(provider);
                    }
                }
                if (!foundProviders.length)
                    return undefined;
                foundProviders.sort((a, b) => a.node.mtxWorld.translation.getDistance(_location) - b.node.mtxWorld.translation.getDistance(_location));
                return foundProviders[0];
            }
            start(_e) {
                this.#animator = this.node.getComponent(Script.JobAnimation);
            }
            update(_e) {
                this.#executableJobs.get(this.#job)?.(_e.detail.deltaTime);
            }
            #prevDistance;
            moveToTarget(deltaTime) {
                this.#animator.playAnimation(Script.NonJobAnimations.WALK);
                let distance = this.node.mtxWorld.translation.getDistance(this.#target.node.mtxWorld.translation);
                if (distance > this.#prevDistance) {
                    // target reached
                    this.node.mtxLocal.translate(this.node.mtxWorld.getTranslationTo(this.#target.node.mtxWorld));
                    this.#prevDistance = Infinity;
                    return true;
                }
                this.#prevDistance = distance;
                // move to target
                deltaTime = Math.min(1000, deltaTime); // limit delta time to 1 second max to prevent lag causing super big jumps
                this.node.mtxLocal.translateZ(deltaTime / 1000 * this.speed);
                return false;
            }
            findAndSetTargetForJob(_job) {
                this.#animator.playAnimation(Script.JobProviderType.NONE);
                const target = JobTaker.findClosestJobProvider(_job, this.node.mtxWorld.translation);
                if (!target)
                    return undefined;
                this.#target = target;
                this.#currentJob = _job;
                this.node.mtxLocal.lookAt(target.node.mtxWorld.translation);
                return target;
            }
        };
        return JobTaker = _classThis;
    })();
    Script.JobTaker = JobTaker;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let PickSphere = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = ƒ.Component;
        let _instanceExtraInitializers = [];
        let _get_radius_decorators;
        let _offset_decorators;
        let _offset_initializers = [];
        var PickSphere = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _get_radius_decorators = [ƒ.serialize(Number)];
                _offset_decorators = [ƒ.serialize(ƒ.Vector3)];
                __esDecorate(this, null, _get_radius_decorators, { kind: "getter", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, null, _offset_decorators, { kind: "field", name: "offset", static: false, private: false, access: { has: obj => "offset" in obj, get: obj => obj.offset, set: (obj, value) => { obj.offset = value; } }, metadata: _metadata }, _offset_initializers, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                PickSphere = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = ƒ.Component.registerSubclass(PickSphere); }
            constructor() {
                super();
                this.#radius = (__runInitializers(this, _instanceExtraInitializers), 1);
                this.#radiusSquared = 1;
                this.offset = __runInitializers(this, _offset_initializers, new ƒ.Vector3());
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
            }
            #radius;
            #radiusSquared;
            get radius() {
                return this.#radius;
            }
            set radius(_r) {
                this.#radius = _r;
                this.#radiusSquared = _r * _r;
            }
            get radiusSquared() {
                return this.#radiusSquared;
            }
            get mtxPick() {
                return this.node.mtxWorld.clone.translate(this.offset, true).scale(ƒ.Vector3.ONE(Math.max(this.radius * 2, 0.000001)));
            }
            drawGizmos(_cmpCamera) {
                ƒ.Gizmos.drawWireSphere(this.mtxPick, ƒ.Color.CSS("red"));
            }
            /**
             * finds all pickSpheres within the given ray
             * @param ray the ray to check against
             * @param options options
             */
            static pick(ray, options = {}) {
                const picks = [];
                options = { ...this.defaultOptions, ...options };
                for (let node of options.branch) {
                    let pckSph = node.getComponent(PickSphere);
                    if (!pckSph)
                        continue;
                    let distance = ray.getDistance(pckSph.mtxPick.translation);
                    if (distance.magnitudeSquared < pckSph.radiusSquared) {
                        picks.push(pckSph);
                    }
                }
                if (options.sortBy) {
                    let distances = new Map();
                    if (options.sortBy === "distanceToRayOrigin") {
                        picks.forEach(p => distances.set(p, ray.origin.getDistance(p.node.mtxWorld.translation)));
                    }
                    else if (options.sortBy === "distanceToRay") {
                        picks.forEach(p => distances.set(p, ray.getDistance(p.node.mtxWorld.translation).magnitudeSquared));
                    }
                    picks.sort((a, b) => distances.get(a) - distances.get(b));
                }
                return picks;
            }
            static get defaultOptions() {
                return {
                    branch: Script.viewport.getBranch(),
                };
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return PickSphere = _classThis;
    })();
    Script.PickSphere = PickSphere;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    function findFirstCameraInGraph(_graph) {
        let cam = _graph.getComponent(ƒ.ComponentCamera);
        if (cam)
            return cam;
        for (let child of _graph.getChildren()) {
            cam = findFirstCameraInGraph(child);
            if (cam)
                return cam;
        }
        return undefined;
    }
    Script.findFirstCameraInGraph = findFirstCameraInGraph;
    function enumToArray(anEnum) {
        return Object.keys(anEnum)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n));
    }
    Script.enumToArray = enumToArray;
    function randomEnum(anEnum) {
        const enumValues = enumToArray(anEnum);
        const randomIndex = Math.floor(Math.random() * enumValues.length);
        const randomEnumValue = enumValues[randomIndex];
        return randomEnumValue;
    }
    Script.randomEnum = randomEnum;
    function mobileOrTabletCheck() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    Script.mobileOrTabletCheck = mobileOrTabletCheck;
    function createElementAdvanced(_type, _options = {}) {
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
    Script.createElementAdvanced = createElementAdvanced;
    function shuffleArray(_array) {
        for (let i = _array.length - 1; i >= 0; i--) {
            const k = Math.floor(Math.random() * (i + 1));
            [_array[i], _array[k]] = [_array[k], _array[i]];
        }
        return _array;
    }
    Script.shuffleArray = shuffleArray;
    async function waitMS(_ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, _ms);
        });
    }
    Script.waitMS = waitMS;
    function randomArrayElement(_array) {
        if (_array.length === 0)
            return undefined;
        return _array[Math.floor(Math.random() * _array.length)];
    }
    Script.randomArrayElement = randomArrayElement;
    function randomRange(min = 0, max = 1) {
        const range = max - min;
        return Math.random() * range + min;
    }
    Script.randomRange = randomRange;
    function randomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let counter = 0; counter < length; counter++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    Script.randomString = randomString;
    function capitalize(s) {
        return s.charAt(0).toLocaleUpperCase() + s.slice(1);
    }
    Script.capitalize = capitalize;
    function getPlanePositionFromMouseEvent(_event) {
        let mousePos = new ƒ.Vector2(_event.clientX, _event.clientY);
        let ray = Script.viewport.getRayFromClient(mousePos);
        let pos = ray.intersectPlane(ƒ.Vector3.ZERO(), ƒ.Vector3.Y(1));
        return pos;
    }
    Script.getPlanePositionFromMouseEvent = getPlanePositionFromMouseEvent;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map