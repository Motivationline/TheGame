namespace Script {
    import ƒ = FudgeCore;

    export abstract class UpdateScriptComponent extends ƒ.ComponentScript {
        #runStart = true;
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.addEventListener(ƒ.EVENT.COMPONENT_ACTIVATE, this.addInternal);
            this.addEventListener(ƒ.EVENT.COMPONENT_DEACTIVATE, this.removeInternal);
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addInternal);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.removeInternal);
        }

        private addInternal = (_e: CustomEvent) => {
            this.#runStart = true;
            this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.updateInternal)
        }

        private removeInternal = (_e: CustomEvent) => {
            this.remove?.(_e);
            this.node.removeEventListener(ƒ.EVENT.RENDER_PREPARE, this.updateInternal);
        }

        private updateInternal = (_e: CustomEvent) => {
            if (this.#runStart) {
                this.start?.(_e);
                this.#runStart = false;
            }
            this.update?.(_e);
        }

        start?(_e: CustomEvent): void;
        update?(_e: CustomEvent): void;
        remove?(_e: CustomEvent): void;

    }
}