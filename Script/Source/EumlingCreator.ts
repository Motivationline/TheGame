namespace Script {
    import ƒ = FudgeCore;
    export class EumlingCreator {
        static eumlingPrices: { stone: number, food: number }[] = [
            { food: 0, stone: 0 },
            { food: 10, stone: 0 },
            { food: 20, stone: 5 },
            { food: 40, stone: 10 },
        ]
        static eumlingAmount: number = 0;
        static createEumling = async () => {
            let current = this.eumlingPrices[this.eumlingAmount];
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
            let current = this.eumlingPrices[this.eumlingAmount];
            if (!current) {
                btn.classList.add("hidden");
                return;
            }
            btn.dataset.costFood = current.food.toString();
            btn.dataset.costStone = current.stone.toString();
            btn.dataset.eumlingLimit = (this.eumlingAmount + 1).toString();
            btn.innerHTML = `
            + Eumling (${this.eumlingAmount} / ${Data.eumlingLimit})
            <div class="build-cost">
                <span class="build-cost-food" >${current.food}</span>
                <span class="build-cost-stone">${current.stone}</span>
            </div>
            `

            document.getElementById("eumling-amt").innerText = this.eumlingAmount.toString();
            Data.food += 0;
        }
    }
    if (ƒ.Project.mode === ƒ.MODE.RUNTIME) {
        document.getElementById("eumling-btn").addEventListener("click", EumlingCreator.createEumling);
        EumlingCreator.updateButton();
    }
}
