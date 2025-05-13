/// <reference path="../Plugins/UpdateScriptComponent.ts" />


namespace Script {
    import ƒ = FudgeCore;

    export type AnimationType = JobType | NonJobAnimations;

    export enum NonJobAnimations {
        WALK = "walk",
        SELECTED = "selected"
    }

    @ƒ.serialize
    export class JobAnimation extends UpdateScriptComponent {
        #animations = new Map<AnimationType, ƒ.Animation>();
        #models = new Map<JobType, ƒ.Node>();
        #currentAnimation: AnimationType;
        #animator: ƒ.ComponentAnimation;

        @ƒ.serialize(ƒ.Graph)
        modelBase: ƒ.Graph;
        @ƒ.serialize(ƒ.Graph)
        modelMine: ƒ.Graph;
        @ƒ.serialize(ƒ.Graph)
        modelBuild: ƒ.Graph;
        @ƒ.serialize(ƒ.Graph)
        modelFood: ƒ.Graph;

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
        @ƒ.serialize(ƒ.Animation)
        animSelected: ƒ.Animation;

        async start(_e: CustomEvent<UpdateEvent>): Promise<void> {
            this.#animations.set(NonJobAnimations.WALK, this.animWalk);
            this.#animations.set(NonJobAnimations.SELECTED, this.animSelected);
            this.#animations.set(JobType.NONE, this.animIdle);
            this.#animations.set(JobType.STORE_RESOURCE, this.animIdle);
            this.#animations.set(JobType.GATHER_FOOD, this.animGatherFood);
            this.#animations.set(JobType.GATHER_STONE, this.animGatherStone);
            this.#animations.set(JobType.BUILD, this.animBuild);

            if (this.modelBase) this.#models.set(JobType.NONE, await ƒ.Project.createGraphInstance(this.modelBase));
            if (this.modelBuild) this.#models.set(JobType.BUILD, await ƒ.Project.createGraphInstance(this.modelBuild));
            if (this.modelFood) this.#models.set(JobType.GATHER_FOOD, await ƒ.Project.createGraphInstance(this.modelFood));
            if (this.modelMine) this.#models.set(JobType.GATHER_STONE, await ƒ.Project.createGraphInstance(this.modelMine));

            this.setModel(JobType.NONE);
            this.playAnimation(JobType.NONE);

            this.animWalk.setEvent("leftStep", 0);
            this.animWalk.setEvent("rightStep", this.animWalk.totalTime / 2);

            this.animGatherFood.setEvent("searchBerry", 0);
            this.animGatherStone.setEvent("hitStone", 900);

            this.addEvents();
        }

        private forwardEvent = (_e: Event) => {
            switch (_e.type) {
                case "leftStep":
                case "rightStep": {
                    this.node.dispatchEvent(new Event("step"));
                    break;
                }
                case "searchBerry":
                case "hitStone": {
                    this.node.dispatchEvent(_e);
                }
            }
        }

        private addEvents() {
            this.#animator.addEventListener("leftStep", this.forwardEvent);
            this.#animator.addEventListener("rightStep", this.forwardEvent);
            this.#animator.addEventListener("searchBerry", this.forwardEvent);
            this.#animator.addEventListener("hitStone", this.forwardEvent);
        }

        private removeEvents() {
            this.#animator.removeEventListener("leftStep", this.forwardEvent);
            this.#animator.removeEventListener("rightStep", this.forwardEvent);
            this.#animator.removeEventListener("searchBerry", this.forwardEvent);
            this.#animator.removeEventListener("hitStone", this.forwardEvent);
        }

        playAnimation(anim: AnimationType) {
            if (!this.#animator) return;
            if (anim === this.#currentAnimation) return;
            let animationToPlay = this.#animations.get(anim);
            if (!animationToPlay) return;
            this.#animator.animation = animationToPlay;
            this.#animator.jumpTo(0);
            this.#currentAnimation = anim;
        }

        setModel(model: JobType) {
            let modelToPlace = this.#models.get(model);
            if (!modelToPlace) return;
            this.node.removeAllChildren();
            this.node.appendChild(modelToPlace);
            if (this.#animator)
                this.removeEvents();
            this.#animator = modelToPlace.getComponent(ƒ.ComponentAnimation);
            this.#animator.playmode = ƒ.ANIMATION_PLAYMODE.LOOP;
            this.#animator.activate(true);
            this.addEvents();
        }
    }
}