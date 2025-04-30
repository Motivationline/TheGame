namespace Script {
    import ƒ = FudgeCore;

    export class Pathfinder {
        openList: Map<string, AStarNode>;
        closedList: Set<string>;
        target: ƒ.Vector2;
        constructor(private grid: Grid) {

        }
        public getPath(_from: ƒ.Vector2, _to: ƒ.Vector2): MovePath {
            if (grid.getTile(_to, false)) return [];
            // using A* algorithm
            this.openList = new Map<string, AStarNode>([[_to.toString(), { f: 0, node: _to, g: 0 }]]); // starting with _to so the result is already in the correct order
            this.closedList = new Set<string>();
            this.target = _from;

            let list: AStarNode[] = [];

            while (this.openList.size > 0) {
                list = this.openList.values().toArray().sort((a: AStarNode, b: AStarNode) => a.f - b.f);
                const currentNode = list.shift();
                this.openList.delete(currentNode.node.toString());
                if (currentNode.node.equals(this.target)) {
                    return this.nodesToArray(currentNode);
                }
                this.closedList.add(currentNode.node.toString());
                this.expandNode(currentNode);
            }

            return [];
        }
        private nodesToArray(_startNode: AStarNode): MovePath {
            const list: ƒ.Vector2[] = [];
            let node = _startNode;
            while (node) {
                list.push(node.node);
                node = node.previous;
            }
            return list;
        }

        private expandNode(_node: AStarNode) {
            let pos: ƒ.Vector2 = new ƒ.Vector2();
            for (let x: number = -1; x <= 1; x++) {
                for (let y: number = -1; y <= 1; y++) {
                    this.expandNodeNeighbor(pos.set(_node.node.x + x, _node.node.y + y), _node);
                }
            }
        }

        private expandNodeNeighbor(_pos: ƒ.Vector2, _currentNode: AStarNode) {
            // pos is already on closed list -> it's already done getting checked
            if (this.closedList.has(_pos.toString())) return;
            let tile = this.grid.getTile(_pos, false);
            // tile is outside of existing grid
            if (tile === null) return;
            // tile is blocked = unwalkable
            if (tile !== undefined)
                return;

            let g = _currentNode.g + vector2Distance(_pos, _currentNode.node);
            let existingNode = this.openList.get(_pos.toString());
            if (existingNode && g >= existingNode.g) return;
            if (!existingNode) existingNode = { node: _pos.clone, f: 0, g: 0 };
            existingNode.previous = _currentNode;
            existingNode.g = g;
            existingNode.f = g + vector2Distance(_pos, this.target);
            this.openList.set(existingNode.node.toString(), existingNode);
        }
    }

    interface AStarNode {
        node: ƒ.Vector2,
        previous?: AStarNode,
        f: number,
        g: number,
    }
}