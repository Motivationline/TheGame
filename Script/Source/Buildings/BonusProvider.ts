/// <reference path="../Plugins/UpdateScriptComponent.ts" />

namespace Script {
    import ƒ = FudgeCore;

    export enum BonusType {
        ADD,
        MULTIPLY,
    }

    export enum BonusData {
        EUMLING_AMOUNT,
        STONE,
        FOOD,
    }

    @ƒ.serialize
    export class BonusProvider extends UpdateScriptComponent {
        @ƒ.serialize(BonusType)
        bonusType: BonusType = BonusType.ADD;
        @ƒ.serialize(BonusData)
        bonusData: BonusData;
        @ƒ.serialize(Number)
        amount: number = 1;

        static BonusProviders: Map<BonusData, Set<BonusProvider>> = new Map();

        start(_e: CustomEvent<UpdateEvent>): void {
            if (!BonusProvider.BonusProviders.has(this.bonusData))
                BonusProvider.BonusProviders.set(this.bonusData, new Set());
            BonusProvider.BonusProviders.get(this.bonusData)?.add(this);
        }
        remove(_e: CustomEvent): void {
            BonusProvider.BonusProviders.get(this.bonusData)?.delete(this);
        }

        static getBonus(data: BonusData, startAmount: number = 1): number {
            let set = BonusProvider.BonusProviders.get(data);
            if (!set) return startAmount;
            let arr = set.values().toArray().sort((a: BonusProvider, b: BonusProvider) => {
                if (a.bonusType === b.bonusType) return 0;
                if (a.bonusType === BonusType.ADD) return -1;
                if (b.bonusType === BonusType.ADD) return 1;
                return 0;
            });
            for (let el of arr) {
                if (el.bonusType === BonusType.ADD) {
                    startAmount += el.amount;
                } else if (el.bonusType === BonusType.MULTIPLY) {
                    startAmount *= el.amount;
                }
            }

            return startAmount;
        }
    }
}