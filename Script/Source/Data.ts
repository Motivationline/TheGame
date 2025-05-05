/// <reference path="Buildings/BonusProvider.ts" />

namespace Script {
    import ƒ = FudgeCore;
    export class Data {
        static #stone: number = 0;
        static #food: number = 0;
        static #builtBuildings = new Map<Build, number>();
        static #buildingPriceMultiplier = 1.5;

        static set food(_food: number) {
            this.#food = _food;
            document.getElementById("resource-food").innerText = this.#food.toString();
            this.updateCostButtons();
        }
        static set stone(_stone: number) {
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

        static get eumlingLimit(): number {
            return BonusProvider.getBonus(BonusData.EUMLING_AMOUNT, 0);
        }

        static buildingCost(build: Build): BuildCost {
            if (!this.#builtBuildings.has(build)) {
                this.#builtBuildings.set(build, 0);
            }
            let currentAmount = this.#builtBuildings.get(build);
            return {
                food: Math.floor(build.costFood * Math.pow(this.#buildingPriceMultiplier, currentAmount)),
                stone: Math.floor(build.costStone * Math.pow(this.#buildingPriceMultiplier, currentAmount)),
            }
        }

        static canAffordBuilding(building: Build): boolean {
            const cost = this.buildingCost(building);
            return cost.food <= this.#food && cost.stone <= this.#stone;
        }

        static buyBuilding(building: Build): boolean {
            if (!this.canAffordBuilding(building)) return false;
            const cost = this.buildingCost(building);
            this.food -= cost.food;
            this.stone -= cost.stone;
            this.#builtBuildings.set(building, (this.#builtBuildings.get(building) ?? 0) + 1);
            return true;
        }

        private static updateCostButtons() {
            const elements: NodeListOf<HTMLButtonElement> = document.querySelectorAll("button.build") as NodeListOf<HTMLButtonElement>;
            for (let element of elements) {
                let enabled: boolean = true;
                for (let set in element.dataset) {
                    if (set === "costFood") {
                        if (Number(element.dataset.costFood) > this.#food) {
                            enabled = false;
                            element.querySelector(".build-cost-food")?.classList.add("cannot-afford");
                        } else {
                            element.querySelector(".build-cost-food")?.classList.remove("cannot-afford");
                        }
                    } else if (set === "costStone") {
                        if (Number(element.dataset.costStone) > this.#stone) {
                            enabled = false;
                            element.querySelector(".build-cost-stone")?.classList.add("cannot-afford");
                        } else {
                            element.querySelector(".build-cost-stone")?.classList.remove("cannot-afford");
                        }
                    } else if (set === "eumlingLimit") {
                        if (Number(element.dataset.eumlingLimit) > this.eumlingLimit) {
                            enabled = false;
                            element.querySelector(".build-cost-eumling")?.classList.add("cannot-afford");
                        } else {
                            element.querySelector(".build-cost-eumling")?.classList.remove("cannot-afford");
                        }
                    }
                }
                element.disabled = !enabled;
            }
        }
    }

    interface BuildCost {
        stone: number,
        food: number,
    }
}