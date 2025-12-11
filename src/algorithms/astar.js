import { inBounds, coordsKey, MinHeap, manhattan, euclidean } from './utils.js';

export default function astar(grid, startCell, endCell, allowDiagonal = false, heuristicName = 'manhattan') {
    const visitedOrder = [];
    const visited = new Set();
    const gScore = new Map();
    const fScore = new Map();
    const parent = new Map();

    const heuristic = heuristicName === 'euclidean' ? euclidean : manhattan;

    const startKey = coordsKey(startCell.row, startCell.col);
    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic(startCell, endCell));

    const heap = new MinHeap((a, b) => a.fScore - b.fScore);
    heap.push({ cell: startCell, fScore: fScore.get(startKey) });

    const directions = allowDiagonal
        ? [
            { dr: -1, dc: 0, cost: 1 },
            { dr: 1, dc: 0, cost: 1 },
            { dr: 0, dc: -1, cost: 1 },
            { dr: 0, dc: 1, cost: 1 },
            { dr: -1, dc: -1, cost: Math.SQRT2 },
            { dr: -1, dc: 1, cost: Math.SQRT2 },
            { dr: 1, dc: -1, cost: Math.SQRT2 },
            { dr: 1, dc: 1, cost: Math.SQRT2 }
        ]
        : [
            { dr: -1, dc: 0, cost: 1 },
            { dr: 1, dc: 0, cost: 1 },
            { dr: 0, dc: -1, cost: 1 },
            { dr: 0, dc: 1, cost: 1 }
        ];

    while (!heap.isEmpty()) {
        const { cell: current } = heap.pop();
        const currentKey = coordsKey(current.row, current.col);

        if (visited.has(currentKey)) continue;
        visited.add(currentKey);

        // Mark as visited
        visitedOrder.push({ cell: current, type: 'visit' });

        // Check if we reached the end
        if (current.row === endCell.row && current.col === endCell.col) {
            return {
                visitedOrder,
                path: reconstructPath(parent, startCell, endCell),
                gScore: gScore.get(currentKey),
                fScore: fScore.get(currentKey)
            };
        }

        // Explore neighbors
        for (const { dr, dc, cost } of directions) {
            const newRow = current.row + dr;
            const newCol = current.col + dc;

            if (!inBounds(grid, newRow, newCol)) continue;

            const neighbor = grid[newRow][newCol];
            const neighborKey = coordsKey(newRow, newCol);

            if (visited.has(neighborKey) || neighbor.type === 'wall') continue;

            const tentativeGScore = gScore.get(currentKey) + cost;
            const oldGScore = gScore.get(neighborKey) ?? Infinity;

            if (tentativeGScore < oldGScore) {
                parent.set(neighborKey, currentKey);
                gScore.set(neighborKey, tentativeGScore);
                const h = heuristic(neighbor, endCell);
                const f = tentativeGScore + h;
                fScore.set(neighborKey, f);

                heap.push({ cell: neighbor, fScore: f });

                // Mark as discovered (frontier)
                if (!visited.has(neighborKey)) {
                    visitedOrder.push({ cell: neighbor, type: 'discover' });
                }
            }
        }
    }

    // No path found
    return { visitedOrder, path: [], gScore: Infinity, fScore: Infinity };
}

function reconstructPath(parent, startCell, endCell) {
    const path = [];
    let currentKey = coordsKey(endCell.row, endCell.col);
    const startKey = coordsKey(startCell.row, startCell.col);

    while (currentKey && currentKey !== startKey) {
        const { row, col } = parseKey(currentKey);
        path.unshift({ row, col });
        currentKey = parent.get(currentKey);
    }

    return path;
}

function parseKey(key) {
    const [row, col] = key.split(',').map(Number);
    return { row, col };
}
