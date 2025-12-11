import React from 'react';

export default function Legend() {
    const legendItems = [
        { className: 'cell-start', label: 'Start' },
        { className: 'cell-end', label: 'End' },
        { className: 'cell-wall', label: 'Wall' },
        { className: 'cell-path', label: 'Path' },
    ];

    return (
        <div className="legend">
            <h3>Legend</h3>
            {legendItems.map((item, index) => (
                <div key={index} className="legend-item">
                    <div className={`legend-color ${item.className}`}></div>
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
}
