namespace Script {
    import ƒ = FudgeCore;
    export class Data {
        static #stone: number = 0;
        static #food: number = 0;
        static eumlingLimit: number = 0;
        static gatherBonusFood: number = 1;
        static gatherBonusStone: number = 1;

        static set food(_food: number) {
            this.#food = _food;
            document.getElementById("resource-food").innerText = this.#food.toString();
            this.updateBuildButtons();
        }
        static set stone(_stone: number) {
            this.#stone = _stone;
            document.getElementById("resource-stone").innerText = this.#stone.toString();
            this.updateBuildButtons();
        }
        static get food() {
            return this.#food;
        }
        static get stone() {
            return this.#stone;
        }

        static canAffordBuilding(building: Build): boolean {
            return building.costFood <= this.#food && building.costStone <= this.#stone;
        }

        static buyBuilding(building: Build): boolean {
            if(!this.canAffordBuilding(building)) return false;
            this.food -= building.costFood;
            this.stone -= building.costStone;
            return true;
        }

        private static updateBuildButtons() {
            const elements: NodeListOf<HTMLButtonElement> = document.getElementById("build-menu-buildings").childNodes as NodeListOf<HTMLButtonElement>;
            for(let element of elements) {
                if(element.dataset.costFood && element.dataset.costStone){
                    if(Number(element.dataset.costFood) > this.#food || Number(element.dataset.costStone) > this.#stone) {
                        element.disabled = true;
                    } else {
                        element.disabled = false;
                    }
                }
            }
        }
    }
}