import React from 'react';

export default function Cell({ cell, onMouseDown, onMouseEnter, onMouseUp }) {
    const getClassName = () => {
        const classes = ['cell'];
        if (cell.type) classes.push(`cell-${cell.type}`);
        return classes.join(' ');
    };

    return (
        <div
            className={getClassName()}
            onMouseDown={() => onMouseDown(cell.row, cell.col)}
            onMouseEnter={() => onMouseEnter(cell.row, cell.col)}
            onMouseUp={onMouseUp}
        />
    );
}
