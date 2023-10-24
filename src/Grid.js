import React, { useState } from 'react';
import './GridComponent.css';
import Cell from "./Cell.js"
import'./index.css';
import {blockRandomSections, verticalStripesWithPassage, horizontalStripesWithPassage} from "./GridLayouts"

const GridComponent = ({ rows, cols }) => {
    const [grid, setGrid] = useState(createEmptyGrid(rows, cols));
    const [isLocked, setIsLocked] = useState(false);
    const [timeoutIds, setTimeoutIds] = useState([]);

    function createEmptyGrid(rows, cols) {
        let newGrid = [];
        for (let i = 0; i < rows; i++) {
            newGrid.push([]);
            for (let j = 0; j < cols; j++) {
                const cell = new Cell(i, j); 
                newGrid[i].push(cell);
                if (i === 0 && j === 0) {
                    cell.isStart = true;
                }
                if (i === rows - 1 && j === cols - 1) {
                    cell.isEnd = true;
                }
            }
        }
        return newGrid;
    }

    function resetGrid() {
        
        timeoutIds.forEach(id => clearTimeout(id));
    
        setTimeoutIds([]);  
    
        const newGrid = createEmptyGrid(rows, cols);
        setGrid(newGrid);
    }

    function deepCopyGrid(grid) {
        return grid.map(row => row.map(cell => Object.assign(new Cell(), cell)));
    }

    function bfs(grid, startNode, endNode) {
        setIsLocked(true);

        const nodesToVisit = [startNode];
        const nodesToRender = [];
    
        while (nodesToVisit.length) {
            const currentNode = nodesToVisit.shift();
            nodesToRender.push(currentNode);
    
            if (currentNode === endNode) {
                break;
            }
    
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const dir of directions) {
                const newRow = currentNode.row + dir[0];
                const newCol = currentNode.col + dir[1];
    
                if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
                    const neighborNode = grid[newRow][newCol];
    
                    if (!neighborNode.isVisited && neighborNode.state !== 1) {
                        neighborNode.isVisited = true;
                        neighborNode.previous = currentNode;
                        nodesToVisit.push(neighborNode);
                    }
                }
            }
        }
    
        
        nodesToRender.forEach((node, index) => {
            const timeoutIdForNode = setTimeout(() => {
                setGrid(prevGrid => {
                    const newGrid = deepCopyGrid(prevGrid);
                    newGrid[node.row][node.col].isVisited = true;
                    return newGrid;
                });
            }, index * 50); 
            setTimeoutIds(prevTimeouts => [...prevTimeouts, timeoutIdForNode]);
        });
    
        const shortestPath = getShortestPath(endNode);
    
        
        setTimeout(() => {
            shortestPath.forEach((node, index) => {
                const timeoutIdForPath = setTimeout(() => {
                    setGrid(prevGrid => {
                        const pathGrid = deepCopyGrid(prevGrid);
                        pathGrid[node.row][node.col].isPath = true; 
                        return pathGrid;
                    });
                }, index * 50); 
                setTimeoutIds(prevTimeouts => [...prevTimeouts, timeoutIdForPath]);
            });
        }, nodesToRender.length * 50);
    }

    function getShortestPath(endNode) {
        const path = [];
        let currentNode = endNode;
        const seenNodes = new Set();
    
        while (currentNode !== null) {
            if (seenNodes.has(currentNode)) {
                break;
            }
            seenNodes.add(currentNode);
    
            path.unshift(currentNode); 
            currentNode = currentNode.previous;
        }
        return path;
    }

    return (
        <div className="grid-container">
            <button onClick={() => {
    const startNode = grid[0][0];
    const endNode = grid[rows-1][cols-1];
    bfs(grid, startNode, endNode);
}}>
    Start Pathfinding
</button>
    {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
            {row.map((cell, cellIndex) => (
                <div
                    key={cellIndex}
                    className={`grid-cell 
                    ${cell.state === 1 ? 'selected' : ''}
                    ${cell.isVisited ? 'visited' : ''}
                    ${cell.isPath ? 'path' : ''}
                    ${cell.isStart ? 'start' : ''}
                    ${cell.isEnd ? 'end' : ''}`}
                    onClick={() => {
                        if (!isLocked) {
                            const newGrid = [...grid];
                            newGrid[rowIndex][cellIndex].state = cell.state === 0 ? 1 : 0;
                            setGrid(newGrid);
                        }
                    }}
                ></div>
            ))}
        </div>
    ))}
    <div className="button-container">
    <button onClick={() => {
        const newGrid = deepCopyGrid(grid);  
        verticalStripesWithPassage(newGrid);  
        setGrid(newGrid);  
    }}>Vertical</button>

    <button onClick={() => {
        const newGrid = deepCopyGrid(grid);  
        horizontalStripesWithPassage(newGrid);  
        setGrid(newGrid);  
    }}>Horizontal</button>

    <button onClick={() => {
        const newGrid = deepCopyGrid(grid);  
        blockRandomSections(newGrid);  
        setGrid(newGrid);  
    }}>Random</button>

    <button onClick={resetGrid} className="reset-button">Reset</button>
</div>
</div>
    );
}

export default GridComponent;