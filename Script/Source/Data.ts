/// <reference path="Buildings/BonusProvider.ts" />

namespace Script {
    import ƒ = FudgeCore;
    export class Data {
        static #stone: number = 0;
        static #food: number = 0;

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

        static canAffordBuilding(building: Build): boolean {
            return building.costFood <= this.#food && building.costStone <= this.#stone;
        }

        static buyBuilding(building: Build): boolean {
            if (!this.canAffordBuilding(building)) return false;
            this.food -= building.costFood;
            this.stone -= building.costStone;
            return true;
        }

        private static updateCostButtons() {
            const elements: NodeListOf<HTMLButtonElement> = document.querySelectorAll("button.build") as NodeListOf<HTMLButtonElement>;
            for (let element of elements) {
                let enabled: boolean = true;
                for(let set in element.dataset) {
                    if(set === "costFood") {
                        if(Number(element.dataset.costFood) > this.#food){
                            enabled = false;
                        }
                    } else if (set === "costStone") {
                        if(Number(element.dataset.costStone) > this.#stone){
                            enabled = false;
                        }
                    } else if (set === "eumlingLimit") {
                        if(Number(element.dataset.eumlingLimit) > this.eumlingLimit){
                            enabled = false;
                        }
                    }
                }
                element.disabled = !enabled;
            }
        }
    }
}