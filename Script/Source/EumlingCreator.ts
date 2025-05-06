namespace Script {
    import ƒ = FudgeCore;
    export class EumlingCreator {
        private static eumlingPriceMultiplier: number = 1.2;
        static eumlingPrices: { stone: number, food: number }[] = [
            { food: 0, stone: 0 },
            { food: 10, stone: 0 },
            { food: 20, stone: 5 },
            { food: 40, stone: 10 },
        ]
        static eumlingAmount: number = 0;
        static createEumling = async () => {
            let current = this.eumlingPrice(this.eumlingAmount);
            if (!current) return;
            // check if there is space for new eumling
            if (Data.eumlingLimit <= this.eumlingAmount) return;
            if (Data.food < current.food || Data.stone < current.stone) return;
            Data.food -= current.food;
            Data.stone -= current.stone;

            let graph = ƒ.Project.getResourcesByName("Eumling")[0] as ƒ.Graph;
            let node = await ƒ.Project.createGraphInstance(graph);
            viewport.getBranch().addChild(node);
            node.getComponent(JobTaker)?.moveAwayNow();

            this.eumlingAmount += 1;

            this.updateButton();
        }
        static updateButton() {
            let btn = document.getElementById("eumling-btn") as HTMLButtonElement;
            if (this.eumlingAmount > 0) btn.classList.remove("wiggle");
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
            document.getElementById("eumling-amt-max").innerText = Data.eumlingLimit.toString();
            Data.food += 0;
        }
        static eumlingPrice(_eumlingNumber: number): { stone: number, food: number } {
            let current = this.eumlingPrices[_eumlingNumber]
            if (current) return current;

            let last = this.eumlingPrices[this.eumlingPrices.length - 1];
            let multiplier = Math.pow(this.eumlingPriceMultiplier, _eumlingNumber + 1 - this.eumlingPrices.length);
            return {
                food: Math.floor(last.food * multiplier),
                stone: Math.floor(last.stone * multiplier),
            }
        }
    }

    if (ƒ.Project.mode === ƒ.MODE.RUNTIME) {
        document.getElementById("eumling-btn").addEventListener("click", EumlingCreator.createEumling);
        EumlingCreator.updateButton();
    }
}
