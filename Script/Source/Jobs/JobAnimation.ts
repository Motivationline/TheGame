/// <reference path="../Plugins/UpdateScriptComponent.ts" />


namespace Script {
    import ƒ = FudgeCore;

    export type AnimationType = JobType | NonJobAnimations;

    export enum NonJobAnimations {
        WALK = "walk",
    }

    @ƒ.serialize
    export class JobAnimation extends UpdateScriptComponent {
        #animations = new Map<AnimationType, ƒ.Animation>();
        #currentAnimation: AnimationType;
        #animator: ƒ.ComponentAnimation;

        @ƒ.serialize(ƒ.Animation)
        animIdle: ƒ.Animation;
        @ƒ.serialize(ƒ.Animation)
        animWalk: ƒ.Animation;
        @ƒ.serialize(ƒ.Animation)
        animGatherFood: ƒ.Animation;
        @ƒ.serialize(ƒ.Animation)
        animGatherStone: ƒ.Animation;
        @ƒ.serialize(ƒ.Animation)
        animBuild: ƒ.Animation;

        start(_e: CustomEvent<UpdateEvent>): void {
            this.#animations.set(NonJobAnimations.WALK, this.animWalk);
            this.#animations.set(JobType.NONE, this.animIdle);
            this.#animations.set(JobType.STORE_RESOURCE, this.animIdle);
            this.#animations.set(JobType.GATHER_FOOD, this.animGatherFood);
            this.#animations.set(JobType.GATHER_STONE, this.animGatherStone);
            this.#animations.set(JobType.BUILD, this.animBuild);

            this.#animator = this.node.getChild(0).getComponent(ƒ.ComponentAnimation);
        }


        playAnimation(anim: AnimationType) {
            if (anim === this.#currentAnimation) return;
            let animationToPlay = this.#animations.get(anim);
            if (!animationToPlay) return;
            this.#animator.animation = animationToPlay;
            this.#animator.jumpTo(0);
            this.#currentAnimation = anim;
        }
    }
}