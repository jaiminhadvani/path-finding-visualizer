import React, { useState } from 'react';
import Cell from './Cell';

export default function Grid({ grid, rows, cols, mode, setGrid, start, end, setStart, setEnd, isRunningRef }) {
    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleMouseDown = (row, col) => {
        if (isRunningRef.current) return;
        setIsMouseDown(true);
        handleCellInteraction(row, col);
    };

    const handleMouseEnter = (row, col) => {
        if (!isMouseDown || isRunningRef.current) return;
        handleCellInteraction(row, col);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const handleCellInteraction = (row, col) => {
        if (mode === 'draw') {
            setGrid(g => {
                const newGrid = g.map(r => r.map(c => ({ ...c })));
                if (newGrid[row][col].type !== 'start' && newGrid[row][col].type !== 'end') {
                    newGrid[row][col].type = 'wall';
                }
                return newGrid;
            });
        } else if (mode === 'erase') {
            setGrid(g => {
                const newGrid = g.map(r => r.map(c => ({ ...c })));
                if (newGrid[row][col].type === 'wall') {
                    newGrid[row][col].type = 'empty';
                }
                return newGrid;
            });
        } else if (mode === 'start') {
            setGrid(g => {
                const newGrid = g.map(r => r.map(c => ({ ...c })));
                newGrid[start.row][start.col].type = 'empty';
                newGrid[row][col].type = 'start';
                return newGrid;
            });
            setStart({ row, col });
        } else if (mode === 'end') {
            setGrid(g => {
                const newGrid = g.map(r => r.map(c => ({ ...c })));
                newGrid[end.row][end.col].type = 'empty';
                newGrid[row][col].type = 'end';
                return newGrid;
            });
            setEnd({ row, col });
        }
    };

    return (
        <div
            className="grid"
            style={{
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gridTemplateColumns: `repeat(${cols}, 1fr)`
            }}
            onMouseLeave={() => setIsMouseDown(false)}
        >
            {grid.map((row, rowIdx) =>
                row.map((cell, colIdx) => (
                    <Cell
                        key={`${rowIdx}-${colIdx}`}
                        cell={cell}
                        onMouseDown={handleMouseDown}
                        onMouseEnter={handleMouseEnter}
                        onMouseUp={handleMouseUp}
                    />
                ))
            )}
        </div>
    );
}
