// normalize 2D array to 2D with nodes returned from normalizeNode

exports.normalizeGrid = (inputGrid, weighted = false) => {
  let outerArr = [];
  let length = inputGrid.length;
  for (let x = 0; x < length; x++) {
    let xLength = inputGrid[x].length;
    let innerArr = [];
    for (let y = 0; y < xLength; y++) {
      innerArr.push(this.normalizeNode(inputGrid, x, y));
    }
    outerArr.push(innerArr);
  }
  // set weights

  this.setCosts(outerArr, weighted);

  return outerArr;
};

// set the costs of all nodes to their respective neighbours
exports.setCosts = (inputGrid, weighted = false) => {
  let length = inputGrid.length;
  for (let x = 0; x < length; x++) {
    let xLength = inputGrid[x].length;

    for (let y = 0; y < xLength; y++) {
      let node = inputGrid[x][y];
      this.setCostsToNeighbours(inputGrid, node, weighted);
    }
  }
};

// set the cost of a node to their neighbour
// 1, if not weighted,i.e, uniform movement costs
// random num between 1 and 5, if weighted
exports.setCostsToNeighbours = (grid, currentNode, weighted = false) => {
  if (currentNode.value === 0) {
    return;
  }
  // get neighbours
  let neighbours = this.getNeighbourNodes(grid, currentNode);
  let neighbourLength = neighbours.length;
  // for each neighbour
  // if neighbour has [currentNode.name] as key in weights, add [neighbour.name]=that weight to currentNode weights
  // if not, generate random num and add [neighbour.name]=random num
  for (let i = 0; i < neighbourLength; i++) {
    let neighbour = neighbours[i];

    // if not weighted, set uniform movement cost
    if (!weighted) {
      currentNode.weights[neighbour.name] = 1;
    } else {
      // if weighted
      let weightToCur = neighbour.weights[currentNode.name];
      // if weighted and neighbour already has cost
      if (weightToCur) {
        currentNode.weights[neighbour.name] = weightToCur;
      } else {
        // weighted but neighbour doesnt have cost
        currentNode.weights[neighbour.name] = this.randomInteger(1, 5);
      }
    }
  }
};

exports.getNeighbourNodes = (grid, currentNode) => {
  let { x, y } = currentNode;
  let dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  let result = [];
  // get valid non-wall nodes
  for (let i = 0; i < dirs.length; i++) {
    let dir = dirs[i];
    let xGrid = grid[x + dir[0]];
    let neighbour = xGrid ? xGrid[y + dir[1]] : undefined;

    if (neighbour && !neighbour.isWall) {
      result.push(neighbour);
    }
  }

  // if (grid[x - 1] && grid[x - 1][y] && !grid[x - 1][y].isWall) {
  //   result.push(grid[x - 1][y]);
  // }
  // if (grid[x + 1] && grid[x + 1][y] && !grid[x + 1][y].isWall) {
  //   result.push(grid[x + 1][y]);
  // }
  // if (grid[x][y - 1] && grid[x][y - 1] && !grid[x][y - 1].isWall) {
  //   result.push(grid[x][y - 1]);
  // }
  // if (grid[x][y + 1] && grid[x][y + 1] && !grid[x][y + 1].isWall) {
  //   result.push(grid[x][y + 1]);
  // }
  return result;
};

exports.randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.normalizeNode = (inputGrid, x, y) => {
  return {
    x,
    y,
    visited: false,
    closed: false,
    value: inputGrid[x][y],
    isWall: inputGrid[x][y] === 0,
    parent: null,
    f: 0,
    g: 0,
    h: 0,
    name: `${x}${y}`,
    weights: {},
  };
};

exports.getFinalPath = (node, grid, start) => {
  let result = [];
  let cur = node;
  while (cur.parent) {
    result.push(cur);
    let { x, y } = cur.parent;
    cur = grid[x][y];
  }
  result.push(grid[start.x][start.y]);
  return result.reverse();
};

exports.isEnd = (currentNode, end) => {
  let { x: curX, y: curY } = currentNode;
  let { x, y } = end;
  return curX === x && curY === y;
};
