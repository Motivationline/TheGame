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
    let BonusType;
    (function (BonusType) {
        BonusType[BonusType["ADD"] = 0] = "ADD";
        BonusType[BonusType["MULTIPLY"] = 1] = "MULTIPLY";
    })(BonusType = Script.BonusType || (Script.BonusType = {}));
    let BonusData;
    (function (BonusData) {
        BonusData[BonusData["EUMLING_AMOUNT"] = 0] = "EUMLING_AMOUNT";
        BonusData[BonusData["STONE"] = 1] = "STONE";
        BonusData[BonusData["FOOD"] = 2] = "FOOD";
    })(BonusData = Script.BonusData || (Script.BonusData = {}));
    let BonusProvider = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = Script.UpdateScriptComponent;
        let _bonusType_decorators;
        let _bonusType_initializers = [];
        let _bonusType_extraInitializers = [];
        let _bonusData_decorators;
        let _bonusData_initializers = [];
        let _bonusData_extraInitializers = [];
        let _amount_decorators;
        let _amount_initializers = [];
        let _amount_extraInitializers = [];
        var BonusProvider = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _bonusType_decorators = [ƒ.serialize(BonusType)];
                _bonusData_decorators = [ƒ.serialize(BonusData)];
                _amount_decorators = [ƒ.serialize(Number)];
                __esDecorate(null, null, _bonusType_decorators, { kind: "field", name: "bonusType", static: false, private: false, access: { has: obj => "bonusType" in obj, get: obj => obj.bonusType, set: (obj, value) => { obj.bonusType = value; } }, metadata: _metadata }, _bonusType_initializers, _bonusType_extraInitializers);
                __esDecorate(null, null, _bonusData_decorators, { kind: "field", name: "bonusData", static: false, private: false, access: { has: obj => "bonusData" in obj, get: obj => obj.bonusData, set: (obj, value) => { obj.bonusData = value; } }, metadata: _metadata }, _bonusData_initializers, _bonusData_extraInitializers);
                __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                BonusProvider = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.BonusProviders = new Map(); }
            start(_e) {
                if (!BonusProvider.BonusProviders.has(this.bonusData))
                    BonusProvider.BonusProviders.set(this.bonusData, new Set());
                BonusProvider.BonusProviders.get(this.bonusData)?.add(this);
            }
            remove(_e) {
                BonusProvider.BonusProviders.get(this.bonusData)?.delete(this);
            }
            static getBonus(data, startAmount = 1) {
                let set = BonusProvider.BonusProviders.get(data);
                if (!set)
                    return startAmount;
                let arr = set.values().toArray().sort((a, b) => {
                    if (a.bonusType === b.bonusType)
                        return 0;
                    if (a.bonusType === BonusType.ADD)
                        return -1;
                    if (b.bonusType === BonusType.ADD)
                        return 1;
                    return 0;
                });
                for (let el of arr) {
                    if (el.bonusType === BonusType.ADD) {
                        startAmount += el.amount;
                    }
                    else if (el.bonusType === BonusType.MULTIPLY) {
                        startAmount *= el.amount;
                    }
                }
                return startAmount;
            }
            constructor() {
                super(...arguments);
                this.bonusType = __runInitializers(this, _bonusType_initializers, BonusType.ADD);
                this.bonusData = (__runInitializers(this, _bonusType_extraInitializers), __runInitializers(this, _bonusData_initializers, void 0));
                this.amount = (__runInitializers(this, _bonusData_extraInitializers), __runInitializers(this, _amount_initializers, 1));
                __runInitializers(this, _amount_extraInitializers);
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return BonusProvider = _classThis;
    })();
    Script.BonusProvider = BonusProvider;
})(Script || (Script = {}));
/// <reference path="Buildings/BonusProvider.ts" />
var Script;
/// <reference path="Buildings/BonusProvider.ts" />
(function (Script) {
    class Data {
        static #stone = 0;
        static #food = 0;
        static set food(_food) {
            this.#food = _food;
            document.getElementById("resource-food").innerText = this.#food.toString();
            this.updateCostButtons();
        }
        static set stone(_stone) {
            this.#stone = _stone;
            document.getElementById("resource-stone").innerText = this.#stone.toString();
            this.updateCostButtons();
        }
        static get food() {
            return this.#food;
        }
        static get stone() {
            return this.#stone;
        }
        static get eumlingLimit() {
            return Script.BonusProvider.getBonus(Script.BonusData.EUMLING_AMOUNT, 0);
        }
        static canAffordBuilding(building) {
            return building.costFood <= this.#food && building.costStone <= this.#stone;
        }
        static buyBuilding(building) {
            if (!this.canAffordBuilding(building))
                return false;
            this.food -= building.costFood;
            this.stone -= building.costStone;
            return true;
        }
        static updateCostButtons() {
            const elements = document.querySelectorAll("button.build");
            for (let element of elements) {
                let enabled = true;
                for (let set in element.dataset) {
                    if (set === "costFood") {
                        if (Number(element.dataset.costFood) > this.#food) {
                            enabled = false;
                        }
                    }
                    else if (set === "costStone") {
                        if (Number(element.dataset.costStone) > this.#stone) {
                            enabled = false;
                        }
                    }
                    else if (set === "eumlingLimit") {
                        if (Number(element.dataset.eumlingLimit) > this.eumlingLimit) {
                            enabled = false;
                        }
                    }
                }
                element.disabled = !enabled;
            }
        }
    }
    Script.Data = Data;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class EumlingCreator {
        static { this.eumlingPrices = [
            { food: 0, stone: 0 },
            { food: 10, stone: 0 },
            { food: 20, stone: 5 },
            { food: 40, stone: 10 },
        ]; }
        static { this.eumlingAmount = 0; }
        static { this.createEumling = async () => {
            let current = this.eumlingPrices[this.eumlingAmount];
            if (!current)
                return;
            // check if there is space for new eumling
            if (Script.Data.eumlingLimit <= this.eumlingAmount)
                return;
            if (Script.Data.food < current.food || Script.Data.stone < current.stone)
                return;
            Script.Data.food -= current.food;
            Script.Data.stone -= current.stone;
            let graph = ƒ.Project.getResourcesByName("Eumling")[0];
            let node = await ƒ.Project.createGraphInstance(graph);
            Script.viewport.getBranch().addChild(node);
            node.getComponent(Script.JobTaker)?.moveAwayNow();
            this.eumlingAmount += 1;
            this.updateButton();
        }; }
        static updateButton() {
            let btn = document.getElementById("eumling-btn");
            let current = this.eumlingPrices[this.eumlingAmount];
            if (!current) {
                btn.classList.add("hidden");
                return;
            }
            btn.dataset.costFood = current.food.toString();
            btn.dataset.costStone = current.stone.toString();
            btn.dataset.eumlingLimit = (this.eumlingAmount + 1).toString();
            if (Script.Data.food < current.food || Script.Data.stone < current.stone || Script.Data.eumlingLimit <= this.eumlingAmount) {
                btn.disabled = true;
            }
            else {
                btn.disabled = false;
            }
            btn.innerHTML = `+ Eumling (${this.eumlingAmount} / ${Script.Data.eumlingLimit})<br>${current.food} Food, ${current.stone} Stone`;
        }
    }
    Script.EumlingCreator = EumlingCreator;
    if (ƒ.Project.mode === ƒ.MODE.RUNTIME) {
        document.getElementById("eumling-btn").addEventListener("click", EumlingCreator.createEumling);
        EumlingCreator.updateButton();
    }
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
        get size() {
            return this.#size;
        }
        getTile(_pos, inWorldCoordinates = true) {
            if (inWorldCoordinates)
                _pos = this.worldPosToTilePos(_pos);
            if (_pos.x < 0 || _pos.y < 0)
                return null;
            if (_pos.x > this.#size.x - 1 || _pos.y > this.#size.y - 1)
                return null;
            return this.#tiles[_pos.y][_pos.x];
        }
        setTile(_tile, _pos) {
            this.#tiles[_pos.y][_pos.x] = _tile;
        }
        worldPosToTilePos(_pos, _out = new ƒ.Vector2()) {
            return _out.set(Math.floor(_pos.x + this.#size.x / 2), Math.floor(_pos.y + this.#size.y / 2));
        }
        tilePosToWorldPos(_pos, _out = new ƒ.Vector2()) {
            return _out.set(_pos.x - this.#size.x / 2, _pos.y - this.#size.y / 2);
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
        if (ƒ.Project.mode !== ƒ.MODE.RUNTIME)
            return;
        document.getElementById("click-start").innerText = "Loading...";
        await ƒ.Project.loadResourcesFromHTML();
        let graphId /* : string */ = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        let graph = ƒ.Project.resources[graphId];
        Script.viewport = new ƒ.Viewport();
        let camera = Script.findFirstCameraInGraph(graph);
        Script.viewport.initialize("game", graph, camera, canvas);
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: Script.viewport }));
        document.getElementById("click-start").remove();
        Script.setupUI();
        createStartingWorld();
    }
    async function createStartingWorld() {
        const pos = new ƒ.Vector2(15, 15);
        // starter hut
        let starterHut = Script.Building.all.find(b => b.name === "Wohnhaus");
        if (starterHut)
            await Script.gridBuilder.placeGraphOnGrid(pos, starterHut.size, starterHut.graph);
        // gathering spots
        let foodSpot = Script.Building.all.find(b => b.name === "GatherFood");
        if (foodSpot) {
            for (let i = 0; i < 20; i++) {
                pos.set(Math.floor(Script.randomRange(0, 44)), Math.floor(Script.randomRange(0, 44)));
                let tile = Script.grid.getTile(pos, false);
                if (tile)
                    continue;
                await Script.gridBuilder.placeGraphOnGrid(pos, foodSpot.size, foodSpot.graph);
            }
        }
        // gathering spots
        let stoneSpot = Script.Building.all.find(b => b.name === "GatherStone");
        if (stoneSpot) {
            for (let i = 0; i < 20; i++) {
                pos.set(Math.floor(Script.randomRange(0, 44)), Math.floor(Script.randomRange(0, 44)));
                let tile = Script.grid.getTile(pos, false);
                if (tile)
                    continue;
                await Script.gridBuilder.placeGraphOnGrid(pos, stoneSpot.size, stoneSpot.graph);
            }
        }
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
                this.marker.mtxLocal.translation = new ƒ.Vector3(this.currentWorldPosition.x, 0.01, this.currentWorldPosition.y);
                this.marker.activate(true);
            };
            this.placeOnGrid = async (_event) => {
                if (_event.button !== 0)
                    return;
                if (!this.selectedBuilding)
                    return;
                if (!Script.Data.buyBuilding(this.selectedBuilding))
                    return;
                let tilePos = this.tilePositionFromMouseEvent(_event);
                this.checkAndSetCurrentPosition(tilePos);
                if (this.currentPositionOccupied)
                    return;
                this.forEachSelectedTile(this.currentPosition, this.selectedBuilding.size, (tile, pos) => {
                    this.grid.setTile({ type: "test", origin: this.currentPosition.equals(pos) }, pos);
                });
                this.highlightGrid(_event);
                let marker = await this.placeGraphOnGrid(this.currentPosition, this.selectedBuilding.size, this.selectedBuilding.graph);
                // make it so building needs to be built before it takes effect
                Script.getDerivedComponents(marker, Script.JobProvider).forEach((jobCmp) => { jobCmp.activate(false); });
                marker.getComponents(Script.BonusProvider).forEach((bonusCmp) => { bonusCmp.activate(false); });
                const buildupCmp = new Script.JobProviderBuild(this.selectedBuilding.costFood + this.selectedBuilding.costStone);
                marker.addComponent(buildupCmp);
            };
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            this.wrapper = document.getElementById("build-menu");
            this.buildings = document.getElementById("build-menu-buildings");
            // set center to occupied
            let pos = new ƒ.Vector2();
            for (let y = -2; y <= 2; y++) {
                for (let x = -2; x <= 2; x++) {
                    this.grid.setTile({ origin: false, type: "goddess" }, pos.set(Math.floor(grid.size.x / 2) + x, Math.floor(grid.size.y / 2) + y));
                }
            }
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
                if (!build.includeInMenu)
                    continue;
                const button = Script.createElementAdvanced("button", {
                    innerHTML: `${build.name ?? build.graph.name}<br>${build.costFood} Food, ${build.costStone} Stone<br>(${build.size}x${build.size})`,
                    classes: ["build"],
                });
                if (Script.Data.food < build.costFood || Script.Data.stone < build.costStone)
                    button.disabled = true;
                button.dataset.costFood = build.costFood.toString();
                button.dataset.costStone = build.costStone.toString();
                button.addEventListener("click", () => {
                    this.selectBuilding(build);
                });
                buttons.push(button);
            }
            this.buildings.replaceChildren(...buttons);
        }
        async placeGraphOnGrid(_posOfTile, _size, _graph) {
            this.forEachSelectedTile(_posOfTile, _size, (t, pos) => {
                this.grid.setTile({ type: "test", origin: _posOfTile.equals(pos) }, pos);
            });
            // visually add building
            let marker = await ƒ.Project.createGraphInstance(_graph);
            Script.viewport.getBranch().appendChild(marker);
            let worldPos = this.grid.tilePosToWorldPos(_posOfTile);
            marker.mtxLocal.translation = new ƒ.Vector3(worldPos.x + _size / 2, 0, worldPos.y + _size / 2);
            setTimeout(() => {
                Script.EumlingCreator.updateButton();
            }, 1);
            return marker;
        }
        checkAndSetCurrentPosition(_startPos) {
            let occupied = false;
            let valid = true;
            this.forEachSelectedTile(_startPos, this.selectedBuilding.size, (tile) => {
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
            this.currentWorldPosition = this.grid.tilePosToWorldPos(this.currentPosition);
            this.currentPositionOccupied = occupied;
            return true;
        }
        forEachSelectedTile(_startPos, _size, callback) {
            let pos = ƒ.Recycler.get(ƒ.Vector2);
            for (let x = _startPos.x; x < _startPos.x + _size; x++) {
                for (let y = _startPos.y; y < _startPos.y + _size; y++) {
                    let tile = this.grid.getTile(pos.set(x, y), false);
                    callback(tile, pos);
                }
            }
            ƒ.Recycler.store(pos);
        }
        changeTileColor(_color) {
            this.marker.getComponent(ƒ.ComponentMaterial).clrPrimary = _color;
        }
        tilePositionFromMouseEvent(_event) {
            let pos = Script.getPlanePositionFromMousePosition(new ƒ.Vector2(_event.clientX, _event.clientY));
            let tilePos = this.grid.worldPosToTilePos(new ƒ.Vector2(pos.x, pos.z));
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
/// <reference path="../Plugins/UpdateScriptComponent.ts" />
var Script;
/// <reference path="../Plugins/UpdateScriptComponent.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    let JobType;
    (function (JobType) {
        JobType[JobType["GATHER_STONE"] = 0] = "GATHER_STONE";
        JobType[JobType["GATHER_FOOD"] = 1] = "GATHER_FOOD";
        JobType[JobType["STORE_RESOURCE"] = 2] = "STORE_RESOURCE";
        JobType[JobType["BUILD"] = 3] = "BUILD";
        JobType[JobType["NONE"] = 4] = "NONE";
    })(JobType = Script.JobType || (Script.JobType = {}));
    let JobProvider = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = Script.UpdateScriptComponent;
        let __jobType_decorators;
        let __jobType_initializers = [];
        let __jobType_extraInitializers = [];
        let _jobDuration_decorators;
        let _jobDuration_initializers = [];
        let _jobDuration_extraInitializers = [];
        let _cooldown_decorators;
        let _cooldown_initializers = [];
        let _cooldown_extraInitializers = [];
        var JobProvider = class extends _classSuper {
            static { _classThis = this; }
            constructor() {
                super(...arguments);
                this._jobType = __runInitializers(this, __jobType_initializers, void 0);
                this.jobDuration = (__runInitializers(this, __jobType_extraInitializers), __runInitializers(this, _jobDuration_initializers, 500));
                this.cooldown = (__runInitializers(this, _jobDuration_extraInitializers), __runInitializers(this, _cooldown_initializers, 30000));
                this.#currentCooldown = (__runInitializers(this, _cooldown_extraInitializers), 0);
            }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                __jobType_decorators = [ƒ.serialize(JobType)];
                _jobDuration_decorators = [ƒ.serialize(Number)];
                _cooldown_decorators = [ƒ.serialize(Number)];
                __esDecorate(null, null, __jobType_decorators, { kind: "field", name: "_jobType", static: false, private: false, access: { has: obj => "_jobType" in obj, get: obj => obj._jobType, set: (obj, value) => { obj._jobType = value; } }, metadata: _metadata }, __jobType_initializers, __jobType_extraInitializers);
                __esDecorate(null, null, _jobDuration_decorators, { kind: "field", name: "jobDuration", static: false, private: false, access: { has: obj => "jobDuration" in obj, get: obj => obj.jobDuration, set: (obj, value) => { obj.jobDuration = value; } }, metadata: _metadata }, _jobDuration_initializers, _jobDuration_extraInitializers);
                __esDecorate(null, null, _cooldown_decorators, { kind: "field", name: "cooldown", static: false, private: false, access: { has: obj => "cooldown" in obj, get: obj => obj.cooldown, set: (obj, value) => { obj.cooldown = value; } }, metadata: _metadata }, _cooldown_initializers, _cooldown_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                JobProvider = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.JobProviders = new Set(); }
            #currentCooldown;
            start(_e) {
                JobProvider.JobProviders.add(this);
            }
            remove(_e) {
                JobProvider.JobProviders.delete(this);
            }
            jobStart() { }
            jobFinish() {
                this.#currentCooldown = this.cooldown;
            }
            get jobType() {
                if (this.#currentCooldown > 0) {
                    return JobType.NONE;
                }
                return this._jobType;
            }
            update(_e) {
                if (this.#currentCooldown > 0) {
                    this.#currentCooldown -= _e.detail.deltaTime;
                }
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return JobProvider = _classThis;
    })();
    Script.JobProvider = JobProvider;
    class JobProviderNone extends JobProvider {
        constructor() {
            super(...arguments);
            this._jobType = JobType.NONE;
        }
    }
    Script.JobProviderNone = JobProviderNone;
    class JobProviderGatherFood extends JobProvider {
        constructor() {
            super(...arguments);
            this._jobType = JobType.GATHER_FOOD;
            this.jobDuration = 2000;
        }
    }
    Script.JobProviderGatherFood = JobProviderGatherFood;
    class JobProviderGatherStone extends JobProvider {
        constructor() {
            super(...arguments);
            this._jobType = JobType.GATHER_STONE;
            this.jobDuration = 2000;
        }
    }
    Script.JobProviderGatherStone = JobProviderGatherStone;
    class JobProviderStoreResource extends JobProvider {
        constructor() {
            super(...arguments);
            this.jobDuration = 2000;
            this._jobType = JobType.STORE_RESOURCE;
            this.cooldown = 0;
        }
    }
    Script.JobProviderStoreResource = JobProviderStoreResource;
    class JobProviderBuild extends JobProvider {
        constructor(resourceAmt) {
            super();
            this._jobType = JobType.BUILD;
            this.jobDuration = resourceAmt * 2000;
        }
        jobFinish() {
            super.jobFinish();
            for (let cmp of this.node.getAllComponents()) {
                if (cmp instanceof JobProvider || cmp instanceof Script.BonusProvider) {
                    cmp.activate(true);
                }
            }
            this.node.removeComponent(this);
        }
    }
    Script.JobProviderBuild = JobProviderBuild;
})(Script || (Script = {}));
/// <reference path="Grid/Controller.ts" />
/// <reference path="Jobs/JobProvider.ts" />
var Script;
/// <reference path="Grid/Controller.ts" />
/// <reference path="Jobs/JobProvider.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    Script.availableJobs = new Set([Script.JobType.NONE, Script.JobType.GATHER_FOOD, Script.JobType.GATHER_STONE, Script.JobType.BUILD]);
    Script.grid = new Script.Grid(new ƒ.Vector2(44, 44));
    Script.gridBuilder = new Script.GridBuilder(Script.grid);
    let uis;
    let activeUI;
    function setupUI() {
        if (ƒ.Project.mode === ƒ.MODE.EDITOR)
            return;
        uis = new Map([
            ["build", Script.gridBuilder],
            ["close", new PickController()],
            ["job", new JobController()],
        ]);
        activeUI = uis.get("close");
        activeUI?.enable();
        document.querySelectorAll("button[data-target]").forEach((btn) => {
            btn.addEventListener("click", () => {
                enableUI(btn.dataset.target);
            });
        });
        new CameraController().enable();
    }
    Script.setupUI = setupUI;
    function enableUI(_type) {
        let nextUI = uis.get(_type);
        if (!nextUI)
            return;
        if (activeUI)
            activeUI.disable();
        nextUI.enable();
        activeUI = nextUI;
    }
    class CameraController {
        constructor() {
            this.canvas = document.querySelector("canvas");
            this.camera = Script.findFirstCameraInGraph(Script.viewport.getBranch());
            this.currentZoom = 3;
            this.zoomFactor = 10;
            this.zoomFactorLimits = [0, 10];
            this.cameraPositionLimits = new ƒ.Vector2(Script.grid.size.x / 2, Script.grid.size.y / 2);
            this.zoom = (_event) => {
                const direction = -Math.sign(_event.deltaY);
                const newZoom = this.currentZoom + direction;
                if (newZoom < this.zoomFactorLimits[0] || newZoom > this.zoomFactorLimits[1])
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
                        this.prevPosition = Script.getPlanePositionFromMousePosition(new ƒ.Vector2(_event.clientX, _event.clientY));
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
                        let pos = Script.getPlanePositionFromMousePosition(new ƒ.Vector2(_event.clientX, _event.clientY));
                        let diff = ƒ.Vector3.DIFFERENCE(pos, this.prevPosition).negate();
                        // console.log(_event.movementX, _event.movementY, pos, this.prevPosition, diff);
                        this.camera.node.mtxLocal.translate(diff, false);
                        requestAnimationFrame(() => {
                            this.prevPosition = Script.getPlanePositionFromMousePosition(new ƒ.Vector2(_event.clientX, _event.clientY));
                            // check for boundaries
                            let centerPos = Script.getPlanePositionFromMousePosition(new ƒ.Vector2(this.canvas.width / 2, this.canvas.height / 2));
                            let maxCenterPos = new ƒ.Vector3(Math.min(this.cameraPositionLimits.x, Math.max(-this.cameraPositionLimits.x, centerPos.x)), 0, Math.min(this.cameraPositionLimits.y, Math.max(-this.cameraPositionLimits.y, centerPos.z)));
                            let correction = ƒ.Vector3.DIFFERENCE(maxCenterPos, centerPos);
                            if (!correction.equals(ƒ.Vector3.ZERO())) {
                                this.camera.node.mtxLocal.translate(correction, false);
                                requestAnimationFrame(() => {
                                    this.prevPosition = Script.getPlanePositionFromMousePosition(new ƒ.Vector2(_event.clientX, _event.clientY));
                                });
                            }
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
    let selectedEumling;
    class PickController {
        constructor() {
            this.canvas = document.querySelector("canvas");
            this.wrapper = document.getElementById("main-menu");
            this.click = (_event) => {
                let picks = this.findAllPickedObjectsUsingPickSphere({ x: _event.clientX, y: _event.clientY });
                if (!picks.length)
                    return;
                selectedEumling = picks[0];
                enableUI("job");
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
    class JobController {
        constructor() {
            this.dialog = document.getElementById("job-dialog");
            this.wrapper = document.getElementById("job-wrapper");
            this.close = (_e) => {
                if (_e.newState === "closed") {
                    enableUI("close");
                }
            };
            this.disable = () => {
                this.dialog.removeEventListener("toggle", this.close);
                this.dialog.hidePopover();
            };
        }
        enable() {
            this.dialog.showPopover();
            this.dialog.addEventListener("toggle", this.close);
            let buttons = [];
            let keys = Script.availableJobs.values();
            for (let job of keys) {
                const btn = Script.createElementAdvanced("button", { innerHTML: Script.JobType[job] });
                btn.addEventListener("click", () => {
                    selectedEumling.getComponent(Script.JobTaker).job = job;
                    enableUI("close");
                });
                buttons.push(btn);
            }
            this.wrapper.replaceChildren(...buttons);
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let BuildData = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = Script.UpdateScriptComponent;
        let _interactionRadius_decorators;
        let _interactionRadius_initializers = [];
        let _interactionRadius_extraInitializers = [];
        let _buildUpGraph_decorators;
        let _buildUpGraph_initializers = [];
        let _buildUpGraph_extraInitializers = [];
        var BuildData = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _interactionRadius_decorators = [ƒ.serialize(Number)];
                _buildUpGraph_decorators = [ƒ.serialize(ƒ.Graph)];
                __esDecorate(null, null, _interactionRadius_decorators, { kind: "field", name: "interactionRadius", static: false, private: false, access: { has: obj => "interactionRadius" in obj, get: obj => obj.interactionRadius, set: (obj, value) => { obj.interactionRadius = value; } }, metadata: _metadata }, _interactionRadius_initializers, _interactionRadius_extraInitializers);
                __esDecorate(null, null, _buildUpGraph_decorators, { kind: "field", name: "buildUpGraph", static: false, private: false, access: { has: obj => "buildUpGraph" in obj, get: obj => obj.buildUpGraph, set: (obj, value) => { obj.buildUpGraph = value; } }, metadata: _metadata }, _buildUpGraph_initializers, _buildUpGraph_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                BuildData = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            constructor() {
                super(...arguments);
                this.interactionRadius = __runInitializers(this, _interactionRadius_initializers, 1);
                this.buildUpGraph = (__runInitializers(this, _interactionRadius_extraInitializers), __runInitializers(this, _buildUpGraph_initializers, void 0));
                __runInitializers(this, _buildUpGraph_extraInitializers);
            }
        };
        return BuildData = _classThis;
    })();
    Script.BuildData = BuildData;
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
        let _graph_decorators;
        let _graph_initializers = [];
        let _graph_extraInitializers = [];
        let _size_decorators;
        let _size_initializers = [];
        let _size_extraInitializers = [];
        let _name_decorators;
        let _name_initializers = [];
        let _name_extraInitializers = [];
        let _costFood_decorators;
        let _costFood_initializers = [];
        let _costFood_extraInitializers = [];
        let _costStone_decorators;
        let _costStone_initializers = [];
        let _costStone_extraInitializers = [];
        let _includeInMenu_decorators;
        let _includeInMenu_initializers = [];
        let _includeInMenu_extraInitializers = [];
        var Building = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _graph_decorators = [ƒ.serialize(ƒ.Graph)];
                _size_decorators = [ƒ.serialize(Number)];
                _name_decorators = [ƒ.serialize(String)];
                _costFood_decorators = [ƒ.serialize(Number)];
                _costStone_decorators = [ƒ.serialize(Number)];
                _includeInMenu_decorators = [ƒ.serialize(Boolean)];
                __esDecorate(null, null, _graph_decorators, { kind: "field", name: "graph", static: false, private: false, access: { has: obj => "graph" in obj, get: obj => obj.graph, set: (obj, value) => { obj.graph = value; } }, metadata: _metadata }, _graph_initializers, _graph_extraInitializers);
                __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
                __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
                __esDecorate(null, null, _costFood_decorators, { kind: "field", name: "costFood", static: false, private: false, access: { has: obj => "costFood" in obj, get: obj => obj.costFood, set: (obj, value) => { obj.costFood = value; } }, metadata: _metadata }, _costFood_initializers, _costFood_extraInitializers);
                __esDecorate(null, null, _costStone_decorators, { kind: "field", name: "costStone", static: false, private: false, access: { has: obj => "costStone" in obj, get: obj => obj.costStone, set: (obj, value) => { obj.costStone = value; } }, metadata: _metadata }, _costStone_initializers, _costStone_extraInitializers);
                __esDecorate(null, null, _includeInMenu_decorators, { kind: "field", name: "includeInMenu", static: false, private: false, access: { has: obj => "includeInMenu" in obj, get: obj => obj.includeInMenu, set: (obj, value) => { obj.includeInMenu = value; } }, metadata: _metadata }, _includeInMenu_initializers, _includeInMenu_extraInitializers);
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
                this.graph = __runInitializers(this, _graph_initializers, void 0);
                this.size = (__runInitializers(this, _graph_extraInitializers), __runInitializers(this, _size_initializers, 1));
                this.name = (__runInitializers(this, _size_extraInitializers), __runInitializers(this, _name_initializers, ""));
                this.costFood = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _costFood_initializers, 5));
                this.costStone = (__runInitializers(this, _costFood_extraInitializers), __runInitializers(this, _costStone_initializers, 5));
                this.includeInMenu = (__runInitializers(this, _costStone_extraInitializers), __runInitializers(this, _includeInMenu_initializers, false));
                __runInitializers(this, _includeInMenu_extraInitializers);
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, () => {
                    Building.all.push(this);
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
        let _modelBase_decorators;
        let _modelBase_initializers = [];
        let _modelBase_extraInitializers = [];
        let _modelMine_decorators;
        let _modelMine_initializers = [];
        let _modelMine_extraInitializers = [];
        let _modelBuild_decorators;
        let _modelBuild_initializers = [];
        let _modelBuild_extraInitializers = [];
        let _modelFood_decorators;
        let _modelFood_initializers = [];
        let _modelFood_extraInitializers = [];
        let _animIdle_decorators;
        let _animIdle_initializers = [];
        let _animIdle_extraInitializers = [];
        let _animWalk_decorators;
        let _animWalk_initializers = [];
        let _animWalk_extraInitializers = [];
        let _animGatherFood_decorators;
        let _animGatherFood_initializers = [];
        let _animGatherFood_extraInitializers = [];
        let _animGatherStone_decorators;
        let _animGatherStone_initializers = [];
        let _animGatherStone_extraInitializers = [];
        let _animBuild_decorators;
        let _animBuild_initializers = [];
        let _animBuild_extraInitializers = [];
        var JobAnimation = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _modelBase_decorators = [ƒ.serialize(ƒ.Graph)];
                _modelMine_decorators = [ƒ.serialize(ƒ.Graph)];
                _modelBuild_decorators = [ƒ.serialize(ƒ.Graph)];
                _modelFood_decorators = [ƒ.serialize(ƒ.Graph)];
                _animIdle_decorators = [ƒ.serialize(ƒ.Animation)];
                _animWalk_decorators = [ƒ.serialize(ƒ.Animation)];
                _animGatherFood_decorators = [ƒ.serialize(ƒ.Animation)];
                _animGatherStone_decorators = [ƒ.serialize(ƒ.Animation)];
                _animBuild_decorators = [ƒ.serialize(ƒ.Animation)];
                __esDecorate(null, null, _modelBase_decorators, { kind: "field", name: "modelBase", static: false, private: false, access: { has: obj => "modelBase" in obj, get: obj => obj.modelBase, set: (obj, value) => { obj.modelBase = value; } }, metadata: _metadata }, _modelBase_initializers, _modelBase_extraInitializers);
                __esDecorate(null, null, _modelMine_decorators, { kind: "field", name: "modelMine", static: false, private: false, access: { has: obj => "modelMine" in obj, get: obj => obj.modelMine, set: (obj, value) => { obj.modelMine = value; } }, metadata: _metadata }, _modelMine_initializers, _modelMine_extraInitializers);
                __esDecorate(null, null, _modelBuild_decorators, { kind: "field", name: "modelBuild", static: false, private: false, access: { has: obj => "modelBuild" in obj, get: obj => obj.modelBuild, set: (obj, value) => { obj.modelBuild = value; } }, metadata: _metadata }, _modelBuild_initializers, _modelBuild_extraInitializers);
                __esDecorate(null, null, _modelFood_decorators, { kind: "field", name: "modelFood", static: false, private: false, access: { has: obj => "modelFood" in obj, get: obj => obj.modelFood, set: (obj, value) => { obj.modelFood = value; } }, metadata: _metadata }, _modelFood_initializers, _modelFood_extraInitializers);
                __esDecorate(null, null, _animIdle_decorators, { kind: "field", name: "animIdle", static: false, private: false, access: { has: obj => "animIdle" in obj, get: obj => obj.animIdle, set: (obj, value) => { obj.animIdle = value; } }, metadata: _metadata }, _animIdle_initializers, _animIdle_extraInitializers);
                __esDecorate(null, null, _animWalk_decorators, { kind: "field", name: "animWalk", static: false, private: false, access: { has: obj => "animWalk" in obj, get: obj => obj.animWalk, set: (obj, value) => { obj.animWalk = value; } }, metadata: _metadata }, _animWalk_initializers, _animWalk_extraInitializers);
                __esDecorate(null, null, _animGatherFood_decorators, { kind: "field", name: "animGatherFood", static: false, private: false, access: { has: obj => "animGatherFood" in obj, get: obj => obj.animGatherFood, set: (obj, value) => { obj.animGatherFood = value; } }, metadata: _metadata }, _animGatherFood_initializers, _animGatherFood_extraInitializers);
                __esDecorate(null, null, _animGatherStone_decorators, { kind: "field", name: "animGatherStone", static: false, private: false, access: { has: obj => "animGatherStone" in obj, get: obj => obj.animGatherStone, set: (obj, value) => { obj.animGatherStone = value; } }, metadata: _metadata }, _animGatherStone_initializers, _animGatherStone_extraInitializers);
                __esDecorate(null, null, _animBuild_decorators, { kind: "field", name: "animBuild", static: false, private: false, access: { has: obj => "animBuild" in obj, get: obj => obj.animBuild, set: (obj, value) => { obj.animBuild = value; } }, metadata: _metadata }, _animBuild_initializers, _animBuild_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                JobAnimation = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            #animations;
            #models;
            #currentAnimation;
            #animator;
            async start(_e) {
                this.#animations.set(NonJobAnimations.WALK, this.animWalk);
                this.#animations.set(Script.JobType.NONE, this.animIdle);
                this.#animations.set(Script.JobType.STORE_RESOURCE, this.animIdle);
                this.#animations.set(Script.JobType.GATHER_FOOD, this.animGatherFood);
                this.#animations.set(Script.JobType.GATHER_STONE, this.animGatherStone);
                this.#animations.set(Script.JobType.BUILD, this.animBuild);
                if (this.modelBase)
                    this.#models.set(Script.JobType.NONE, await ƒ.Project.createGraphInstance(this.modelBase));
                if (this.modelBuild)
                    this.#models.set(Script.JobType.BUILD, await ƒ.Project.createGraphInstance(this.modelBuild));
                if (this.modelFood)
                    this.#models.set(Script.JobType.GATHER_FOOD, await ƒ.Project.createGraphInstance(this.modelFood));
                if (this.modelMine)
                    this.#models.set(Script.JobType.GATHER_STONE, await ƒ.Project.createGraphInstance(this.modelMine));
                this.setModel(Script.JobType.NONE);
                this.playAnimation(Script.JobType.NONE);
            }
            playAnimation(anim) {
                if (!this.#animator)
                    return;
                if (anim === this.#currentAnimation)
                    return;
                let animationToPlay = this.#animations.get(anim);
                if (!animationToPlay)
                    return;
                this.#animator.animation = animationToPlay;
                this.#animator.jumpTo(0);
                this.#currentAnimation = anim;
            }
            setModel(model) {
                let modelToPlace = this.#models.get(model);
                if (!modelToPlace)
                    return;
                this.node.removeAllChildren();
                this.node.appendChild(modelToPlace);
                this.#animator = modelToPlace.getComponent(ƒ.ComponentAnimation);
                this.#animator.playmode = ƒ.ANIMATION_PLAYMODE.LOOP;
                this.#animator.activate(true);
            }
            constructor() {
                super(...arguments);
                this.#animations = new Map();
                this.#models = new Map();
                this.modelBase = __runInitializers(this, _modelBase_initializers, void 0);
                this.modelMine = (__runInitializers(this, _modelBase_extraInitializers), __runInitializers(this, _modelMine_initializers, void 0));
                this.modelBuild = (__runInitializers(this, _modelMine_extraInitializers), __runInitializers(this, _modelBuild_initializers, void 0));
                this.modelFood = (__runInitializers(this, _modelBuild_extraInitializers), __runInitializers(this, _modelFood_initializers, void 0));
                this.animIdle = (__runInitializers(this, _modelFood_extraInitializers), __runInitializers(this, _animIdle_initializers, void 0));
                this.animWalk = (__runInitializers(this, _animIdle_extraInitializers), __runInitializers(this, _animWalk_initializers, void 0));
                this.animGatherFood = (__runInitializers(this, _animWalk_extraInitializers), __runInitializers(this, _animGatherFood_initializers, void 0));
                this.animGatherStone = (__runInitializers(this, _animGatherFood_extraInitializers), __runInitializers(this, _animGatherStone_initializers, void 0));
                this.animBuild = (__runInitializers(this, _animGatherStone_extraInitializers), __runInitializers(this, _animBuild_initializers, void 0));
                __runInitializers(this, _animBuild_extraInitializers);
            }
        };
        return JobAnimation = _classThis;
    })();
    Script.JobAnimation = JobAnimation;
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
        let _speed_decorators;
        let _speed_initializers = [];
        let _speed_extraInitializers = [];
        var JobTaker = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _speed_decorators = [ƒ.serialize(Number)];
                __esDecorate(null, null, _speed_decorators, { kind: "field", name: "speed", static: false, private: false, access: { has: obj => "speed" in obj, get: obj => obj.speed, set: (obj, value) => { obj.speed = value; } }, metadata: _metadata }, _speed_initializers, _speed_extraInitializers);
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
            #timers;
            constructor() {
                super();
                this.#job = Script.JobType.NONE;
                this.#currentJob = Script.JobType.NONE;
                this.#progress = 0;
                this.#timers = [];
                this.speed = __runInitializers(this, _speed_initializers, 1);
                this.#needToRemoveTarget = (__runInitializers(this, _speed_extraInitializers), false);
                this.gatherResource = (deltaTime) => {
                    switch (this.#progress) {
                        case 0: {
                            // look for target
                            this.#currentJob = Script.JobType.NONE;
                            this.#animator.playAnimation(Script.JobType.NONE);
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
                                let timer = new ƒ.Timer(ƒ.Time.game, this.#target.jobDuration, 1, () => {
                                    this.#progress++;
                                    this.#target.jobFinish();
                                });
                                this.#timers.push(timer);
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
                            this.#animator.playAnimation(Script.JobType.NONE);
                            const target = this.findAndSetTargetForJob(Script.JobType.STORE_RESOURCE);
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
                            if (this.#job === Script.JobType.GATHER_FOOD) {
                                Script.Data.food += Math.max(1, Script.BonusProvider.getBonus(Script.BonusData.FOOD, 1));
                            }
                            else if (this.#job === Script.JobType.GATHER_STONE) {
                                Script.Data.stone += Math.max(1, Script.BonusProvider.getBonus(Script.BonusData.STONE, 1));
                            }
                            this.#progress = 0;
                            break;
                        }
                    }
                };
                this.build = (deltaTime) => {
                    // console.log(this.#progress);
                    if (this.#progress < 10) {
                        const target = this.findAndSetTargetForJob(this.#job);
                        if (target) {
                            this.#progress = 10;
                            this.#prevDistance = Infinity;
                        }
                        else {
                            this.idle(deltaTime);
                        }
                    }
                    switch (this.#progress) {
                        case 10: {
                            let reachedTarget = this.moveToTarget(deltaTime);
                            this.#animator.playAnimation(this.#job);
                            if (reachedTarget) {
                                this.#progress = 11;
                                this.#target.jobStart();
                                let timer = new ƒ.Timer(ƒ.Time.game, this.#target.jobDuration, 1, () => {
                                    this.#progress = 12;
                                    this.#target.jobFinish();
                                });
                                this.#timers.push(timer);
                            }
                            break;
                        }
                        case 11: {
                            // building
                            break;
                        }
                        case 12: {
                            // done building
                            this.#progress = 2;
                        }
                    }
                };
                this.idle = (deltaTime) => {
                    switch (this.#progress) {
                        case 0: {
                            this.#animator.playAnimation(Script.JobType.NONE);
                            this.#progress++;
                            this.#timers.push(new ƒ.Timer(ƒ.Time.game, Script.randomRange(1000, 5000), 1, () => {
                                this.#progress = 2;
                            }));
                            break;
                        }
                        case 1: {
                            // just idling around
                            break;
                        }
                        case 2: {
                            // create a random walk target
                            const node = new ƒ.Node("walk_target");
                            const jp = new Script.JobProviderNone();
                            node.addComponent(jp);
                            node.addComponent(new ƒ.ComponentTransform);
                            this.node.getParent().addChild(node);
                            node.mtxLocal.translateX(Math.max(-20, Math.min(20, Math.sign(Script.randomRange(-1, 1)) * Script.randomRange(3, 5) + this.node.mtxWorld.translation.x)));
                            node.mtxLocal.translateZ(Math.max(-20, Math.min(20, Math.sign(Script.randomRange(-1, 1)) * Script.randomRange(3, 5) + this.node.mtxWorld.translation.z)));
                            this.#target = jp;
                            this.node.mtxLocal.lookAt(node.mtxLocal.translation);
                            this.#progress = 3;
                            this.#needToRemoveTarget = true;
                            break;
                        }
                        case 3: {
                            const reached = this.moveToTarget(deltaTime);
                            if (reached) {
                                this.removeTarget();
                                this.#progress = 0;
                            }
                        }
                    }
                };
                this.#prevDistance = Infinity;
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                this.#executableJobs = new Map([
                    [Script.JobType.NONE, this.idle],
                    [Script.JobType.BUILD, this.build],
                    [Script.JobType.GATHER_FOOD, this.gatherResource],
                    [Script.JobType.GATHER_STONE, this.gatherResource],
                ]);
            }
            #needToRemoveTarget;
            set job(_job) {
                if (this.#needToRemoveTarget) {
                    this.removeTarget();
                }
                this.#job = _job;
                this.#animator.setModel(this.#job);
                this.#animator.playAnimation(Script.JobType.NONE);
                this.#progress = 0;
                this.#timers.forEach(t => t.clear());
                this.#timers.length = 0;
                this.#prevDistance = Infinity;
            }
            static findClosestJobProvider(_job, _location) {
                const foundProviders = [];
                // console.log(_job, JobProvider.JobProviders);
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
            moveAwayNow() {
                if (this.#job !== Script.JobType.NONE && this.#job !== Script.JobType.BUILD) {
                    return;
                }
                this.#progress = 2;
                this.#timers.forEach(t => t.clear());
                this.#timers.length = 0;
                this.#prevDistance = Infinity;
            }
            removeTarget() {
                this.#needToRemoveTarget = false;
                if (!this.#target || !this.#target.node)
                    return;
                let node = this.#target.node;
                node.removeComponent(this.#target);
                node.getParent().removeChild(node);
            }
            #prevDistance;
            moveToTarget(deltaTime) {
                this.#animator.playAnimation(Script.NonJobAnimations.WALK);
                let distance = this.node.mtxWorld.translation.getDistance(this.#target.node.mtxWorld.translation);
                if (distance < this.#target.node.getComponent(Script.BuildData)?.interactionRadius) {
                    // target reached
                    this.#prevDistance = Infinity;
                    return true;
                }
                else if (distance > this.#prevDistance) {
                    // algorithm failed
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
                const target = JobTaker.findClosestJobProvider(_job, this.node.mtxWorld.translation);
                if (!target) {
                    return undefined;
                }
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
        let _offset_extraInitializers = [];
        var PickSphere = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _get_radius_decorators = [ƒ.serialize(Number)];
                _offset_decorators = [ƒ.serialize(ƒ.Vector3)];
                __esDecorate(this, null, _get_radius_decorators, { kind: "getter", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, null, _offset_decorators, { kind: "field", name: "offset", static: false, private: false, access: { has: obj => "offset" in obj, get: obj => obj.offset, set: (obj, value) => { obj.offset = value; } }, metadata: _metadata }, _offset_initializers, _offset_extraInitializers);
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
                __runInitializers(this, _offset_extraInitializers);
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
    function getPlanePositionFromMousePosition(_mousePosition) {
        let ray = Script.viewport.getRayFromClient(_mousePosition);
        let pos = ray.intersectPlane(ƒ.Vector3.ZERO(), ƒ.Vector3.Y(1));
        return pos;
    }
    Script.getPlanePositionFromMousePosition = getPlanePositionFromMousePosition;
    function getDerivedComponent(node, component) {
        return node.getAllComponents().find(c => (c instanceof component));
    }
    Script.getDerivedComponent = getDerivedComponent;
    function getDerivedComponents(node, component) {
        return node.getAllComponents().filter(c => (c instanceof component));
    }
    Script.getDerivedComponents = getDerivedComponents;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map