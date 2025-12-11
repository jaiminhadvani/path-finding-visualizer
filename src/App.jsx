import React, { useState, useRef, useEffect } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import Legend from './components/Legend';
import { createEmptyGrid, cloneGrid } from './algorithms/utils';
import bfs from './algorithms/bfs';
import dijkstra from './algorithms/dijkstra';
import astar from './algorithms/astar';

const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 35;
const DEFAULT_SPEED_MS = 100;

export default function App() {
    const [rows, setRows] = useState(DEFAULT_ROWS);
    const [cols, setCols] = useState(DEFAULT_COLS);
    const [grid, setGrid] = useState(() => createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS));
    const [noPathMessage, setNoPathMessage] = useState('');
    const [pathLength, setPathLength] = useState(null);

    const [mode, setMode] = useState('draw');
    const [algorithm, setAlgorithm] = useState('bfs');
    const [speed, setSpeed] = useState(DEFAULT_SPEED_MS);
    const [diagonal, setDiagonal] = useState(false);
    const [heuristic, setHeuristic] = useState('manhattan');
    const [isRunning, setIsRunning] = useState(false);

    const [start, setStart] = useState({
        row: Math.floor(DEFAULT_ROWS / 2),
        col: Math.floor(DEFAULT_COLS / 4)
    });
    const [end, setEnd] = useState({
        row: Math.floor(DEFAULT_ROWS / 2),
        col: Math.floor((DEFAULT_COLS * 3) / 4)
    });

    const gridRef = useRef(grid);
    const isRunningRef = useRef(isRunning);
    const startRef = useRef(start);
    const endRef = useRef(end);

    useEffect(() => { gridRef.current = grid; }, [grid]);
    useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
    useEffect(() => { startRef.current = start; }, [start]);
    useEffect(() => { endRef.current = end; }, [end]);

    useEffect(() => {
        const g = createEmptyGrid(rows, cols);
        g[start.row][start.col].type = 'start';
        g[end.row][end.col].type = 'end';
        setGrid(g);
    }, []);

    function resetVisitedAndPath(g) {
        const ng = g.map(row => row.map(cell => {
            if (cell.type === 'visited' || cell.type === 'path' || cell.type === 'frontier') {
                return { ...cell, type: 'empty' };
            }
            return { ...cell };
        }));
        ng[start.row][start.col].type = 'start';
        ng[end.row][end.col].type = 'end';
        return ng;
    }

    function clearGrid() {
        if (isRunningRef.current) return;
        const g = createEmptyGrid(rows, cols);
        g[start.row][start.col].type = 'start';
        g[end.row][end.col].type = 'end';
        setGrid(g);
    }

    function clearPath() {
        if (isRunningRef.current) return;
        setGrid(g => resetVisitedAndPath(g));
    }

    function resizeGrid(newRows, newCols) {
        if (isRunningRef.current) return;
        const g = createEmptyGrid(newRows, newCols);
        const s = {
            row: Math.min(newRows - 1, start.row),
            col: Math.min(newCols - 1, start.col)
        };
        const e = {
            row: Math.min(newRows - 1, end.row),
            col: Math.min(newCols - 1, end.col)
        };
        g[s.row][s.col].type = 'start';
        g[e.row][e.col].type = 'end';
        setRows(newRows);
        setCols(newCols);
        setStart(s);
        setEnd(e);
        setGrid(g);
    }

    async function runAlgorithm() {
        console.log('runAlgorithm invoked', { algorithm, isRunning: isRunningRef.current });
        if (isRunningRef.current) return;
        setIsRunning(true);
        setNoPathMessage('');
        setPathLength(null);

        // Clear previous visualization
        const currentGrid = cloneGrid(gridRef.current);
        for (let r = 0; r < currentGrid.length; r++) {
            for (let c = 0; c < currentGrid[0].length; c++) {
                if (['visited', 'path', 'frontier'].includes(currentGrid[r][c].type)) {
                    currentGrid[r][c].type = 'empty';
                }
            }
        }
        currentGrid[startRef.current.row][startRef.current.col].type = 'start';
        currentGrid[endRef.current.row][endRef.current.col].type = 'end';
        setGrid(currentGrid);

        const startCell = currentGrid[startRef.current.row][startRef.current.col];
        const endCell = currentGrid[endRef.current.row][endRef.current.col];
        let result = { visitedOrder: [], path: [] };

        // Run selected algorithm
        try {
            if (algorithm === 'bfs') {
                result = bfs(currentGrid, startCell, endCell, diagonal);
            } else if (algorithm === 'dijkstra') {
                result = dijkstra(currentGrid, startCell, endCell, diagonal);
            } else if (algorithm === 'astar') {
                result = astar(currentGrid, startCell, endCell, diagonal, heuristic);
            }
        } catch (err) {
            console.error('Algorithm execution error', err);
            setIsRunning(false);
            return;
        }
        if (!result.path || result.path.length === 0) {
            setNoPathMessage('No path found from start to end.');
            setPathLength(null);
        } else {
            setPathLength(result.path.length);
        }

        console.log('Algorithm result summary', { visited: result.visitedOrder?.length ?? 0, path: result.path?.length ?? 0 });

        // Animate visited nodes
        for (let i = 0; i < result.visitedOrder.length; i++) {
            if (!isRunningRef.current) break;
            const ev = result.visitedOrder[i];
            const { cell, type } = ev;

            // Log some samples so we can see animation steps in console
            if (i < 10 || i % 200 === 0) {
                console.log('Animating visited/frontier', { index: i, row: cell.row, col: cell.col, type });
            }

            setGrid(g => {
                const ng = cloneGrid(g);
                const t = ng[cell.row][cell.col];
                if (t.type === 'start' || t.type === 'end') return ng;
                if (type === 'visit') t.type = 'visited';
                else if (type === 'discover') t.type = 'frontier';
                return ng;
            });
            await new Promise(res => setTimeout(res, speed));
        }

        // Animate path
        if (result.path && result.path.length > 0 && isRunningRef.current) {
            for (let i = 0; i < result.path.length; i++) {
                if (!isRunningRef.current) break;
                const p = result.path[i];
                if (i < 20 || i % 50 === 0) {
                    console.log('Animating path', { index: i, row: p.row, col: p.col });
                }
                setGrid(g => {
                    const ng = cloneGrid(g);
                    const t = ng[p.row][p.col];
                    if (t.type !== 'start' && t.type !== 'end') t.type = 'path';
                    return ng;
                });
                await new Promise(res => setTimeout(res, Math.max(10, speed)));
            }
        }
        // Ensure path is printed even if animation fails
        if (result.path && result.path.length > 0) {
            setGrid(g => {
                const ng = cloneGrid(g);
                for (const p of result.path) {
                    const t = ng[p.row][p.col];
                    if (t.type !== 'start' && t.type !== 'end') t.type = 'path';
                }
                return ng;
            });
        }

        setIsRunning(false);
    }

    return (
        <div className="app">
            <div className="header">
                Path-Finding Visualizer
                {isRunning && <span style={{ fontSize: '1.2rem', marginLeft: '1rem', opacity: 0.9 }}>Running...</span>}
            </div>
            <div className="container">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <div className="panel grid-wrap">
                        <Grid
                            grid={grid}
                            rows={rows}
                            cols={cols}
                            mode={mode}
                            setGrid={setGrid}
                            start={start}
                            end={end}
                            setStart={setStart}
                            setEnd={setEnd}
                            isRunningRef={isRunningRef}
                        />
                    </div>
                    {(noPathMessage || pathLength !== null) && (
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(10px)',
                            padding: '1rem 2rem',
                            borderRadius: '10px',
                            border: noPathMessage ? '2px solid hsl(0, 84%, 65%)' : '2px solid hsl(142, 71%, 58%)',
                            boxShadow: noPathMessage
                                ? '0 4px 20px rgba(239, 68, 68, 0.5)'
                                : '0 4px 20px rgba(52, 211, 153, 0.5)',
                            animation: 'slideDown 0.3s ease-out',
                            textAlign: 'center'
                        }}>
                            {noPathMessage && (
                                <div style={{
                                    color: 'hsl(0, 84%, 65%)',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}>
                                    {noPathMessage}
                                </div>
                            )}
                            {pathLength !== null && (
                                <div style={{
                                    color: 'hsl(142, 71%, 58%)',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}>
                                    Path found: {pathLength} cells
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="panel controls-wrap">
                    <Controls
                        algorithm={algorithm}
                        setAlgorithm={setAlgorithm}
                        mode={mode}
                        setMode={setMode}
                        speed={speed}
                        setSpeed={setSpeed}
                        diagonal={diagonal}
                        setDiagonal={setDiagonal}
                        heuristic={heuristic}
                        setHeuristic={setHeuristic}
                        runAlgorithm={runAlgorithm}
                        clearGrid={clearGrid}
                        clearPath={clearPath}
                        resizeGrid={resizeGrid}
                        rows={rows}
                        cols={cols}
                        isRunning={isRunning}
                    />
                    <Legend />
                </div>
            </div>
        </div>
    );
}
