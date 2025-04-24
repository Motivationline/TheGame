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
        @ƒ.serialize(String)
        description: string = "";
        @ƒ.serialize(Number)
        costFood: number = 5;
        @ƒ.serialize(Number)
        costStone: number = 5;
        @ƒ.serialize(Boolean)
        includeInMenu: boolean = false;


        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, ()=>{
                Building.all.push(this);
            })
        }

    }
}