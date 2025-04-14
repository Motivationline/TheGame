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
        }
        static set stone(_stone: number) {
            this.#stone = _stone;
            document.getElementById("resource-stone").innerText = this.#stone.toString();
        }
        static get food() {
            return this.#food;
        }
        static get stone() {
            return this.#stone;
        }
    }
}