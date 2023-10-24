class Cell {
    constructor(i, j) {
        this.row = i;
        this.col = j;
        this.isVisited = false;
        this.isPath = false;
        this.distance = null;
        this.previous = null;
        this.state = 0;  // 0: empty, 1: wall/obstacle, etc.

        this.isStart = false;
        this.isEnd = false;
    }
}

export default Cell;
