namespace Script {
    import ƒ = FudgeCore;
    export interface UpdateEvent {
        deltaTime: number,
    }

    export abstract class UpdateScriptComponent extends ƒ.Component {
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.addEventListener("preupdate", this.prestart, { once: true })
            this.addEventListener("update", this.start, { once: true })
            this.addEventListener("update", this.update)
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.remove);
            this.addEventListener(ƒ.EVENT.COMPONENT_DEACTIVATE, this.remove);
        }

        // runs updates of all updateable components
        public static updateAllInBranch(_branch: ƒ.Node) {
            let event = new CustomEvent<UpdateEvent>("update", {detail: {deltaTime: ƒ.Loop.timeFrameGame}});
            let preEvent = new CustomEvent<UpdateEvent>("preupdate", {detail: {deltaTime: ƒ.Loop.timeFrameGame}});
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

        prestart?(_e: CustomEvent<UpdateEvent>): void;
        start?(_e: CustomEvent<UpdateEvent>): void;
        update?(_e: CustomEvent<UpdateEvent>): void;
        remove?(_e: CustomEvent): void;

    }
}