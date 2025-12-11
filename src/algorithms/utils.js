// Grid utility functions
export function createEmptyGrid(rows, cols) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        const currentRow = [];
        for (let col = 0; col < cols; col++) {
            currentRow.push({
                row,
                col,
                type: 'empty', // empty, wall, start, end, visited, frontier, path
                distance: Infinity,
                gScore: Infinity,
                fScore: Infinity,
                parent: null
            });
        }
        grid.push(currentRow);
    }
    return grid;
}

export function cloneGrid(grid) {
    return grid.map(row => row.map(cell => ({ ...cell })));
}

export function inBounds(grid, row, col) {
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

export function coordsKey(row, col) {
    return `${row},${col}`;
}

export function parseKey(key) {
    const [row, col] = key.split(',').map(Number);
    return { row, col };
}

// Heuristic functions
export function manhattan(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function euclidean(a, b) {
    return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
}

// MinHeap implementation for priority queue
export class MinHeap {
    constructor(compareFn = (a, b) => a - b) {
        this.heap = [];
        this.compareFn = compareFn;
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    peek() {
        return this.heap[0];
    }

    push(value) {
        this.heap.push(value);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.isEmpty()) return null;
        if (this.size() === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compareFn(this.heap[index], this.heap[parentIndex]) >= 0) break;

            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length &&
                this.compareFn(this.heap[leftChild], this.heap[minIndex]) < 0) {
                minIndex = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.compareFn(this.heap[rightChild], this.heap[minIndex]) < 0) {
                minIndex = rightChild;
            }

            if (minIndex === index) break;

            [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
            index = minIndex;
        }
    }
}
