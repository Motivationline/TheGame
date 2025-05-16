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
    class UpdateScriptComponent extends ƒ.ComponentScript {
        #runStart;
        constructor() {
            super();
            this.#runStart = true;
            this.addInternal = (_e) => {
                this.#runStart = true;
                this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.updateInternal);
            };
            this.removeInternal = (_e) => {
                this.remove?.(_e);
                this.node.removeEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.updateInternal);
            };
            this.updateInternal = (_e) => {
                if (this.#runStart) {
                    this.start?.(_e);
                    this.#runStart = false;
                }
                this.update?.(_e);
            };
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentActivate" /* ƒ.EVENT.COMPONENT_ACTIVATE */, this.addInternal);
            this.addEventListener("componentDeactivate" /* ƒ.EVENT.COMPONENT_DEACTIVATE */, this.removeInternal);
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.addInternal);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.removeInternal);
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
    // import ƒ = FudgeCore;
    class Data {
        static #stone = 0;
        static #food = 0;
        static #builtBuildings = new Map();
        static #buildingPriceMultiplier = 1.5;
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
        static buildingCost(build) {
            if (!this.#builtBuildings.has(build)) {
                this.#builtBuildings.set(build, 0);
            }
            let currentAmount = this.#builtBuildings.get(build);
            return {
                food: Math.floor(build.costFood * Math.pow(this.#buildingPriceMultiplier, currentAmount)),
                stone: Math.floor(build.costStone * Math.pow(this.#buildingPriceMultiplier, currentAmount)),
            };
        }
        static canAffordBuilding(building) {
            const cost = this.buildingCost(building);
            return cost.food <= this.#food && cost.stone <= this.#stone;
        }
        static buyBuilding(building) {
            if (!this.canAffordBuilding(building))
                return false;
            const cost = this.buildingCost(building);
            this.food -= cost.food;
            this.stone -= cost.stone;
            this.#builtBuildings.set(building, (this.#builtBuildings.get(building) ?? 0) + 1);
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
                            element.querySelector(".build-cost-food")?.classList.add("cannot-afford");
                        }
                        else {
                            element.querySelector(".build-cost-food")?.classList.remove("cannot-afford");
                        }
                    }
                    else if (set === "costStone") {
                        if (Number(element.dataset.costStone) > this.#stone) {
                            enabled = false;
                            element.querySelector(".build-cost-stone")?.classList.add("cannot-afford");
                        }
                        else {
                            element.querySelector(".build-cost-stone")?.classList.remove("cannot-afford");
                        }
                    }
                    else if (set === "eumlingLimit") {
                        if (Number(element.dataset.eumlingLimit) > this.eumlingLimit) {
                            enabled = false;
                            element.querySelector(".build-cost-eumling")?.classList.add("cannot-afford");
                        }
                        else {
                            element.querySelector(".build-cost-eumling")?.classList.remove("cannot-afford");
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
        static { this.eumlingPriceMultiplier = 1.2; }
        static { this.eumlingPrices = [
            { food: 0, stone: 0 },
            { food: 10, stone: 0 },
            { food: 20, stone: 5 },
            { food: 40, stone: 10 },
        ]; }
        static { this.eumlingAmount = 0; }
        static { this.createEumling = async () => {
            let current = this.eumlingPrice(this.eumlingAmount);
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
            if (this.eumlingAmount > 0)
                btn.classList.remove("wiggle");
            let current = this.eumlingPrice(this.eumlingAmount);
            if (!current) {
                btn.classList.add("hidden");
                return;
            }
            btn.dataset.costFood = current.food.toString();
            btn.dataset.costStone = current.stone.toString();
            btn.dataset.eumlingLimit = (this.eumlingAmount + 1).toString();
            btn.querySelector("span.build-cost-food").innerHTML = current.food.toString();
            btn.querySelector("span.build-cost-stone").innerHTML = current.stone.toString();
            document.getElementById("eumling-amt").innerText = this.eumlingAmount.toString();
            document.getElementById("eumling-amt-max").innerText = Script.Data.eumlingLimit.toString();
            Script.Data.food += 0;
        }
        static eumlingPrice(_eumlingNumber) {
            let current = this.eumlingPrices[_eumlingNumber];
            if (current)
                return current;
            let last = this.eumlingPrices[this.eumlingPrices.length - 1];
            let multiplier = Math.pow(this.eumlingPriceMultiplier, _eumlingNumber + 1 - this.eumlingPrices.length);
            return {
                food: Math.floor(last.food * multiplier),
                stone: Math.floor(last.stone * multiplier),
            };
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
    class Pathfinder {
        constructor(grid) {
            this.grid = grid;
        }
        getPath(_from, _to) {
            if (Script.grid.getTile(_to, false))
                return []; // target tile is blocked, we cannot walk there.
            // using A* algorithm
            let startTile = Script.grid.getTile(_from, false);
            this.openList = new Map([[_from.toString(), { f: 0, node: _from, g: 0, blocked: !!startTile }]]); // starting with _from so the result is reversed. Need to do that for blocked check
            this.closedList = new Set();
            this.target = _to;
            let list = [];
            while (this.openList.size > 0) {
                list = this.openList.values().toArray().sort((a, b) => a.f - b.f);
                const currentNode = list.shift();
                this.openList.delete(currentNode.node.toString());
                if (currentNode.node.equals(this.target)) {
                    return this.nodesToArray(currentNode).reverse();
                }
                this.closedList.add(currentNode.node.toString());
                this.expandNode(currentNode);
            }
            return [];
        }
        nodesToArray(_startNode) {
            const list = [];
            let node = _startNode;
            while (node) {
                list.push(node.node);
                node = node.previous;
            }
            return list;
        }
        expandNode(_node) {
            let pos = new ƒ.Vector2();
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    this.expandNodeNeighbor(pos.set(_node.node.x + x, _node.node.y + y), _node);
                }
            }
        }
        expandNodeNeighbor(_pos, _currentNode) {
            // pos is already on closed list -> it's already done getting checked
            if (this.closedList.has(_pos.toString()))
                return;
            let tile = this.grid.getTile(_pos, false);
            // tile is outside of existing grid
            if (tile === null)
                return;
            // next tile is blocked = only walkable if current is also blocked
            if (tile !== undefined && !_currentNode.blocked)
                return;
            let g = _currentNode.g + Script.vector2Distance(_pos, _currentNode.node);
            let existingNode = this.openList.get(_pos.toString());
            if (existingNode && g >= existingNode.g)
                return;
            if (!existingNode)
                existingNode = { node: _pos.clone, f: 0, g: 0, blocked: !!tile };
            existingNode.previous = _currentNode;
            existingNode.g = g;
            existingNode.f = g + Script.vector2Distance(_pos, this.target);
            this.openList.set(existingNode.node.toString(), existingNode);
        }
    }
    Script.Pathfinder = Pathfinder;
})(Script || (Script = {}));
/// <reference path="Pathfinder.ts" />
var Script;
/// <reference path="Pathfinder.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    class Grid {
        #size;
        #tiles = [];
        #pathfinder;
        constructor(_size) {
            this.size = _size;
            this.#pathfinder = new Script.Pathfinder(this);
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
        /**
         * @returns null if outside the grid, undefined if empty, else the found Tile
         */
        getTile(_pos, inWorldCoordinates) {
            if (inWorldCoordinates)
                _pos = this.worldPosToTilePos(_pos);
            if (_pos.x < 0 || _pos.y < 0)
                return null;
            if (_pos.x > this.#size.x - 1 || _pos.y > this.#size.y - 1)
                return null;
            return this.#tiles[_pos.y][_pos.x];
        }
        setTile(_tile, _pos) {
            if (this.getTile(_pos, false) === null)
                return;
            this.#tiles[_pos.y][_pos.x] = _tile;
        }
        worldPosToTilePos(_pos, _out = new ƒ.Vector2()) {
            return _out.set(Math.floor(_pos.x + this.#size.x / 2), Math.floor(_pos.y + this.#size.y / 2));
        }
        tilePosToWorldPos(_pos, _out = new ƒ.Vector2()) {
            return _out.set(_pos.x - this.#size.x / 2, _pos.y - this.#size.y / 2);
        }
        getPath(_from, _to) {
            return this.#pathfinder.getPath(_from, _to);
        }
    }
    Script.Grid = Grid;
    class GridDisplayComponent extends ƒ.Component {
        static { this.iSubclass = ƒ.Component.registerSubclass(GridDisplayComponent); }
        drawGizmos(_cmpCamera) {
            const corners = [];
            for (let x = 0; x < Script.grid.size.x; x++) {
                corners.push(ƒ.Recycler.reuse(ƒ.Vector3).set(x, 0, 0), ƒ.Recycler.reuse(ƒ.Vector3).set(x, 0, Script.grid.size.y));
            }
            for (let y = 0; y < Script.grid.size.y; y++) {
                corners.push(ƒ.Recycler.reuse(ƒ.Vector3).set(0, 0, y), ƒ.Recycler.reuse(ƒ.Vector3).set(Script.grid.size.x, 0.01, y));
            }
            let mtx = ƒ.Recycler.get(ƒ.Matrix4x4);
            mtx.translateX(-Script.grid.size.x / 2);
            mtx.translateZ(-Script.grid.size.y / 2);
            ƒ.Gizmos.drawLines(corners, mtx, new ƒ.Color(0, 0, 0, 1));
            corners.forEach(v => ƒ.Recycler.store(v));
            ƒ.Recycler.store(mtx);
        }
    }
    Script.GridDisplayComponent = GridDisplayComponent;
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
        // viewport.gizmosEnabled = true;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
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
        let camera = Script.findFirstComponentInGraph(graph, ƒ.ComponentCamera);
        Script.viewport.initialize("game", graph, camera, canvas);
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: Script.viewport }));
        document.getElementById("click-start").remove();
        Script.setupUI();
        setupSounds(camera.node);
        createStartingWorld();
        new Script.MusicController();
    }
    function setupSounds(camera) {
        ƒ.AudioManager.default.listenTo(Script.viewport.getBranch());
        ƒ.AudioManager.default.listenWith(camera.getComponent(ƒ.ComponentAudioListener));
    }
    async function createStartingWorld() {
        const pos = new ƒ.Vector2(15, 15);
        // starter hut
        // let starterHut = Building.all.find(b => b.name === "Wohnhaus");
        // if (starterHut) await gridBuilder.placeGraphOnGrid(pos, starterHut.size, starterHut.graph);
        // set center to occupied by goddesstatue
        let statue = Script.viewport.getBranch().getChildrenByName("GodessWrapper")[0]?.getChild(0);
        if (!statue)
            return;
        for (let y = -2; y <= 2; y++) {
            for (let x = -2; x <= 2; x++) {
                Script.grid.setTile({ origin: false, type: "goddess", node: statue }, pos.set(Math.floor(Script.grid.size.x / 2) + x, Math.floor(Script.grid.size.y / 2) + y));
            }
        }
        // gathering spots
        let foodSpot = Script.Building.all.find(b => b.name === "GatherFood");
        if (foodSpot) {
            for (let i = 0; i < 50; i++) {
                pos.set(Math.floor((Script.randomRange(-11, 11) + 44) % 44), Math.floor(Script.randomRange(11, 33)));
                let tile = Script.grid.getTile(pos, false);
                if (tile)
                    continue;
                await Script.gridBuilder.placeGraphOnGrid(pos, foodSpot.size, foodSpot.graph);
            }
        }
        // gathering spots
        let stoneSpot = Script.Building.all.find(b => b.name === "GatherStone");
        if (stoneSpot) {
            for (let i = 0; i < 50; i++) {
                pos.set(Math.floor(Script.randomRange(11, 33)), Math.floor((Script.randomRange(-11, 11) + 44) % 44));
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
                this.highlightGrid(_event);
                let marker = await this.placeGraphOnGrid(this.currentPosition, this.selectedBuilding.size, this.selectedBuilding.graph);
                this.forEachSelectedTile(this.currentPosition, this.selectedBuilding.size, (tile, pos) => {
                    this.grid.setTile({ type: "test", origin: this.currentPosition.equals(pos), node: marker }, pos);
                });
                // make it so building needs to be built before it takes effect
                Script.getDerivedComponents(marker, Script.JobProvider).forEach((jobCmp) => { jobCmp.activate(false); });
                marker.getComponents(Script.BonusProvider).forEach((bonusCmp) => { bonusCmp.activate(false); });
                const buildupCmp = new Script.JobProviderBuild(this.selectedBuilding.costFood + this.selectedBuilding.costStone);
                marker.addComponent(buildupCmp);
                // place temporary node & hide current child
                let graphToPlace = marker.getComponent(Script.BuildData)?.buildUpGraph;
                if (graphToPlace) {
                    let placeholder = await ƒ.Project.createGraphInstance(graphToPlace);
                    buildupCmp.nodeToRemove = placeholder;
                    marker.addChild(placeholder);
                    buildupCmp.nodeToEnable = marker.getChild(0);
                    marker.getChild(0)?.activate(false);
                }
                // close this UI
                Script.enableUI("close");
            };
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            this.wrapper = document.getElementById("build-menu").parentElement;
            this.buildings = document.getElementById("build-menu-buildings");
        }
        async enable() {
            this.wrapper.classList.remove("hidden");
            this.selectedBuilding = undefined;
            this.currentPosition = undefined;
            this.canvas.addEventListener("mousemove", this.highlightGrid);
            this.canvas.addEventListener("mouseup", this.placeOnGrid);
            this.generateBuildingButtons();
            if (!this.marker) {
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
                const cost = Script.Data.buildingCost(build);
                const button = Script.createElementAdvanced("button", {
                    innerHTML: `
                    <span class="build-name">${build.name ?? build.graph.name}</span>
                    <img src="Assets/UI/${build.name.toLocaleLowerCase()}_button.svg" />
                    <div class="build-cost">
                        <span class="build-cost-food">${cost.food}</span>
                        <span class="build-cost-stone">${cost.stone}</span>
                    </div>
                    <span class="build-description">${build.description}</span>`,
                    classes: ["build", "no-button"],
                });
                if (Script.Data.food < cost.food || Script.Data.stone < cost.stone)
                    button.disabled = true;
                button.dataset.costFood = cost.food.toString();
                button.dataset.costStone = cost.stone.toString();
                button.addEventListener("click", () => {
                    this.selectBuilding(build);
                });
                buttons.push(button);
            }
            this.buildings.replaceChildren(...buttons);
            Script.Data.food += 0;
        }
        async placeGraphOnGrid(_posOfTile, _size, _graph) {
            // visually add building
            let marker = await ƒ.Project.createGraphInstance(_graph);
            Script.viewport.getBranch().appendChild(marker);
            let worldPos = this.grid.tilePosToWorldPos(_posOfTile);
            marker.mtxLocal.translation = new ƒ.Vector3(worldPos.x + _size / 2, 0, worldPos.y + _size / 2);
            setTimeout(() => {
                Script.EumlingCreator.updateButton();
            }, 1);
            this.forEachSelectedTile(_posOfTile, _size, (t, pos) => {
                this.grid.setTile({ type: "test", origin: _posOfTile.equals(pos), node: marker }, pos);
            });
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
            this.wrapper.classList.add("hidden");
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
    Script.jobTypeInfo = new Map([
        [JobType.NONE, { name: "Nichts", description: "Entspannt sich", img: "Assets/UI/nothing_button.svg" }],
        [JobType.BUILD, { name: "Architekt", description: "Baut Gebäude", img: "Assets/UI/buildings_button.svg" }],
        [JobType.GATHER_FOOD, { name: "Farmer", description: "Sammelt Essen", img: "Assets/UI/farmer_button.svg" }],
        [JobType.GATHER_STONE, { name: "Miner", description: "Sammelt Stein", img: "Assets/UI/miner_button.svg" }],
    ]);
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
        let _animationActive_decorators;
        let _animationActive_initializers = [];
        let _animationActive_extraInitializers = [];
        let _animationCooldown_decorators;
        let _animationCooldown_initializers = [];
        let _animationCooldown_extraInitializers = [];
        var JobProvider = class extends _classSuper {
            static { _classThis = this; }
            constructor() {
                super(...arguments);
                this._jobType = __runInitializers(this, __jobType_initializers, void 0);
                this.jobDuration = (__runInitializers(this, __jobType_extraInitializers), __runInitializers(this, _jobDuration_initializers, 500));
                this.cooldown = (__runInitializers(this, _jobDuration_extraInitializers), __runInitializers(this, _cooldown_initializers, 30000));
                this.animationActive = (__runInitializers(this, _cooldown_extraInitializers), __runInitializers(this, _animationActive_initializers, void 0));
                this.animationCooldown = (__runInitializers(this, _animationActive_extraInitializers), __runInitializers(this, _animationCooldown_initializers, void 0));
                this.#currentCooldown = (__runInitializers(this, _animationCooldown_extraInitializers), 0);
            }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                __jobType_decorators = [ƒ.serialize(JobType)];
                _jobDuration_decorators = [ƒ.serialize(Number)];
                _cooldown_decorators = [ƒ.serialize(Number)];
                _animationActive_decorators = [ƒ.serialize(ƒ.Animation)];
                _animationCooldown_decorators = [ƒ.serialize(ƒ.Animation)];
                __esDecorate(null, null, __jobType_decorators, { kind: "field", name: "_jobType", static: false, private: false, access: { has: obj => "_jobType" in obj, get: obj => obj._jobType, set: (obj, value) => { obj._jobType = value; } }, metadata: _metadata }, __jobType_initializers, __jobType_extraInitializers);
                __esDecorate(null, null, _jobDuration_decorators, { kind: "field", name: "jobDuration", static: false, private: false, access: { has: obj => "jobDuration" in obj, get: obj => obj.jobDuration, set: (obj, value) => { obj.jobDuration = value; } }, metadata: _metadata }, _jobDuration_initializers, _jobDuration_extraInitializers);
                __esDecorate(null, null, _cooldown_decorators, { kind: "field", name: "cooldown", static: false, private: false, access: { has: obj => "cooldown" in obj, get: obj => obj.cooldown, set: (obj, value) => { obj.cooldown = value; } }, metadata: _metadata }, _cooldown_initializers, _cooldown_extraInitializers);
                __esDecorate(null, null, _animationActive_decorators, { kind: "field", name: "animationActive", static: false, private: false, access: { has: obj => "animationActive" in obj, get: obj => obj.animationActive, set: (obj, value) => { obj.animationActive = value; } }, metadata: _metadata }, _animationActive_initializers, _animationActive_extraInitializers);
                __esDecorate(null, null, _animationCooldown_decorators, { kind: "field", name: "animationCooldown", static: false, private: false, access: { has: obj => "animationCooldown" in obj, get: obj => obj.animationCooldown, set: (obj, value) => { obj.animationCooldown = value; } }, metadata: _metadata }, _animationCooldown_initializers, _animationCooldown_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                JobProvider = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.JobProviders = new Set(); }
            #currentCooldown;
            #targeted;
            #animator;
            start(_e) {
                JobProvider.JobProviders.add(this);
                this.#animator = Script.findFirstComponentInGraph(this.node, ƒ.ComponentAnimation);
            }
            remove(_e) {
                JobProvider.JobProviders.delete(this);
            }
            jobStart() {
                if (this.#animator && this.animationActive) {
                    this.#animator.animation = this.animationActive;
                    this.#animator.playmode = ƒ.ANIMATION_PLAYMODE.PLAY_ONCE;
                    this.#animator.time = 0;
                }
            }
            jobFinish() {
                this.#currentCooldown = this.cooldown;
                this.target(false);
            }
            target(_targeted) {
                this.#targeted = _targeted;
            }
            get jobType() {
                if (this.#currentCooldown > 0) {
                    return JobType.NONE;
                }
                return this._jobType;
            }
            get targeted() {
                return this.#targeted;
            }
            update(_e) {
                if (this.#currentCooldown > 0) {
                    this.#currentCooldown -= ƒ.Loop.timeFrameGame;
                    if (this.#currentCooldown <= 0) {
                        if (this.#animator && this.animationCooldown) {
                            this.#animator.animation = this.animationCooldown;
                            this.#animator.time = 0;
                        }
                    }
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
        target(_targeted) { }
    }
    Script.JobProviderStoreResource = JobProviderStoreResource;
    class JobProviderBuild extends JobProvider {
        constructor(resourceAmt) {
            super();
            this._jobType = JobType.BUILD;
            this.jobDuration = resourceAmt * 200;
        }
        jobFinish() {
            super.jobFinish();
            for (let cmp of this.node.getAllComponents()) {
                if (cmp instanceof JobProvider || cmp instanceof Script.BonusProvider) {
                    cmp.activate(true);
                }
            }
            if (this.nodeToRemove)
                this.nodeToRemove.getParent().removeChild(this.nodeToRemove);
            if (this.nodeToEnable)
                this.nodeToEnable.activate(true);
            this.node.removeComponent(this);
            setTimeout(() => { Script.EumlingCreator.updateButton(); }, 1);
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
            ["settings", new SettingsController()],
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
    Script.enableUI = enableUI;
    class CameraController {
        constructor() {
            this.canvas = document.querySelector("canvas");
            this.camera = Script.findFirstComponentInGraph(Script.viewport.getBranch(), ƒ.ComponentCamera);
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
            this.click = (_event) => {
                let picks = this.findAllPickedObjectsUsingPickSphere({ x: _event.clientX, y: _event.clientY });
                if (!picks.length)
                    return;
                selectedEumling = picks[0];
                enableUI("job");
            };
        }
        enable() {
            this.canvas.addEventListener("click", this.click);
        }
        disable() {
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
            this.wrapElement = document.getElementById("job-menu").parentElement;
            this.wrapper = document.getElementById("job-wrapper");
            this.close = (_e) => {
                if (_e.newState === "closed") {
                    enableUI("close");
                }
            };
            this.disable = () => {
                this.wrapElement.classList.add("hidden");
                selectedEumling.getComponent(Script.JobTaker).paused = false;
            };
        }
        enable() {
            this.wrapElement.classList.remove("hidden");
            selectedEumling.getComponent(Script.JobTaker).paused = true;
            selectedEumling.dispatchEvent(new CustomEvent("select"));
            let buttons = [];
            let keys = Script.availableJobs.values();
            for (let job of keys) {
                const info = Script.jobTypeInfo.get(job);
                if (!info)
                    continue;
                const btn = Script.createElementAdvanced("button", {
                    innerHTML: `
                    <span class="job-name">${info.name}</span>
                    <img src="${info.img}" class="job-image" />
                    <span class="job-description">${info.description}</span>
                    `,
                    classes: ["no-button", "job-button"]
                });
                btn.addEventListener("click", () => {
                    selectedEumling.getComponent(Script.JobTaker).job = job;
                    enableUI("close");
                });
                buttons.push(btn);
            }
            this.wrapper.replaceChildren(...buttons);
        }
    }
    class SettingsController {
        constructor() {
            this.initiated = false;
            this.wrapElement = document.getElementById("settings-menu").parentElement;
            this.enable = () => {
                const wrapper = document.getElementById("settings-menu");
                if (!this.initiated) {
                    const innerHTML = Script.Settings.generateHTML();
                    wrapper.appendChild(innerHTML);
                    this.initiated = true;
                }
                this.wrapElement.classList.remove("hidden");
            };
            this.disable = () => {
                this.wrapElement.classList.add("hidden");
            };
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    function findFirstComponentInGraph(_graph, _cmp) {
        let foundCmp = _graph.getComponent(_cmp);
        if (foundCmp)
            return foundCmp;
        for (let child of _graph.getChildren()) {
            foundCmp = findFirstComponentInGraph(child, _cmp);
            if (foundCmp)
                return foundCmp;
        }
        return undefined;
    }
    Script.findFirstComponentInGraph = findFirstComponentInGraph;
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
    function vector2Distance(_a, _b) {
        return Math.sqrt(Math.pow(_a.x - _b.x, 2) +
            Math.pow(_a.y - _b.y, 2));
    }
    Script.vector2Distance = vector2Distance;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Settings {
        static { this.settings = []; }
        static proxySetting(_setting, onValueChange) {
            return new Proxy(_setting, {
                set(target, prop, newValue, receiver) {
                    if (prop === "value")
                        onValueChange(target[prop], newValue);
                    return Reflect.set(target, prop, newValue, receiver);
                },
            });
        }
        static addSettings(..._settings) {
            _settings.forEach(setting => this.settings.push(setting));
        }
        static generateHTML(_settings = this.settings) {
            const wrapper = Script.createElementAdvanced("div", { classes: ["settings-wrapper"], innerHTML: "<h2 class='h'><span>Einstellungen</span></h2>" });
            for (let setting of _settings) {
                wrapper.appendChild(this.generateSingleHTML(setting));
            }
            return wrapper;
        }
        static generateSingleHTML(_setting) {
            let element;
            switch (_setting.type) {
                case "string": {
                    element = this.generateStringInput(_setting);
                    break;
                }
                case "number": {
                    element = this.generateNumberInput(_setting);
                    break;
                }
                case "category": {
                    element = Script.createElementAdvanced("div", { classes: ["settings-category"], innerHTML: `<span class="settings-category-name">${_setting.name}</span>` });
                    for (let setting of _setting.settings) {
                        element.appendChild(this.generateSingleHTML(setting));
                    }
                    break;
                }
                default: {
                    element = Script.createElementAdvanced("div", { innerHTML: "Unknown Setting Type", classes: ["settings-unknown"] });
                }
            }
            return element;
        }
        static generateStringInput(_setting) {
            const id = Script.randomString(10);
            const element = Script.createElementAdvanced("label", { classes: ["settings-string-wrapper", "settings-label"], innerHTML: `<span class="settings-string-label settings-label-text">${_setting.name}</span>`, attributes: [["for", id]] });
            const input = Script.createElementAdvanced("input", { classes: ["settings-string-input", "settings-input"], attributes: [["type", "string"], ["value", _setting.value], ["name", id]], id });
            element.appendChild(input);
            input.addEventListener("change", () => {
                _setting.value = input.value;
            });
            return element;
        }
        static generateNumberInput(_setting) {
            const id = Script.randomString(10);
            const element = Script.createElementAdvanced("label", { classes: ["settings-number-wrapper", "settings-label", _setting.name.toLowerCase()], innerHTML: `<span class="settings-number-label settings-label-text">${_setting.name}</span>`, attributes: [["for", id]] });
            switch (_setting.variant) {
                case "percent": {
                    const buttonMinus = Script.createElementAdvanced("button", {
                        classes: ["settings-number-input-button", "minus", "settings-input"],
                        innerHTML: "-"
                    });
                    const input = Script.createElementAdvanced("input", {
                        classes: ["settings-number-input", "settings-input", "number-input"],
                        attributes: [["type", "number"], ["value", (_setting.value * 100).toString()], ["name", id], ["min", (_setting.min * 100).toString()], ["max", (_setting.max * 100).toString()], ["step", (_setting.step * 100).toString()]],
                        id
                    });
                    const buttonPlus = Script.createElementAdvanced("button", {
                        classes: ["settings-number-input-button", "plus", "settings-input"],
                        innerHTML: "+"
                    });
                    element.append(buttonMinus, input, buttonPlus);
                    input.addEventListener("change", () => {
                        let value = Math.min(_setting.max, Math.max(_setting.min, Number(input.value) / 100));
                        _setting.value = value;
                        input.value = Math.round(value * 100).toString();
                    });
                    buttonMinus.addEventListener("click", () => { input.stepDown(); input.dispatchEvent(new InputEvent("change")); });
                    buttonPlus.addEventListener("click", () => { input.stepUp(); input.dispatchEvent(new InputEvent("change")); });
                    break;
                }
                case "range": {
                    const input = Script.createElementAdvanced("input", {
                        classes: ["settings-number-input", "settings-input", "slider"],
                        attributes: [["type", "range"], ["value", _setting.value.toString()], ["name", id], ["min", _setting.min.toString()], ["max", _setting.max.toString()], ["step", _setting.step.toString()]],
                        id
                    });
                    input.addEventListener("input", () => {
                        _setting.value = Number(input.value);
                        const percent = _setting.value / (_setting.max - _setting.min) * 100;
                        input.style.setProperty("--percent", `${percent}%`);
                    });
                    break;
                }
            }
            return element;
        }
    }
    Script.Settings = Settings;
})(Script || (Script = {}));
/// <reference path="../Plugins/Utils.ts" />
/// <reference path="../Plugins/Settings.ts" />
var Script;
/// <reference path="../Plugins/Utils.ts" />
/// <reference path="../Plugins/Settings.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    let AUDIO_CHANNEL;
    (function (AUDIO_CHANNEL) {
        AUDIO_CHANNEL[AUDIO_CHANNEL["MASTER"] = 0] = "MASTER";
        AUDIO_CHANNEL[AUDIO_CHANNEL["SOUNDS"] = 1] = "SOUNDS";
        AUDIO_CHANNEL[AUDIO_CHANNEL["MUSIC"] = 2] = "MUSIC";
    })(AUDIO_CHANNEL = Script.AUDIO_CHANNEL || (Script.AUDIO_CHANNEL = {}));
    const enumToName = new Map([
        [AUDIO_CHANNEL.MASTER, "Gesamtlautstärke"],
        [AUDIO_CHANNEL.MUSIC, "Musik"],
        [AUDIO_CHANNEL.SOUNDS, "Sounds"],
    ]);
    class AudioManager {
        static { this.Instance = new AudioManager(); }
        constructor() {
            this.gainNodes = {};
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            if (AudioManager.Instance)
                return AudioManager.Instance;
            const settingCategory = { name: "Ton", settings: [], type: "category" };
            for (let channel of Script.enumToArray(AUDIO_CHANNEL)) {
                this.gainNodes[channel] = ƒ.AudioManager.default.createGain();
                if (channel === AUDIO_CHANNEL.MASTER) {
                    this.gainNodes[channel].connect(ƒ.AudioManager.default.gain);
                }
                else {
                    this.gainNodes[channel].connect(this.gainNodes[AUDIO_CHANNEL.MASTER]);
                }
                let setting = { type: "number", max: 1, min: 0, name: enumToName.get(channel), step: 0.2, value: 1, variant: "percent" };
                setting = Script.Settings.proxySetting(setting, (_old, _new) => { AudioManager.setChannelVolume(channel, _new); });
                settingCategory.settings.push(setting);
            }
            Script.Settings.addSettings(settingCategory);
        }
        static addAudioCmpToChannel(_cmpAudio, _channel) {
            _cmpAudio.setGainTarget(AudioManager.Instance.gainNodes[_channel]);
        }
        static setChannelVolume(_channel, _volume) {
            let channel = AudioManager.Instance.gainNodes[_channel];
            if (!channel)
                return;
            channel.gain.value = _volume;
        }
    }
    Script.AudioManager = AudioManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let ComponentAudioMixed = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = ƒ.ComponentAudio;
        let _instanceExtraInitializers = [];
        let _get_channel_decorators;
        var ComponentAudioMixed = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _get_channel_decorators = [ƒ.serialize(Script.AUDIO_CHANNEL)];
                __esDecorate(this, null, _get_channel_decorators, { kind: "getter", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ComponentAudioMixed = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = ƒ.Component.registerSubclass(ComponentAudioMixed); }
            #channel = (__runInitializers(this, _instanceExtraInitializers), Script.AUDIO_CHANNEL.MASTER);
            constructor(_audio, _loop, _start, _audioManager = ƒ.AudioManager.default, _channel = Script.AUDIO_CHANNEL.MASTER) {
                super(_audio, _loop, _start, _audioManager);
                this.gainTarget = _audioManager.gain;
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                this.channel = _channel;
            }
            get channel() {
                return this.#channel;
            }
            set channel(_channel) {
                this.#channel = _channel;
                Script.AudioManager.addAudioCmpToChannel(this, this.#channel);
            }
            setGainTarget(node) {
                if (this.isConnected) {
                    this.gain.disconnect(this.gainTarget);
                }
                this.gainTarget = node;
                if (this.isConnected) {
                    this.gain.connect(this.gainTarget);
                }
            }
            connect(_on) {
                if (_on)
                    this.gain.connect(this.gainTarget ?? this.audioManager.gain);
                else
                    this.gain.disconnect(this.gainTarget ?? this.audioManager.gain);
                this.isConnected = _on;
            }
            fadeTo(_volume, _duration) {
                // (<GainNode>this.gain).gain.linearRampToValueAtTime(_volume, ƒ.AudioManager.default.currentTime + _duration);
                this.gain.gain.setValueCurveAtTime([this.volume, _volume], ƒ.AudioManager.default.currentTime, _duration);
            }
            drawGizmos() {
                if (this.isPlaying)
                    super.drawGizmos();
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return ComponentAudioMixed = _classThis;
    })();
    Script.ComponentAudioMixed = ComponentAudioMixed;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class MusicController {
        #intensities;
        constructor() {
            this.#intensities = new Map([
                [0, new Script.ComponentAudioMixed(new ƒ.Audio("Assets/Audio/Music/Intensity_01.mp3"), true, false, undefined, Script.AUDIO_CHANNEL.MUSIC)],
                [2, new Script.ComponentAudioMixed(new ƒ.Audio("Assets/Audio/Music/Intensity_02.mp3"), true, false, undefined, Script.AUDIO_CHANNEL.MUSIC)],
                [4, new Script.ComponentAudioMixed(new ƒ.Audio("Assets/Audio/Music/Intensity_03.mp3"), true, false, undefined, Script.AUDIO_CHANNEL.MUSIC)],
            ]);
            this.#prevEumlings = -1;
            this.#currentNode = undefined;
            this.checkEumlings = () => {
                if (Script.EumlingCreator.eumlingAmount === this.#prevEumlings)
                    return;
                let newNode;
                for (let i = this.#prevEumlings + 1; i <= Script.EumlingCreator.eumlingAmount; i++) {
                    if (this.#intensities.has(i))
                        newNode = this.#intensities.get(i);
                }
                this.#prevEumlings = Script.EumlingCreator.eumlingAmount;
                if (!newNode)
                    return;
                if (this.#currentNode) {
                    let node = this.#currentNode;
                    setTimeout(() => {
                        node.play(false);
                    }, 2500);
                }
                newNode.fadeTo(1, 2.5);
                this.#currentNode = newNode;
            };
            for (let cmp of this.#intensities.values()) {
                cmp.connect(true);
                cmp.volume = 0;
                cmp.play(true);
            }
            setInterval(this.checkEumlings, 5000);
            this.checkEumlings();
        }
        #prevEumlings;
        #currentNode;
    }
    Script.MusicController = MusicController;
})(Script || (Script = {}));
/// <reference path="../Plugins/UpdateScriptComponent.ts" />
var Script;
/// <reference path="../Plugins/UpdateScriptComponent.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    const globalSoundEmitter = new EventTarget();
    let SoundEmitter = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = Script.UpdateScriptComponent;
        let _volume_decorators;
        let _volume_initializers = [];
        let _volume_extraInitializers = [];
        let _local_decorators;
        let _local_initializers = [];
        let _local_extraInitializers = [];
        let _addRandomness_decorators;
        let _addRandomness_initializers = [];
        let _addRandomness_extraInitializers = [];
        let _channel_decorators;
        let _channel_initializers = [];
        let _channel_extraInitializers = [];
        let _mtxPivot_decorators;
        let _mtxPivot_initializers = [];
        let _mtxPivot_extraInitializers = [];
        let _boxSize_decorators;
        let _boxSize_initializers = [];
        let _boxSize_extraInitializers = [];
        let _surfaceOfBoxOnly_decorators;
        let _surfaceOfBoxOnly_initializers = [];
        let _surfaceOfBoxOnly_extraInitializers = [];
        let _s0_decorators;
        let _s0_initializers = [];
        let _s0_extraInitializers = [];
        let _s1_decorators;
        let _s1_initializers = [];
        let _s1_extraInitializers = [];
        let _s2_decorators;
        let _s2_initializers = [];
        let _s2_extraInitializers = [];
        let _s3_decorators;
        let _s3_initializers = [];
        let _s3_extraInitializers = [];
        let _s4_decorators;
        let _s4_initializers = [];
        let _s4_extraInitializers = [];
        let _s5_decorators;
        let _s5_initializers = [];
        let _s5_extraInitializers = [];
        let _s6_decorators;
        let _s6_initializers = [];
        let _s6_extraInitializers = [];
        let _s7_decorators;
        let _s7_initializers = [];
        let _s7_extraInitializers = [];
        let _s8_decorators;
        let _s8_initializers = [];
        let _s8_extraInitializers = [];
        let _s9_decorators;
        let _s9_initializers = [];
        let _s9_extraInitializers = [];
        let _s10_decorators;
        let _s10_initializers = [];
        let _s10_extraInitializers = [];
        let _s11_decorators;
        let _s11_initializers = [];
        let _s11_extraInitializers = [];
        let _s12_decorators;
        let _s12_initializers = [];
        let _s12_extraInitializers = [];
        let _s13_decorators;
        let _s13_initializers = [];
        let _s13_extraInitializers = [];
        let _s14_decorators;
        let _s14_initializers = [];
        let _s14_extraInitializers = [];
        let _s15_decorators;
        let _s15_initializers = [];
        let _s15_extraInitializers = [];
        let _s16_decorators;
        let _s16_initializers = [];
        let _s16_extraInitializers = [];
        let _s17_decorators;
        let _s17_initializers = [];
        let _s17_extraInitializers = [];
        let _s18_decorators;
        let _s18_initializers = [];
        let _s18_extraInitializers = [];
        let _s19_decorators;
        let _s19_initializers = [];
        let _s19_extraInitializers = [];
        var SoundEmitter = class extends _classSuper {
            static { _classThis = this; }
            constructor() {
                super(...arguments);
                this.singleton = false;
                this.volume = __runInitializers(this, _volume_initializers, 1);
                this.local = (__runInitializers(this, _volume_extraInitializers), __runInitializers(this, _local_initializers, true));
                this.addRandomness = (__runInitializers(this, _local_extraInitializers), __runInitializers(this, _addRandomness_initializers, true)); //TODO: turn this from boolean to number for variance, aka +/- this value
                this.channel = (__runInitializers(this, _addRandomness_extraInitializers), __runInitializers(this, _channel_initializers, Script.AUDIO_CHANNEL.MASTER));
                this.mtxPivot = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _mtxPivot_initializers, new ƒ.Matrix4x4()));
                this.boxSize = (__runInitializers(this, _mtxPivot_extraInitializers), __runInitializers(this, _boxSize_initializers, new ƒ.Vector3()));
                this.surfaceOfBoxOnly = (__runInitializers(this, _boxSize_extraInitializers), __runInitializers(this, _surfaceOfBoxOnly_initializers, false));
                // lots of different audios because we can't do arrays in the editor yet.
                this.s0 = (__runInitializers(this, _surfaceOfBoxOnly_extraInitializers), __runInitializers(this, _s0_initializers, void 0));
                this.s1 = (__runInitializers(this, _s0_extraInitializers), __runInitializers(this, _s1_initializers, void 0));
                this.s2 = (__runInitializers(this, _s1_extraInitializers), __runInitializers(this, _s2_initializers, void 0));
                this.s3 = (__runInitializers(this, _s2_extraInitializers), __runInitializers(this, _s3_initializers, void 0));
                this.s4 = (__runInitializers(this, _s3_extraInitializers), __runInitializers(this, _s4_initializers, void 0));
                this.s5 = (__runInitializers(this, _s4_extraInitializers), __runInitializers(this, _s5_initializers, void 0));
                this.s6 = (__runInitializers(this, _s5_extraInitializers), __runInitializers(this, _s6_initializers, void 0));
                this.s7 = (__runInitializers(this, _s6_extraInitializers), __runInitializers(this, _s7_initializers, void 0));
                this.s8 = (__runInitializers(this, _s7_extraInitializers), __runInitializers(this, _s8_initializers, void 0));
                this.s9 = (__runInitializers(this, _s8_extraInitializers), __runInitializers(this, _s9_initializers, void 0));
                this.s10 = (__runInitializers(this, _s9_extraInitializers), __runInitializers(this, _s10_initializers, void 0));
                this.s11 = (__runInitializers(this, _s10_extraInitializers), __runInitializers(this, _s11_initializers, void 0));
                this.s12 = (__runInitializers(this, _s11_extraInitializers), __runInitializers(this, _s12_initializers, void 0));
                this.s13 = (__runInitializers(this, _s12_extraInitializers), __runInitializers(this, _s13_initializers, void 0));
                this.s14 = (__runInitializers(this, _s13_extraInitializers), __runInitializers(this, _s14_initializers, void 0));
                this.s15 = (__runInitializers(this, _s14_extraInitializers), __runInitializers(this, _s15_initializers, void 0));
                this.s16 = (__runInitializers(this, _s15_extraInitializers), __runInitializers(this, _s16_initializers, void 0));
                this.s17 = (__runInitializers(this, _s16_extraInitializers), __runInitializers(this, _s17_initializers, void 0));
                this.s18 = (__runInitializers(this, _s17_extraInitializers), __runInitializers(this, _s18_initializers, void 0));
                this.s19 = (__runInitializers(this, _s18_extraInitializers), __runInitializers(this, _s19_initializers, void 0));
                this.#audioCmp = __runInitializers(this, _s19_extraInitializers);
                this.#audios = [];
                this.playRandomSound = () => {
                    if (!this.active)
                        return;
                    let audio = Script.randomArrayElement(this.#audios);
                    if (!audio)
                        return;
                    this.#audioCmp.setAudio(audio);
                    if (this.addRandomness)
                        this.#audioCmp.playbackRate = Script.randomRange(0.75, 1.25);
                    this.#audioCmp.mtxPivot.copy(this.mtxPivot);
                    this.#audioCmp.mtxPivot.translate(this.getTranslation());
                    this.#audioCmp.play(true);
                };
            }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _volume_decorators = [ƒ.serialize(Number)];
                _local_decorators = [ƒ.serialize(Boolean)];
                _addRandomness_decorators = [ƒ.serialize(Boolean)];
                _channel_decorators = [ƒ.serialize(Script.AUDIO_CHANNEL)];
                _mtxPivot_decorators = [ƒ.serialize(ƒ.Matrix4x4)];
                _boxSize_decorators = [ƒ.serialize(ƒ.Vector3)];
                _surfaceOfBoxOnly_decorators = [ƒ.serialize(Boolean)];
                _s0_decorators = [ƒ.serialize(ƒ.Audio)];
                _s1_decorators = [ƒ.serialize(ƒ.Audio)];
                _s2_decorators = [ƒ.serialize(ƒ.Audio)];
                _s3_decorators = [ƒ.serialize(ƒ.Audio)];
                _s4_decorators = [ƒ.serialize(ƒ.Audio)];
                _s5_decorators = [ƒ.serialize(ƒ.Audio)];
                _s6_decorators = [ƒ.serialize(ƒ.Audio)];
                _s7_decorators = [ƒ.serialize(ƒ.Audio)];
                _s8_decorators = [ƒ.serialize(ƒ.Audio)];
                _s9_decorators = [ƒ.serialize(ƒ.Audio)];
                _s10_decorators = [ƒ.serialize(ƒ.Audio)];
                _s11_decorators = [ƒ.serialize(ƒ.Audio)];
                _s12_decorators = [ƒ.serialize(ƒ.Audio)];
                _s13_decorators = [ƒ.serialize(ƒ.Audio)];
                _s14_decorators = [ƒ.serialize(ƒ.Audio)];
                _s15_decorators = [ƒ.serialize(ƒ.Audio)];
                _s16_decorators = [ƒ.serialize(ƒ.Audio)];
                _s17_decorators = [ƒ.serialize(ƒ.Audio)];
                _s18_decorators = [ƒ.serialize(ƒ.Audio)];
                _s19_decorators = [ƒ.serialize(ƒ.Audio)];
                __esDecorate(null, null, _volume_decorators, { kind: "field", name: "volume", static: false, private: false, access: { has: obj => "volume" in obj, get: obj => obj.volume, set: (obj, value) => { obj.volume = value; } }, metadata: _metadata }, _volume_initializers, _volume_extraInitializers);
                __esDecorate(null, null, _local_decorators, { kind: "field", name: "local", static: false, private: false, access: { has: obj => "local" in obj, get: obj => obj.local, set: (obj, value) => { obj.local = value; } }, metadata: _metadata }, _local_initializers, _local_extraInitializers);
                __esDecorate(null, null, _addRandomness_decorators, { kind: "field", name: "addRandomness", static: false, private: false, access: { has: obj => "addRandomness" in obj, get: obj => obj.addRandomness, set: (obj, value) => { obj.addRandomness = value; } }, metadata: _metadata }, _addRandomness_initializers, _addRandomness_extraInitializers);
                __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel, set: (obj, value) => { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
                __esDecorate(null, null, _mtxPivot_decorators, { kind: "field", name: "mtxPivot", static: false, private: false, access: { has: obj => "mtxPivot" in obj, get: obj => obj.mtxPivot, set: (obj, value) => { obj.mtxPivot = value; } }, metadata: _metadata }, _mtxPivot_initializers, _mtxPivot_extraInitializers);
                __esDecorate(null, null, _boxSize_decorators, { kind: "field", name: "boxSize", static: false, private: false, access: { has: obj => "boxSize" in obj, get: obj => obj.boxSize, set: (obj, value) => { obj.boxSize = value; } }, metadata: _metadata }, _boxSize_initializers, _boxSize_extraInitializers);
                __esDecorate(null, null, _surfaceOfBoxOnly_decorators, { kind: "field", name: "surfaceOfBoxOnly", static: false, private: false, access: { has: obj => "surfaceOfBoxOnly" in obj, get: obj => obj.surfaceOfBoxOnly, set: (obj, value) => { obj.surfaceOfBoxOnly = value; } }, metadata: _metadata }, _surfaceOfBoxOnly_initializers, _surfaceOfBoxOnly_extraInitializers);
                __esDecorate(null, null, _s0_decorators, { kind: "field", name: "s0", static: false, private: false, access: { has: obj => "s0" in obj, get: obj => obj.s0, set: (obj, value) => { obj.s0 = value; } }, metadata: _metadata }, _s0_initializers, _s0_extraInitializers);
                __esDecorate(null, null, _s1_decorators, { kind: "field", name: "s1", static: false, private: false, access: { has: obj => "s1" in obj, get: obj => obj.s1, set: (obj, value) => { obj.s1 = value; } }, metadata: _metadata }, _s1_initializers, _s1_extraInitializers);
                __esDecorate(null, null, _s2_decorators, { kind: "field", name: "s2", static: false, private: false, access: { has: obj => "s2" in obj, get: obj => obj.s2, set: (obj, value) => { obj.s2 = value; } }, metadata: _metadata }, _s2_initializers, _s2_extraInitializers);
                __esDecorate(null, null, _s3_decorators, { kind: "field", name: "s3", static: false, private: false, access: { has: obj => "s3" in obj, get: obj => obj.s3, set: (obj, value) => { obj.s3 = value; } }, metadata: _metadata }, _s3_initializers, _s3_extraInitializers);
                __esDecorate(null, null, _s4_decorators, { kind: "field", name: "s4", static: false, private: false, access: { has: obj => "s4" in obj, get: obj => obj.s4, set: (obj, value) => { obj.s4 = value; } }, metadata: _metadata }, _s4_initializers, _s4_extraInitializers);
                __esDecorate(null, null, _s5_decorators, { kind: "field", name: "s5", static: false, private: false, access: { has: obj => "s5" in obj, get: obj => obj.s5, set: (obj, value) => { obj.s5 = value; } }, metadata: _metadata }, _s5_initializers, _s5_extraInitializers);
                __esDecorate(null, null, _s6_decorators, { kind: "field", name: "s6", static: false, private: false, access: { has: obj => "s6" in obj, get: obj => obj.s6, set: (obj, value) => { obj.s6 = value; } }, metadata: _metadata }, _s6_initializers, _s6_extraInitializers);
                __esDecorate(null, null, _s7_decorators, { kind: "field", name: "s7", static: false, private: false, access: { has: obj => "s7" in obj, get: obj => obj.s7, set: (obj, value) => { obj.s7 = value; } }, metadata: _metadata }, _s7_initializers, _s7_extraInitializers);
                __esDecorate(null, null, _s8_decorators, { kind: "field", name: "s8", static: false, private: false, access: { has: obj => "s8" in obj, get: obj => obj.s8, set: (obj, value) => { obj.s8 = value; } }, metadata: _metadata }, _s8_initializers, _s8_extraInitializers);
                __esDecorate(null, null, _s9_decorators, { kind: "field", name: "s9", static: false, private: false, access: { has: obj => "s9" in obj, get: obj => obj.s9, set: (obj, value) => { obj.s9 = value; } }, metadata: _metadata }, _s9_initializers, _s9_extraInitializers);
                __esDecorate(null, null, _s10_decorators, { kind: "field", name: "s10", static: false, private: false, access: { has: obj => "s10" in obj, get: obj => obj.s10, set: (obj, value) => { obj.s10 = value; } }, metadata: _metadata }, _s10_initializers, _s10_extraInitializers);
                __esDecorate(null, null, _s11_decorators, { kind: "field", name: "s11", static: false, private: false, access: { has: obj => "s11" in obj, get: obj => obj.s11, set: (obj, value) => { obj.s11 = value; } }, metadata: _metadata }, _s11_initializers, _s11_extraInitializers);
                __esDecorate(null, null, _s12_decorators, { kind: "field", name: "s12", static: false, private: false, access: { has: obj => "s12" in obj, get: obj => obj.s12, set: (obj, value) => { obj.s12 = value; } }, metadata: _metadata }, _s12_initializers, _s12_extraInitializers);
                __esDecorate(null, null, _s13_decorators, { kind: "field", name: "s13", static: false, private: false, access: { has: obj => "s13" in obj, get: obj => obj.s13, set: (obj, value) => { obj.s13 = value; } }, metadata: _metadata }, _s13_initializers, _s13_extraInitializers);
                __esDecorate(null, null, _s14_decorators, { kind: "field", name: "s14", static: false, private: false, access: { has: obj => "s14" in obj, get: obj => obj.s14, set: (obj, value) => { obj.s14 = value; } }, metadata: _metadata }, _s14_initializers, _s14_extraInitializers);
                __esDecorate(null, null, _s15_decorators, { kind: "field", name: "s15", static: false, private: false, access: { has: obj => "s15" in obj, get: obj => obj.s15, set: (obj, value) => { obj.s15 = value; } }, metadata: _metadata }, _s15_initializers, _s15_extraInitializers);
                __esDecorate(null, null, _s16_decorators, { kind: "field", name: "s16", static: false, private: false, access: { has: obj => "s16" in obj, get: obj => obj.s16, set: (obj, value) => { obj.s16 = value; } }, metadata: _metadata }, _s16_initializers, _s16_extraInitializers);
                __esDecorate(null, null, _s17_decorators, { kind: "field", name: "s17", static: false, private: false, access: { has: obj => "s17" in obj, get: obj => obj.s17, set: (obj, value) => { obj.s17 = value; } }, metadata: _metadata }, _s17_initializers, _s17_extraInitializers);
                __esDecorate(null, null, _s18_decorators, { kind: "field", name: "s18", static: false, private: false, access: { has: obj => "s18" in obj, get: obj => obj.s18, set: (obj, value) => { obj.s18 = value; } }, metadata: _metadata }, _s18_initializers, _s18_extraInitializers);
                __esDecorate(null, null, _s19_decorators, { kind: "field", name: "s19", static: false, private: false, access: { has: obj => "s19" in obj, get: obj => obj.s19, set: (obj, value) => { obj.s19 = value; } }, metadata: _metadata }, _s19_initializers, _s19_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                SoundEmitter = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = ƒ.Component.registerSubclass(SoundEmitter); }
            #audioCmp;
            #audios;
            start(_e) {
                this.#audioCmp = new Script.ComponentAudioMixed(undefined, false, false, undefined, this.channel);
                if (this.local) {
                    this.node.addComponent(this.#audioCmp);
                }
                else {
                    this.#audioCmp.connect(true);
                }
                this.#audioCmp.volume = this.volume;
                if (this.s0)
                    this.#audios.push(this.s0);
                if (this.s1)
                    this.#audios.push(this.s1);
                if (this.s2)
                    this.#audios.push(this.s2);
                if (this.s3)
                    this.#audios.push(this.s3);
                if (this.s4)
                    this.#audios.push(this.s4);
                if (this.s5)
                    this.#audios.push(this.s5);
                if (this.s6)
                    this.#audios.push(this.s6);
                if (this.s7)
                    this.#audios.push(this.s7);
                if (this.s8)
                    this.#audios.push(this.s8);
                if (this.s9)
                    this.#audios.push(this.s9);
                if (this.s10)
                    this.#audios.push(this.s0);
                if (this.s11)
                    this.#audios.push(this.s1);
                if (this.s12)
                    this.#audios.push(this.s2);
                if (this.s13)
                    this.#audios.push(this.s3);
                if (this.s14)
                    this.#audios.push(this.s4);
                if (this.s15)
                    this.#audios.push(this.s5);
                if (this.s16)
                    this.#audios.push(this.s6);
                if (this.s17)
                    this.#audios.push(this.s7);
                if (this.s18)
                    this.#audios.push(this.s8);
                if (this.s19)
                    this.#audios.push(this.s9);
            }
            getTranslation() {
                const result = ƒ.Recycler.reuse(ƒ.Vector3);
                result.set(Script.randomRange(0, this.boxSize.x) - this.boxSize.x / 2, Script.randomRange(0, this.boxSize.y) - this.boxSize.y / 2, Script.randomRange(0, this.boxSize.z) - this.boxSize.z / 2);
                if (this.surfaceOfBoxOnly) {
                    const rand = Math.floor(Math.random() * 3);
                    if (rand === 0) {
                        result.x = Math.sign(result.x) * this.boxSize.x / 2;
                    }
                    else if (rand === 1) {
                        result.y = Math.sign(result.y) * this.boxSize.y / 2;
                    }
                    else if (rand === 2) {
                        result.z = Math.sign(result.z) * this.boxSize.z / 2;
                    }
                }
                ƒ.Recycler.store(result);
                return result;
            }
            drawGizmos(_cmpCamera) {
                ƒ.Gizmos.drawWireCube((new ƒ.Matrix4x4()).multiply(this.node.mtxWorld).multiply(this.mtxPivot).scale(this.boxSize), ƒ.Color.CSS("blue"));
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return SoundEmitter = _classThis;
    })();
    Script.SoundEmitter = SoundEmitter;
    let SoundEmitterInterval = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = SoundEmitter;
        let _minWaitTimeMS_decorators;
        let _minWaitTimeMS_initializers = [];
        let _minWaitTimeMS_extraInitializers = [];
        let _maxWaitTimeMS_decorators;
        let _maxWaitTimeMS_initializers = [];
        let _maxWaitTimeMS_extraInitializers = [];
        var SoundEmitterInterval = class extends _classSuper {
            static { _classThis = this; }
            constructor() {
                super(...arguments);
                this.minWaitTimeMS = __runInitializers(this, _minWaitTimeMS_initializers, void 0);
                this.maxWaitTimeMS = (__runInitializers(this, _minWaitTimeMS_extraInitializers), __runInitializers(this, _maxWaitTimeMS_initializers, void 0));
                this.startTimer = (__runInitializers(this, _maxWaitTimeMS_extraInitializers), () => {
                    const delay = Script.randomRange(this.minWaitTimeMS, this.maxWaitTimeMS);
                    ƒ.Time.game.setTimer(delay, 1, this.startTimer);
                    ƒ.Time.game.setTimer(delay, 1, this.playRandomSound);
                });
            }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _minWaitTimeMS_decorators = [ƒ.serialize(Number)];
                _maxWaitTimeMS_decorators = [ƒ.serialize(Number)];
                __esDecorate(null, null, _minWaitTimeMS_decorators, { kind: "field", name: "minWaitTimeMS", static: false, private: false, access: { has: obj => "minWaitTimeMS" in obj, get: obj => obj.minWaitTimeMS, set: (obj, value) => { obj.minWaitTimeMS = value; } }, metadata: _metadata }, _minWaitTimeMS_initializers, _minWaitTimeMS_extraInitializers);
                __esDecorate(null, null, _maxWaitTimeMS_decorators, { kind: "field", name: "maxWaitTimeMS", static: false, private: false, access: { has: obj => "maxWaitTimeMS" in obj, get: obj => obj.maxWaitTimeMS, set: (obj, value) => { obj.maxWaitTimeMS = value; } }, metadata: _metadata }, _maxWaitTimeMS_initializers, _maxWaitTimeMS_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                SoundEmitterInterval = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = ƒ.Component.registerSubclass(SoundEmitterInterval); }
            start(_e) {
                super.start(_e);
                this.startTimer();
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return SoundEmitterInterval = _classThis;
    })();
    Script.SoundEmitterInterval = SoundEmitterInterval;
    let SoundEmitterOnEvent = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = SoundEmitter;
        let _event_decorators;
        let _event_initializers = [];
        let _event_extraInitializers = [];
        var SoundEmitterOnEvent = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _event_decorators = [ƒ.serialize(String)];
                __esDecorate(null, null, _event_decorators, { kind: "field", name: "event", static: false, private: false, access: { has: obj => "event" in obj, get: obj => obj.event, set: (obj, value) => { obj.event = value; } }, metadata: _metadata }, _event_initializers, _event_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                SoundEmitterOnEvent = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = ƒ.Component.registerSubclass(SoundEmitterOnEvent); }
            start(_e) {
                super.start(_e);
                globalSoundEmitter.addEventListener(this.event, this.playRandomSound);
                this.addEventListener(this.event, this.playRandomSound);
                this.node.addEventListener(this.event, this.playRandomSound);
            }
            constructor() {
                super(...arguments);
                this.event = __runInitializers(this, _event_initializers, void 0);
                __runInitializers(this, _event_extraInitializers);
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return SoundEmitterOnEvent = _classThis;
    })();
    Script.SoundEmitterOnEvent = SoundEmitterOnEvent;
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
        let _description_decorators;
        let _description_initializers = [];
        let _description_extraInitializers = [];
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
                _description_decorators = [ƒ.serialize(String)];
                _costFood_decorators = [ƒ.serialize(Number)];
                _costStone_decorators = [ƒ.serialize(Number)];
                _includeInMenu_decorators = [ƒ.serialize(Boolean)];
                __esDecorate(null, null, _graph_decorators, { kind: "field", name: "graph", static: false, private: false, access: { has: obj => "graph" in obj, get: obj => obj.graph, set: (obj, value) => { obj.graph = value; } }, metadata: _metadata }, _graph_initializers, _graph_extraInitializers);
                __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
                __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
                __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
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
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, ""));
                this.costFood = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _costFood_initializers, 5));
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
        NonJobAnimations["SELECTED"] = "selected";
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
        let _animSelected_decorators;
        let _animSelected_initializers = [];
        let _animSelected_extraInitializers = [];
        var JobAnimation = class extends _classSuper {
            static { _classThis = this; }
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
                this.animSelected = (__runInitializers(this, _animBuild_extraInitializers), __runInitializers(this, _animSelected_initializers, void 0));
                this.forwardEvent = (__runInitializers(this, _animSelected_extraInitializers), (_e) => {
                    switch (_e.type) {
                        case "leftStep":
                        case "rightStep": {
                            this.node.dispatchEvent(new Event("step"));
                            break;
                        }
                        case "searchBerry":
                        case "hitStone": {
                            this.node.dispatchEvent(_e);
                        }
                    }
                });
            }
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
                _animSelected_decorators = [ƒ.serialize(ƒ.Animation)];
                __esDecorate(null, null, _modelBase_decorators, { kind: "field", name: "modelBase", static: false, private: false, access: { has: obj => "modelBase" in obj, get: obj => obj.modelBase, set: (obj, value) => { obj.modelBase = value; } }, metadata: _metadata }, _modelBase_initializers, _modelBase_extraInitializers);
                __esDecorate(null, null, _modelMine_decorators, { kind: "field", name: "modelMine", static: false, private: false, access: { has: obj => "modelMine" in obj, get: obj => obj.modelMine, set: (obj, value) => { obj.modelMine = value; } }, metadata: _metadata }, _modelMine_initializers, _modelMine_extraInitializers);
                __esDecorate(null, null, _modelBuild_decorators, { kind: "field", name: "modelBuild", static: false, private: false, access: { has: obj => "modelBuild" in obj, get: obj => obj.modelBuild, set: (obj, value) => { obj.modelBuild = value; } }, metadata: _metadata }, _modelBuild_initializers, _modelBuild_extraInitializers);
                __esDecorate(null, null, _modelFood_decorators, { kind: "field", name: "modelFood", static: false, private: false, access: { has: obj => "modelFood" in obj, get: obj => obj.modelFood, set: (obj, value) => { obj.modelFood = value; } }, metadata: _metadata }, _modelFood_initializers, _modelFood_extraInitializers);
                __esDecorate(null, null, _animIdle_decorators, { kind: "field", name: "animIdle", static: false, private: false, access: { has: obj => "animIdle" in obj, get: obj => obj.animIdle, set: (obj, value) => { obj.animIdle = value; } }, metadata: _metadata }, _animIdle_initializers, _animIdle_extraInitializers);
                __esDecorate(null, null, _animWalk_decorators, { kind: "field", name: "animWalk", static: false, private: false, access: { has: obj => "animWalk" in obj, get: obj => obj.animWalk, set: (obj, value) => { obj.animWalk = value; } }, metadata: _metadata }, _animWalk_initializers, _animWalk_extraInitializers);
                __esDecorate(null, null, _animGatherFood_decorators, { kind: "field", name: "animGatherFood", static: false, private: false, access: { has: obj => "animGatherFood" in obj, get: obj => obj.animGatherFood, set: (obj, value) => { obj.animGatherFood = value; } }, metadata: _metadata }, _animGatherFood_initializers, _animGatherFood_extraInitializers);
                __esDecorate(null, null, _animGatherStone_decorators, { kind: "field", name: "animGatherStone", static: false, private: false, access: { has: obj => "animGatherStone" in obj, get: obj => obj.animGatherStone, set: (obj, value) => { obj.animGatherStone = value; } }, metadata: _metadata }, _animGatherStone_initializers, _animGatherStone_extraInitializers);
                __esDecorate(null, null, _animBuild_decorators, { kind: "field", name: "animBuild", static: false, private: false, access: { has: obj => "animBuild" in obj, get: obj => obj.animBuild, set: (obj, value) => { obj.animBuild = value; } }, metadata: _metadata }, _animBuild_initializers, _animBuild_extraInitializers);
                __esDecorate(null, null, _animSelected_decorators, { kind: "field", name: "animSelected", static: false, private: false, access: { has: obj => "animSelected" in obj, get: obj => obj.animSelected, set: (obj, value) => { obj.animSelected = value; } }, metadata: _metadata }, _animSelected_initializers, _animSelected_extraInitializers);
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
                this.#animations.set(NonJobAnimations.SELECTED, this.animSelected);
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
                this.animWalk.setEvent("leftStep", 0);
                this.animWalk.setEvent("rightStep", this.animWalk.totalTime / 2);
                this.animGatherFood.setEvent("searchBerry", 0);
                this.animGatherStone.setEvent("hitStone", 900);
                this.addEvents();
            }
            addEvents() {
                this.#animator.addEventListener("leftStep", this.forwardEvent);
                this.#animator.addEventListener("rightStep", this.forwardEvent);
                this.#animator.addEventListener("searchBerry", this.forwardEvent);
                this.#animator.addEventListener("hitStone", this.forwardEvent);
            }
            removeEvents() {
                this.#animator.removeEventListener("leftStep", this.forwardEvent);
                this.#animator.removeEventListener("rightStep", this.forwardEvent);
                this.#animator.removeEventListener("searchBerry", this.forwardEvent);
                this.#animator.removeEventListener("hitStone", this.forwardEvent);
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
                if (this.#animator)
                    this.removeEvents();
                this.#animator = modelToPlace.getComponent(ƒ.ComponentAnimation);
                this.#animator.playmode = ƒ.ANIMATION_PLAYMODE.LOOP;
                this.#animator.activate(true);
                this.addEvents();
            }
        };
        return JobAnimation = _classThis;
    })();
    Script.JobAnimation = JobAnimation;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let MoveTo = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = Script.UpdateScriptComponent;
        let _speed_decorators;
        let _speed_initializers = [];
        let _speed_extraInitializers = [];
        var MoveTo = class extends _classSuper {
            static { _classThis = this; }
            constructor() {
                super(...arguments);
                this.speed = __runInitializers(this, _speed_initializers, 1);
                this.#currentPosGrid = (__runInitializers(this, _speed_extraInitializers), new ƒ.Vector2());
                this.#path = [];
                this.#timer = 1000;
                this.#prevDistance = Infinity;
                this.#gizmoColor = new ƒ.Color(Math.random(), Math.random(), Math.random(), 1);
            }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _speed_decorators = [ƒ.serialize(Number)];
                __esDecorate(null, null, _speed_decorators, { kind: "field", name: "speed", static: false, private: false, access: { has: obj => "speed" in obj, get: obj => obj.speed, set: (obj, value) => { obj.speed = value; } }, metadata: _metadata }, _speed_initializers, _speed_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                MoveTo = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = ƒ.Component.registerSubclass(MoveTo); }
            #currentPosGrid;
            #path;
            #nextTargetWorld;
            #nextTargetGrid;
            start(_e) {
                Script.grid.worldPosToTilePos(new ƒ.Vector2(this.node.mtxLocal.translation.x, this.node.mtxLocal.translation.z), this.#currentPosGrid);
            }
            #timer;
            update(_e) {
                this.#timer -= ƒ.Loop.timeFrameGame;
                if (this.#timer > 0)
                    return;
                if (this.moveToTarget(ƒ.Loop.timeFrameGame)) {
                    // need new target
                    this.setTarget(new ƒ.Vector2(Math.floor(Script.randomRange(0, Script.grid.size.x)), Math.floor(Script.randomRange(0, Script.grid.size.y))), false);
                }
            }
            setPath(_path) {
                this.#path = _path;
                this.setNextTarget();
            }
            setTarget(_pos, inWorldCoordinates = true) {
                if (inWorldCoordinates)
                    _pos = Script.grid.worldPosToTilePos(_pos);
                let path = Script.grid.getPath(this.#currentPosGrid, _pos);
                this.setPath(path);
                return path;
            }
            setNextTarget() {
                if (this.#nextTargetGrid) {
                    this.#currentPosGrid.copy(this.#nextTargetGrid);
                }
                let next = this.#path.shift();
                if (!next) {
                    if (this.#nextTargetWorld)
                        ƒ.Recycler.store(this.#nextTargetWorld);
                    this.#nextTargetWorld = undefined;
                    if (this.#nextTargetGrid)
                        ƒ.Recycler.store(this.#nextTargetGrid);
                    this.#nextTargetGrid = undefined;
                    return;
                }
                if (!this.#nextTargetWorld) {
                    this.#nextTargetWorld = ƒ.Recycler.reuse(ƒ.Vector3);
                }
                if (!this.#nextTargetGrid) {
                    this.#nextTargetGrid = ƒ.Recycler.reuse(ƒ.Vector2);
                }
                this.#nextTargetGrid.copy(next);
                Script.grid.tilePosToWorldPos(next, next);
                this.#nextTargetWorld.set(next.x + 0.5, 0, next.y + 0.5);
                this.#prevDistance = Infinity;
                try {
                    this.node.mtxLocal.lookAt(this.#nextTargetWorld);
                }
                catch (error) {
                    console.error(error);
                }
            }
            #prevDistance;
            moveToTarget(deltaTime) {
                if (!this.#nextTargetWorld)
                    return true;
                let distance = this.node.mtxWorld.translation.getDistance(this.#nextTargetWorld);
                if (distance > this.#prevDistance) {
                    // we probably walked past the target
                    let currentTarget = this.#nextTargetWorld;
                    this.setNextTarget();
                    if (!this.#nextTargetWorld) {
                        this.node.mtxLocal.translate(ƒ.Vector3.DIFFERENCE(currentTarget, this.node.mtxWorld.translation));
                        return true;
                    }
                    return false;
                }
                this.#prevDistance = distance;
                // move to target
                deltaTime = Math.min(50, Math.max(0, deltaTime));
                this.node.mtxLocal.translateZ(deltaTime / 1000 * this.speed);
                return false;
            }
            #gizmoColor;
            drawGizmos(_cmpCamera) {
                if (!this.#nextTargetWorld)
                    return;
                const corners = [this.node.mtxWorld.translation, this.#nextTargetWorld];
                let prev = this.#nextTargetWorld;
                let pos = new ƒ.Vector2();
                for (let point of this.#path) {
                    Script.grid.tilePosToWorldPos(point, pos);
                    const currentPos = ƒ.Recycler.reuse(ƒ.Vector3).set(pos.x + 0.5, 0.0, pos.y + 0.5);
                    if (prev) {
                        corners.push(prev, currentPos);
                    }
                    prev = currentPos;
                    // let mtx = ƒ.Matrix4x4.IDENTITY();
                    // mtx.translateX(currentPos.x + 0.5);
                    // mtx.translateZ(currentPos.z + 0.5);
                    // mtx.scale(ƒ.Vector3.ONE(0.2));
                    // ƒ.Gizmos.drawSphere(mtx, ƒ.Color.CSS("red"));
                }
                ƒ.Gizmos.drawLines(corners, ƒ.Matrix4x4.IDENTITY(), this.#gizmoColor);
                // ƒ.Recycler.storeMultiple(... new Set(corners).values().toArray());
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return MoveTo = _classThis;
    })();
    Script.MoveTo = MoveTo;
})(Script || (Script = {}));
/// <reference path="MoveTo.ts" />
var Script;
/// <reference path="MoveTo.ts" />
(function (Script) {
    var ƒ = FudgeCore;
    let JobTaker = (() => {
        var _a;
        let _classDecorators = [(_a = ƒ).serialize.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = Script.MoveTo;
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
            }
            static { this.iSubclass = ƒ.Component.registerSubclass(JobTaker); }
            #job;
            #currentJob;
            #progress;
            #executableJobs;
            #target;
            #animator;
            #timers;
            #paused;
            #defaultGatherAmount;
            constructor() {
                super();
                this.#job = Script.JobType.NONE;
                this.#currentJob = Script.JobType.NONE;
                this.#progress = 0;
                this.#timers = [];
                this.speed = __runInitializers(this, _speed_initializers, 1);
                this.#paused = (__runInitializers(this, _speed_extraInitializers), false);
                this.#defaultGatherAmount = 2;
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
                                // lookat target
                                this.node.mtxLocal.lookAt(this.#target.node.mtxLocal.translation);
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
                                Script.Data.food += Math.max(1, Script.BonusProvider.getBonus(Script.BonusData.FOOD, this.#defaultGatherAmount));
                            }
                            else if (this.#job === Script.JobType.GATHER_STONE) {
                                Script.Data.stone += Math.max(1, Script.BonusProvider.getBonus(Script.BonusData.STONE, this.#defaultGatherAmount));
                            }
                            this.#progress = 0;
                            this.node.dispatchEvent(new CustomEvent("depositedResources"));
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
                        }
                        else {
                            this.idle(deltaTime);
                        }
                    }
                    switch (this.#progress) {
                        case 10: {
                            let reachedTarget = this.moveToTarget(deltaTime);
                            if (reachedTarget) {
                                this.#animator.playAnimation(this.#job);
                                this.#progress = 11;
                                this.#target.jobStart();
                                let timer = new ƒ.Timer(ƒ.Time.game, this.#target.jobDuration, 1, () => {
                                    this.#progress = 12;
                                    this.#target.jobFinish();
                                });
                                this.#timers.push(timer);
                                // lookat target
                                this.node.mtxLocal.lookAt(this.#target.node.mtxLocal.translation);
                            }
                            break;
                        }
                        case 11: {
                            // building
                            break;
                        }
                        case 12: {
                            // done building
                            this.node.dispatchEvent(new CustomEvent("buildEnd"));
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
                            let pos = new ƒ.Vector2(this.node.mtxWorld.translation.x, this.node.mtxWorld.translation.z);
                            Script.grid.worldPosToTilePos(pos, pos);
                            for (let i = 0; i < 10; i++) {
                                const newPos = new ƒ.Vector2(Math.max(0, Math.min(Script.grid.size.x, Math.floor(Math.sign(Script.randomRange(-1, 1)) * Script.randomRange(3, 5) + pos.x))), Math.max(0, Math.min(Script.grid.size.y, Math.floor(Math.sign(Script.randomRange(-1, 1)) * Script.randomRange(3, 5) + pos.y))));
                                let path = this.setTarget(newPos, false);
                                if (path.length > 0)
                                    break;
                            }
                            // const node = new ƒ.Node("walk_target");
                            // const jp = new JobProviderNone();
                            // node.addComponent(jp);
                            // node.addComponent(new ƒ.ComponentTransform);
                            // this.node.getParent().addChild(node);
                            // node.mtxLocal.translateX(Math.max(-20, Math.min(20, Math.sign(randomRange(-1, 1)) * randomRange(3, 5) + this.node.mtxWorld.translation.x)));
                            // node.mtxLocal.translateZ(Math.max(-20, Math.min(20, Math.sign(randomRange(-1, 1)) * randomRange(3, 5) + this.node.mtxWorld.translation.z)));
                            // this.#target = jp;
                            // this.node.mtxLocal.lookAt(node.mtxLocal.translation);
                            // this.#needToRemoveTarget = true;
                            this.#progress = 3;
                            break;
                        }
                        case 3: {
                            const reached = this.moveToTarget(deltaTime);
                            if (reached) {
                                this.#progress = 0;
                            }
                        }
                    }
                };
                this.pause = () => {
                    this.#animator.playAnimation(Script.NonJobAnimations.SELECTED);
                    const direction = ƒ.Recycler.get(ƒ.Vector3).set(-1, 0, -1).normalize();
                    this.node.mtxLocal.lookIn(direction);
                    ƒ.Recycler.store(direction);
                };
                this.unpause = () => {
                    if (this.#target && this.#target.node)
                        this.node.mtxLocal.lookAt(this.#target.node.mtxWorld.translation);
                };
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                this.#executableJobs = new Map([
                    [Script.JobType.NONE, this.idle],
                    [Script.JobType.BUILD, this.build],
                    [Script.JobType.GATHER_FOOD, this.gatherResource],
                    [Script.JobType.GATHER_STONE, this.gatherResource],
                ]);
            }
            set job(_job) {
                if (this.#job === _job)
                    return;
                this.#job = _job;
                this.#animator.setModel(this.#job);
                this.#animator.playAnimation(Script.JobType.NONE);
                this.#progress = 0;
                this.#timers.forEach(t => t.clear());
                this.#timers.length = 0;
                this.paused = false;
                this.node.dispatchEvent(new CustomEvent("switchJob"));
            }
            set paused(_paused) {
                this.#paused = _paused;
                if (_paused) {
                    this.pause();
                }
                else {
                    this.unpause();
                }
            }
            static findClosestJobProviderWithPath(_job, _location) {
                const foundProviders = [];
                // console.log(_job, JobProvider.JobProviders);
                for (let provider of Script.JobProvider.JobProviders) {
                    if (provider.jobType === _job && !provider.targeted) {
                        foundProviders.push(provider);
                    }
                }
                if (!foundProviders.length)
                    return undefined;
                foundProviders.sort((a, b) => a.node.mtxWorld.translation.getDistance(_location) - b.node.mtxWorld.translation.getDistance(_location));
                for (let provider of foundProviders) {
                    let path = this.findPathToJobProvider(provider, _location);
                    if (path)
                        return { job: provider, path };
                }
                // TODO mark this job taker as blocked so they don't lag the main thread trying over and over again.
                return undefined;
            }
            static findPathToJobProvider(_job, _startLocation) {
                // get grid position(s) of job location
                let worldPos = new ƒ.Vector2(_job.node.mtxWorld.translation.x, _job.node.mtxWorld.translation.z);
                let tilePos = Script.grid.worldPosToTilePos(worldPos);
                let startPos = Script.grid.worldPosToTilePos(new ƒ.Vector2(_startLocation.x, _startLocation.z));
                // find all surrounding, non-blocked blocks
                const positionsToCheck = [tilePos];
                const checkedPositions = new Set();
                const candidates = [];
                while (positionsToCheck.length > 0) {
                    let currentPos = positionsToCheck.pop();
                    checkedPositions.add(currentPos.toString());
                    for (let x = -1; x <= 1; x++) {
                        for (let y = -1; y <= 1; y++) {
                            if (x !== 0 && y !== 0)
                                continue; // discard diagonals
                            let newPos = new ƒ.Vector2(currentPos.x + x, currentPos.y + y);
                            if (checkedPositions.has(newPos.toString()))
                                continue;
                            let tile = Script.grid.getTile(newPos, false);
                            if (tile === null)
                                continue;
                            if (tile === undefined) {
                                candidates.push(newPos);
                                continue;
                            }
                            if (tile.node === _job.node) {
                                positionsToCheck.push(newPos);
                            }
                        }
                    }
                }
                if (!candidates.length)
                    return undefined;
                // sort candidates by distance
                candidates.sort((a, b) => Script.vector2Distance(a, startPos) - Script.vector2Distance(b, startPos));
                // check which one I can find a path to
                for (let candidate of candidates) {
                    let path = Script.grid.getPath(startPos, candidate);
                    if (path && path.length)
                        return path;
                }
                return undefined;
            }
            start(_e) {
                super.start(_e);
                this.#animator = this.node.getComponent(Script.JobAnimation);
            }
            update(_e) {
                if (this.#paused)
                    return;
                this.#executableJobs.get(this.#job)?.(ƒ.Loop.timeFrameGame);
            }
            moveAwayNow() {
                if (this.#job !== Script.JobType.NONE && this.#job !== Script.JobType.BUILD) {
                    return;
                }
                this.#progress = 2;
                this.#timers.forEach(t => t.clear());
                this.#timers.length = 0;
            }
            // #prevDistance: number = Infinity;
            moveToTarget(deltaTime) {
                this.#animator.playAnimation(Script.NonJobAnimations.WALK);
                return super.moveToTarget(deltaTime);
                //     let distance = this.node.mtxWorld.translation.getDistance(this.#target.node.mtxWorld.translation);
                //     if (distance < this.#target.node.getComponent(BuildData)?.interactionRadius) {
                //         // target reached
                //         this.#prevDistance = Infinity;
                //         return true;
                //     }
                //     else if (distance > this.#prevDistance) {
                //         // algorithm failed
                //         this.node.mtxLocal.translate(this.node.mtxWorld.getTranslationTo(this.#target.node.mtxWorld));
                //         this.#prevDistance = Infinity;
                //         return true;
                //     }
                //     this.#prevDistance = distance;
                //     // move to target
                //     // this.node.mtxLocal.lookAt(this.#target.node.mtxWorld.translation);
                //     deltaTime = Math.min(1000, deltaTime); // limit delta time to 1 second max to prevent lag causing super big jumps
                //     this.node.mtxLocal.translateZ(deltaTime / 1000 * this.speed);
                //     return false;
            }
            findAndSetTargetForJob(_job) {
                const target = JobTaker.findClosestJobProviderWithPath(_job, this.node.mtxWorld.translation);
                if (!target) {
                    return undefined;
                }
                target.job.target(true);
                this.#target = target.job;
                this.#currentJob = _job;
                this.node.mtxLocal.lookAt(target.job.node.mtxWorld.translation);
                this.setPath(target.path);
                return target.job;
            }
            drawGizmos(_cmpCamera) {
                super.drawGizmos(_cmpCamera);
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
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
//# sourceMappingURL=Script.js.map