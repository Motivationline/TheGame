/// <reference path="Grid/Controller.ts" />


namespace Script {
    import ƒ = FudgeCore;

    export interface ToggleableUI {
        enable: () => void;
        disable: () => void;
    }


    ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, <EventListener><unknown>start);

    function start() {
        if(ƒ.Project.mode === ƒ.MODE.EDITOR) return;

        const uis = new Map<string, ToggleableUI>([
            ["build", new GridBuilder()],
            ["move", new MoveController()],
        ])
        let activeUI: ToggleableUI = uis.get("move");
        activeUI.enable();

        document.querySelectorAll("button[data-target]").forEach((btn) => {
            btn.addEventListener("click", () => {
                let nextUI = uis.get((<HTMLElement>btn).dataset.target);
                if (!nextUI) return;
                if (activeUI) activeUI.disable();
                nextUI.enable();
                activeUI = nextUI;
            })
        });

    }

    class MoveController implements ToggleableUI {
        wrapper: HTMLElement;
        constructor() {
            this.wrapper = document.getElementById("move-menu");
        }

        disable() {
            this.wrapper.classList.add("hidden");
        };

        enable() {
            this.wrapper.classList.remove("hidden");
        };
    }
}

