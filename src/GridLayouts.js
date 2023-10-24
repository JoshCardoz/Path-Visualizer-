export function verticalStripesWithPassage(grid) {
    const passageRow = Math.floor(Math.random() * grid.length);
    const passageWidth = 3;  // Adjust as needed
    
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j+=2) {
            if (i < passageRow || i >= passageRow + passageWidth) {
                grid[i][j].state = 1;
            }
        }
    }
    return grid;
}

export function horizontalStripesWithPassage(grid) {
    const passageCol = Math.floor(Math.random() * grid[0].length);
    const passageWidth = 3;  
    
    for(let i = 0; i < grid.length; i+=2) {
        for(let j = 0; j < grid[i].length; j++) {
            if (j < passageCol || j >= passageCol + passageWidth) {
                grid[i][j].state = 1;
            }
        }
    }
    return grid;
}

export function blockRandomSections(grid) {
    const blockProbability = 0.2; // 20% of cells will be blocked

    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            if(Math.random() < blockProbability) {  
                grid[i][j].state = 1;
            }
        }
    }
    return grid;
}
