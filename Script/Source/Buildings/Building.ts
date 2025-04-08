namespace Script {
    import ƒ = FudgeCore;
    @ƒ.serialize
    export class Building extends ƒ.Component implements Build {
        static all: Build[] = [];
        get isSingleton(): boolean {
            return false;
        }

        @ƒ.serialize(ƒ.Graph)
        graph: ƒ.Graph;
        @ƒ.serialize(Number)
        size: number = 1;
        @ƒ.serialize(String)
        name: string = "";


        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, ()=>{
                Building.all.push({ graph: this.graph, size: this.size, name: this.name });
            })
        }

    }
}