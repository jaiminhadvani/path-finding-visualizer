import { inBounds, coordsKey } from './utils.js';

export default function bfs(grid, startCell, endCell, allowDiagonal = false) {
    const visitedOrder = [];
    const queue = [startCell];
    const visited = new Set([coordsKey(startCell.row, startCell.col)]);
    const parent = new Map();

    const directions = allowDiagonal
        ? [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]
        : [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (queue.length > 0) {
        const current = queue.shift();
        const currentKey = coordsKey(current.row, current.col);

        // Mark as visited
        visitedOrder.push({ cell: current, type: 'visit' });

        // Check if we reached the end
        if (current.row === endCell.row && current.col === endCell.col) {
            return {
                visitedOrder,
                path: reconstructPath(parent, startCell, endCell)
            };
        }

        // Explore neighbors
        for (const [dr, dc] of directions) {
            const newRow = current.row + dr;
            const newCol = current.col + dc;

            if (!inBounds(grid, newRow, newCol)) continue;

            const neighbor = grid[newRow][newCol];
            const neighborKey = coordsKey(newRow, newCol);

            if (visited.has(neighborKey) || neighbor.type === 'wall') continue;

            visited.add(neighborKey);
            parent.set(neighborKey, currentKey);
            queue.push(neighbor);

            // Mark as discovered (frontier)
            visitedOrder.push({ cell: neighbor, type: 'discover' });
        }
    }

    // No path found
    return { visitedOrder, path: [] };
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
