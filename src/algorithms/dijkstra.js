import { inBounds, coordsKey, MinHeap } from './utils.js';

export default function dijkstra(grid, startCell, endCell, allowDiagonal = false) {
    const visitedOrder = [];
    const visited = new Set();
    const distances = new Map();
    const parent = new Map();

    const startKey = coordsKey(startCell.row, startCell.col);
    distances.set(startKey, 0);

    const heap = new MinHeap((a, b) => a.distance - b.distance);
    heap.push({ cell: startCell, distance: 0 });

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
        const { cell: current, distance: currentDist } = heap.pop();
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
                distance: currentDist
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

            const newDist = currentDist + cost;
            const oldDist = distances.get(neighborKey) ?? Infinity;

            if (newDist < oldDist) {
                distances.set(neighborKey, newDist);
                parent.set(neighborKey, currentKey);
                heap.push({ cell: neighbor, distance: newDist });

                // Mark as discovered (frontier)
                if (!visited.has(neighborKey)) {
                    visitedOrder.push({ cell: neighbor, type: 'discover' });
                }
            }
        }
    }

    // No path found
    return { visitedOrder, path: [], distance: Infinity };
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
