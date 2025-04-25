namespace Script {
    import ƒ = FudgeCore;
    @ƒ.serialize
    export class MoveTo extends UpdateScriptComponent {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(MoveTo);
        @ƒ.serialize(Number)
        speed: number = 1;

        #currentPosGrid: ƒ.Vector2 = new ƒ.Vector2();
        #path: ƒ.Vector2[] = [];
        #nextTargetWorld: ƒ.Vector3;
        #nextTargetGrid: ƒ.Vector2;

        start(_e: CustomEvent<UpdateEvent>): void {
            grid.worldPosToTilePos(new ƒ.Vector2(this.node.mtxLocal.translation.x, this.node.mtxLocal.translation.z), this.#currentPosGrid);
        }

        #timer = 1000;
        update(_e: CustomEvent<UpdateEvent>): void {
            this.#timer -= _e.detail.deltaTime;
            if(this.#timer > 0) return;
            if (this.moveToTarget(_e.detail.deltaTime)) {
                // need new target
                this.setTarget(new ƒ.Vector2(
                    Math.floor(randomRange(0, grid.size.x)),
                    Math.floor(randomRange(0, grid.size.y))
                ), false);
            }
        }

        public setTarget(_pos: ƒ.Vector2, inWorldCoordinates: boolean = true) {
            if (inWorldCoordinates)
                _pos = grid.worldPosToTilePos(_pos);
            this.#path = grid.getPath(this.#currentPosGrid, _pos);
            this.setNextTarget();
        }

        private setNextTarget() {
            if (this.#nextTargetGrid) {
                this.#currentPosGrid.copy(this.#nextTargetGrid);
            }
            let next = this.#path.shift();
            if (!next) {
                if (this.#nextTargetWorld) ƒ.Recycler.store(this.#nextTargetWorld);
                this.#nextTargetWorld = undefined;
                if (this.#nextTargetGrid) ƒ.Recycler.store(this.#nextTargetGrid);
                this.#nextTargetGrid = undefined;
                return;
            }
            if (!this.#nextTargetWorld) {
                this.#nextTargetWorld = ƒ.Recycler.reuse(ƒ.Vector3);
            }
            if (!this.#nextTargetGrid) {
                this.#nextTargetGrid = ƒ.Recycler.reuse(ƒ.Vector2);
            }
            this.#nextTargetGrid.copy(next);
            grid.tilePosToWorldPos(next, next);
            this.#nextTargetWorld.set(next.x + 0.5, 0, next.y + 0.5);
            this.#prevDistance = Infinity;
            this.node.mtxLocal.lookAt(this.#nextTargetWorld);
        }

        #prevDistance: number = Infinity;
        protected moveToTarget(deltaTime: number): boolean {
            if (!this.#nextTargetWorld) return true;

            let distance = this.node.mtxWorld.translation.getDistance(this.#nextTargetWorld);
            if (distance > this.#prevDistance) {
                // we probably walked past the target
                let currentTarget = this.#nextTargetWorld;
                this.setNextTarget();
                if (!this.#nextTargetWorld){
                    this.node.mtxLocal.translate(ƒ.Vector3.DIFFERENCE(currentTarget, this.node.mtxWorld.translation));
                    return true;
                }
                return false;
            }
            this.#prevDistance = distance;

            // move to target
            deltaTime = Math.min(50, Math.max(0, deltaTime));
            this.node.mtxLocal.translateZ(deltaTime / 1000 * this.speed)
            return false;
        }

        #gizmoColor: ƒ.Color = new ƒ.Color(Math.random(), Math.random(), Math.random(), 1);
        drawGizmos(_cmpCamera?: ƒ.ComponentCamera): void {
            if(!this.#nextTargetWorld) return;
            const corners: ƒ.Vector3[] = [this.node.mtxWorld.translation, this.#nextTargetWorld];
            let prev: ƒ.Vector3 = this.#nextTargetWorld;
            let pos: ƒ.Vector2 = new ƒ.Vector2();
            for (let point of this.#path) {
                grid.tilePosToWorldPos(point, pos);
                const currentPos = ƒ.Recycler.reuse(ƒ.Vector3).set(pos.x + 0.5, 0.0, pos.y + 0.5);
                if (prev) {
                    corners.push(prev, currentPos);
                }
                prev = currentPos;

                // let mtx = ƒ.Matrix4x4.IDENTITY();
                // mtx.translateX(currentPos.x + 0.5);
                // mtx.translateZ(currentPos.z + 0.5);
                // mtx.scale(ƒ.Vector3.ONE(0.2));
                // ƒ.Gizmos.drawSphere(mtx, ƒ.Color.CSS("red"));
            }
            ƒ.Gizmos.drawLines(corners, ƒ.Matrix4x4.IDENTITY(), this.#gizmoColor);
            // ƒ.Recycler.storeMultiple(... new Set(corners).values().toArray());
        }
    }
}