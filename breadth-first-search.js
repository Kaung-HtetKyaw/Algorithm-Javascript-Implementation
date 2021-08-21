// doesn't matter different or same movement costs, it won't check the costs anyway
// 0 means obstacle, 1 means open
let input_5_5 = [
  [1, 1, 1, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 0, 1],
];
let input_3_4 = [
  [1, 1, 1, 1],
  [0, 1, 1, 1],
  [1, 0, 0, 1],
];
let start = { x: 0, y: 0 };
let end = { x: 5, y: 5 };

function breadth_first_search(inputGrid, start, end) {
  let grid = normalizeGrid(inputGrid);

  let openList = [grid[start.x][start.y]];

  while (Object.keys(openList).length > 0) {
    // get the first item
    let currentNode = openList[0];

    // reach end
    if (currentNode.x === end.x && currentNode.y === end.y) {
      return getFinalPath(currentNode, grid, start);
    }
    // remove it from list
    openList.shift();

    currentNode.closed = true;

    let neighbours = getNeighbourNodes(grid, currentNode);
    let neighbourLength = neighbours.length;

    for (let x = 0; x < neighbourLength; x++) {
      let neighbour = neighbours[x];

      // if neighbour is already considered or wall, continue to next neighbour
      if (neighbour.closed || neighbour.isWall || neighbour.visited) {
        continue;
      }
      // if the neighbour is visited very first time
      if (!neighbour.visited) {
        neighbour.visited = true;
        neighbour.parent = { x: currentNode.x, y: currentNode.y };
        openList.push(neighbour);
      }
    }
  }
  return [];
}

function getFinalPath(node, grid, start) {
  let result = [];
  let cur = node;
  while (cur.parent) {
    let { x, y } = cur.parent;
    result.push(cur);
    cur = grid[x][y];
  }
  result.push(grid[start.x][start.y]);
  return result.reverse();
}

function getNeighbourNodes(grid, currentNode) {
  let { x, y } = currentNode;
  let result = [];
  // get valid non-wall nodes

  if (grid[x - 1] && grid[x - 1][y] && !grid[x - 1][y].isWall) {
    result.push(grid[x - 1][y]);
  }
  if (grid[x + 1] && grid[x + 1][y] && !grid[x + 1][y].isWall) {
    result.push(grid[x + 1][y]);
  }
  if (grid[x][y - 1] && grid[x][y - 1] && !grid[x][y - 1].isWall) {
    result.push(grid[x][y - 1]);
  }
  if (grid[x][y + 1] && grid[x][y + 1] && !grid[x][y + 1].isWall) {
    result.push(grid[x][y + 1]);
  }
  return result;
}

function normalizeGrid(inputGrid) {
  let outerArr = [];
  let length = inputGrid.length;
  for (let x = 0; x < length; x++) {
    let innerArr = [];
    let innerLength = inputGrid[x].length;
    for (let y = 0; y < innerLength; y++) {
      innerArr.push(normalizeNode(inputGrid[x][y], x, y));
    }
    outerArr.push(innerArr);
  }
  return outerArr;
}

function normalizeNode(value, x, y) {
  return {
    x,
    y,
    value,
    name: `${x}${y}`,
    visited: false,
    closed: false,
    parent: null,
    isWall: value === 0,
  };
}
