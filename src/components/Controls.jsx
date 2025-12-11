import React from 'react';

export default function Controls({
    algorithm,
    setAlgorithm,
    mode,
    setMode,
    speed,
    setSpeed,
    diagonal,
    setDiagonal,
    heuristic,
    setHeuristic,
    runAlgorithm,
    clearGrid,
    clearPath,
    resizeGrid,
    rows,
    cols,
    isRunning
}) {
    return (
        <div className="controls">
            <h3>Controls</h3>

            {/* Algorithm Section */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'hsl(210, 15%, 60%)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    Algorithm Settings
                </div>

                <div className="control-group">
                    <label>Algorithm:</label>
                    <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} disabled={isRunning}>
                        <option value="bfs">Breadth-First Search</option>
                        <option value="dijkstra">Dijkstra's Algorithm</option>
                        <option value="astar">A* Search</option>
                    </select>
                </div>

                {algorithm === 'astar' && (
                    <div className="control-group">
                        <label>Heuristic:</label>
                        <select value={heuristic} onChange={(e) => setHeuristic(e.target.value)} disabled={isRunning}>
                            <option value="manhattan">Manhattan Distance</option>
                            <option value="euclidean">Euclidean Distance</option>
                        </select>
                    </div>
                )}

                <div className="control-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={diagonal}
                            onChange={(e) => setDiagonal(e.target.checked)}
                            disabled={isRunning}
                        />
                        Allow Diagonal Movement
                    </label>
                </div>
            </div>

            {/* Drawing Section */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'hsl(210, 15%, 60%)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    Drawing Mode
                </div>

                <div className="control-group">
                    <label>Mode:</label>
                    <select value={mode} onChange={(e) => setMode(e.target.value)} disabled={isRunning}>
                        <option value="draw">Draw Walls</option>
                        <option value="erase">Erase Walls</option>
                        <option value="start">Set Start</option>
                        <option value="end">Set End</option>
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginBottom: '2rem' }}>
                <div className="control-group">
                    <button
                        onClick={() => {
                            console.log('Controls: Run button clicked', { isRunning });
                            runAlgorithm();
                        }}
                        disabled={isRunning}
                        className="btn-primary"
                    >
                        {isRunning ? 'Running...' : 'Run Algorithm'}
                    </button>
                </div>

                <div className="control-group" style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                    <button onClick={clearPath} disabled={isRunning} style={{ flex: 1 }}>Clear Path</button>
                    <button onClick={clearGrid} disabled={isRunning} style={{ flex: 1 }}>Clear Grid</button>
                </div>
            </div>

            {/* Grid Size Section */}
            <div>
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'hsl(210, 15%, 60%)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    Grid Size
                </div>

                <div className="control-group">
                    <label>Rows: {rows}</label>
                    <input
                        type="number"
                        min="5"
                        max="50"
                        value={rows}
                        onChange={(e) => resizeGrid(Number(e.target.value), cols)}
                        disabled={isRunning}
                    />
                </div>

                <div className="control-group">
                    <label>Columns: {cols}</label>
                    <input
                        type="number"
                        min="5"
                        max="100"
                        value={cols}
                        onChange={(e) => resizeGrid(rows, Number(e.target.value))}
                        disabled={isRunning}
                    />
                </div>
            </div>
        </div>
    );
}
