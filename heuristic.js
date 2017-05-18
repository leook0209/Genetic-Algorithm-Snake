function Heuristic(snake, weights) {
  this.snake = snake;
  this.fitness = 0;
  this.weights = [];
  this.grid;

  const foodDistIdx = 0;
  const centerDistIdx = 1;
  const compactnessIdx = 2;
  const connectivityIdx = 3;
  const deadendIdx = 4;

  this.weights[foodDistIdx] = weights[foodDistIdx];
  this.weights[centerDistIdx] = weights[centerDistIdx];
  this.weights[compactnessIdx] = weights[compactnessIdx];
  this.weights[connectivityIdx] = weights[connectivityIdx];
  this.weights[deadendIdx] = weights[deadendIdx];

  this.calculateFitness = function() {
    this.initGrid();
    if(this.snake.death() === true) {
      return Number.NEGATIVE_INFINITY;
    }

    if(this.connectivity() !== 0 || this.deadend() !== 0) {
    console.log("-----------------------------------");
    console.log("foodDist: " + this.foodDist(food));
    console.log("centerDist: " + this.centerDist());
    console.log("compactness: " + this.compactness());
    console.log("connectivity: " + this.connectivity());
    console.log("deadend: " + this.deadend());
    console.log("-----------------------------------");
    }
    return this.weights[foodDistIdx] * this.foodDist(food)
          +this.weights[centerDistIdx] * this.centerDist()
          +this.weights[compactnessIdx] * this.compactness()
          +this.weights[connectivityIdx] * this.connectivity();
          +this.weights[deadendIdx] * this.deadend();
  }

  this.initGrid = function() {
    this.grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
      this.grid[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        this.grid[i][j] = 0;
      }
    }
    for (let i = 0; i < this.snake.tail.length; i++) {
      if(this.snake.tail[i].x/scale !== -1 && this.snake.tail[i].x/scale !== cols && this.snake.tail[i].y/scale !== -1 && this.snake.tail[i].y/scale !== rows) {
        this.grid[this.snake.tail[i].y/scale][this.snake.tail[i].x/scale] = 1;
      }
    }
    if(this.snake.x/scale !== -1 && this.snake.x/scale !== cols && this.snake.y/scale !== -1 && this.snake.y/scale !== rows) {
      this.grid[this.snake.y/scale][this.snake.x/scale] = 1;
    }
  }

  this.printGrid = function(grid) {
    for (let i = 0; i < rows; i++) {
      let string = '';
      for (let j = 0; j < cols; j++) {
        string += grid[i][j] + ' ';
      }
      string += "       " + window.performance.now();
      console.log(string);
    }
    console.log("-------------------------------");
  }

  this.foodDist = function(food) {
    return sq(dist(this.snake.x, this.snake.y, food.x, food.y)/scale);
  }

  this.centerDist = function() {
    let distGrid = new Array(rows);
    for (let i = 0; i < rows; i++) {
      distGrid[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        distGrid[i][j] = 0;
      }
    }
    for (let i = 0; i < Math.min(rows, cols)/2; i++) {
      for (let j = 0+i; j < cols-i; j++) {
        distGrid[i][j] = i+1;
        distGrid[rows-i-1][j] = i+1;
      }
      for (let j = 0+i; j < rows-i; j++) {
        distGrid[j][i] = i+1;
        distGrid[j][cols-i-1] = i+1;
      }
    }

    let row = this.snake.x/scale;
    let col = this.snake.y/scale;
    return distGrid[row][col];
  }

  this.newCompactness = function() {
    let count = 0;
    for (let i = 0; i < this.snake.tail.length; i++) {
      if (this.grid[this.snake.tail[i].y/scale][this.snake.tail[i].x/scale+1] === 1) {
        count++;
      } else if (this.grid[this.snake.tail[i].y/scale][this.snake.tail[i].x/scale-1] === 1) {
        count++;
      } else if (this.grid[this.snake.tail[i].y/scale+1][this.snake.tail[i].x/scale] === 1) {
        count++;
      } else if (this.grid[this.snake.tail[i].y/scale-1][this.snake.tail[i].x/scale] === 1) {
        count++;
      }
    }
    if (this.grid[this.snake.y/scale][this.snake.x/scale+1] === 1) {
      count++;
    } else if (this.grid[this.snake.y/scale][this.snake.x/scale-1] === 1) {
      count++;
    } else if (this.grid[this.snake.y/scale+1][this.snake.x/scale] === 1) {
      count++;
    } else if (this.grid[this.snake.y/scale-1][this.snake.x/scale] === 1) {
      count++;
    }

    return count/2;
  }

  this.compactness = function() {
    let count = 0;
    for (let i = 0; i < this.snake.tail.length; i++) {
      for (let j = 0; j < this.snake.tail.length; j++) {
        if (this.snake.tail[i].x + scale === this.snake.tail[j].x && this.snake.tail[i].y === this.snake.tail[j].y) {
          count++;
        } else if (this.snake.tail[i].x - scale === this.snake.tail[j].x && this.snake.tail[i].y === this.snake.tail[j].y) {
          count++;
        } else if (this.snake.tail[i].x === this.snake.tail[j].x && this.snake.tail[i].y + scale === this.snake.tail[j].y) {
          count++;
        } else if (this.snake.tail[i].x === this.snake.tail[j].x && this.snake.tail[i].y - scale === this.snake.tail[j].y) {
          count++;
        }
      }
      if (this.snake.tail[i].x + scale === this.snake.x && this.snake.tail[i].y === this.snake.y) {
        count++;
      } else if (this.snake.tail[i].x - scale === this.snake.x && this.snake.tail[i].y === this.snake.y) {
        count++;
      } else if (this.snake.tail[i].x === this.snake.x && this.snake.tail[i].y + scale === this.snake.y) {
        count++;
      } else if (this.snake.tail[i].x === this.snake.x && this.snake.tail[i].y - scale === this.snake.y) {
        count++;
      }
    }

    for (let j = 0; j < this.snake.tail.length; j++) {
      if (this.snake.x + scale === this.snake.tail[j].x && this.snake.y === this.snake.tail[j].y) {
        count++;
      } else if (this.snake.x - scale === this.snake.tail[j].x && this.snake.y === this.snake.tail[j].y) {
        count++;
      } else if (this.snake.x === this.snake.tail[j].x && this.snake.y + scale === this.snake.tail[j].y) {
        count++;
      } else if (this.snake.x === this.snake.tail[j].x && this.snake.y - scale === this.snake.tail[j].y) {
        count++;
      }
    }
    return count/2;
  }

  this.connectivity = function() {
    let tempGrid = [];
    let blankCount = 0;
    for (let i = 0; i < rows; i++) {
      tempGrid[i] = [];
      for (let j = 0; j < cols; j++) {
        tempGrid[i][j] = this.grid[i][j];
      }
    }
    let start = createVector(floor(random(0, cols)), floor(random(0, rows)));
    while (tempGrid[start.y][start.x] === 1) {
      start = createVector(floor(random(0, cols)), floor(random(0, rows)));
    }
    this.propagate(start, tempGrid);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (tempGrid[i][j] === 0) {
          blankCount++;
        }
      }
    }

    return blankCount;
  }

  this.deadend = function() {
    let start;
    let tempGrid = [];
    let blankCount = 0;
    for (let i = 0; i < rows; i++) {
      tempGrid[i] = [];
      for (let j = 0; j < cols; j++) {
        tempGrid[i][j] = this.grid[i][j];
      }
    }

    start = createVector(this.snake.x/scale+1, this.snake.y/scale);
    if (start.x !== cols && tempGrid[start.y][start.x] === 0) {
      this.propagate(start, tempGrid);
    }
    start = createVector(this.snake.x/scale-1, this.snake.y/scale);
    if (start.x !== -1 && tempGrid[start.y][start.x] === 0) {
      this.propagate(start, tempGrid);
    }
    start = createVector(this.snake.x/scale, this.snake.y/scale+1);
    if (start.y !== rows && tempGrid[start.y][start.x] === 0) {
      this.propagate(start, tempGrid);
    }
    start = createVector(this.snake.x/scale, this.snake.y/scale-1);
    if (start.y !== -1 && tempGrid[start.y][start.x] === 0) {
      this.propagate(start, tempGrid);
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (tempGrid[i][j] == 0) {
          blankCount++;
        }
      }
    }

    return blankCount;
  }

  this.propagate = function(start, tempGrid) {
    let next;
    if (start.x !== cols-1 && tempGrid[start.y][start.x+1] === 0) {
      tempGrid[start.y][start.x+1] = 1;
      next = createVector(start.x+1, start.y);
      this.propagate(next, tempGrid);
    }
    if (start.x !== 0 && tempGrid[start.y][start.x-1] === 0) {
      tempGrid[start.y][start.x-1] = 1;
      next = createVector(start.x-1, start.y);
      this.propagate(next, tempGrid);
    }
    if (start.y !== rows-1 && tempGrid[start.y+1][start.x] === 0) {
      tempGrid[start.y+1][start.x] = 1;
      next = createVector(start.x, start.y+1);
      this.propagate(next, tempGrid);
    }
    if (start.y !== 0 && tempGrid[start.y-1][start.x] === 0) {
      tempGrid[start.y-1][start.x] = 1;
      next = createVector(start.x, start.y-1);
      this.propagate(next, tempGrid);
    }
  }
}
