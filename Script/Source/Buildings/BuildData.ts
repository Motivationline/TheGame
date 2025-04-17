namespace Script {
    import ƒ = FudgeCore;
    @ƒ.serialize
    export class BuildData extends UpdateScriptComponent {
        @ƒ.serialize(Number)
        interactionRadius: number = 1;
        @ƒ.serialize(ƒ.Graph)
        buildUpGraph: ƒ.Graph;
    }
}