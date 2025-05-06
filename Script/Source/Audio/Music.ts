namespace Script {
    import ƒ = FudgeCore;
    export class MusicController {
        #intensities = new Map<number, ComponentAudioMixed>([
            [0, new ComponentAudioMixed(new ƒ.Audio("Assets/Audio/Music/Intensity_01.mp3"), true, false, undefined, AUDIO_CHANNEL.MUSIC)],
            [2, new ComponentAudioMixed(new ƒ.Audio("Assets/Audio/Music/Intensity_02.mp3"), true, false, undefined, AUDIO_CHANNEL.MUSIC)],
            [4, new ComponentAudioMixed(new ƒ.Audio("Assets/Audio/Music/Intensity_03.mp3"), true, false, undefined, AUDIO_CHANNEL.MUSIC)],
        ]);
        constructor() {
            for (let cmp of this.#intensities.values()) {
                cmp.connect(true);
                cmp.volume = 0;
                cmp.play(true);
            }
            setInterval(this.checkEumlings, 5000);
            this.checkEumlings();
        }

        #prevEumlings = -1;
        #currentNode: ComponentAudioMixed = undefined;
        private checkEumlings = () => {
            if (EumlingCreator.eumlingAmount === this.#prevEumlings) return;
            let newNode: ComponentAudioMixed;
            for (let i: number = this.#prevEumlings + 1; i <= EumlingCreator.eumlingAmount; i++) {
                if (this.#intensities.has(i)) newNode = this.#intensities.get(i);
            }
            this.#prevEumlings = EumlingCreator.eumlingAmount;
            if (!newNode) return;
            if (this.#currentNode) {
                let node = this.#currentNode;
                setTimeout(() => {
                    node.play(false);
                }, 2500);
            }
            newNode.fadeTo(1, 2.5);
            this.#currentNode = newNode;
        }
    }
}