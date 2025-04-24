namespace Script {
    import ƒ = FudgeCore;

    export interface Build {
        graph: ƒ.Graph,
        size: number,
        name: string,
        description: string,
        costFood: number,
        costStone: number,
        includeInMenu: boolean,
    }

}