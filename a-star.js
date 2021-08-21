// for different movement costs
// eg. climbing a hill has higher cost than walking at downtown
// 0 means obstacle, positive no. n means open and has cost of n
let input = [
  [1, 3, 1, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 5, 1],
  [0, 1, 1, 0, 1],
];

// for same movement costs
let input_uniform = [
  [1, 1, 1, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 0, 1],
];

let start = { x: 0, y: 0 };
let end = { x: 4, y: 4 };

// a-start idea is basically the same as dijkstra
// except a-star is queued by,
// heuristics to end node from current node + distacne from start to current node

function a_star(inputGrid, start, end, heuristics = manhattan_h) {
  let grid = normalizeGrid(inputGrid);
  let startNode = grid[start.x][start.y];
  let openList = { [startNode.name]: startNode };

  while (Object.keys(openList).length > 0) {
    // get the shortest node from open list
    let currentNode = getShortestNode(openList);
    // if reach end
    if (isEnd(currentNode, end)) {
      return getFinalPath(currentNode, grid, start);
    }

    // remove curretNode from openlist and set the flag to closed cuz currentNode is already considered
    delete openList[currentNode.name];
    currentNode.closed = true;

    // get neighbour nodes
    let neighbours = getNeighbourNodes(grid, currentNode);
    let neighboursLength = neighbours.length;
    console.log("current: ", { x: currentNode.x, y: currentNode.y });
    for (let x = 0; x < neighboursLength; x++) {
      let neighbour = neighbours[x];

      // continue to next neighbour if closed or wall
      if (neighbour.closed || neighbour.isWall) {
        continue;
      }
      let currentG = currentNode.g + neighbour.value;
      let isBestG = false;
      // for first time visiting, there is no previous g so current g will be the best
      if (!neighbour.visited) {
        isBestG = true;
        neighbour.visited = true;
        neighbour.h = heuristics(neighbour, end);
        openList[neighbour.name] = neighbour;
      } else if (neighbour.g > currentG) {
        // if visited and previous g is larger then the current one, current one will be the bset
        isBestG = true;
      }
      // if current g is the best, update current neighbour's g,parent
      if (isBestG) {
        neighbour.parent = { x: currentNode.x, y: currentNode.y };
        neighbour.g = currentG;
        neighbour.f = neighbour.g + neighbour.h;
      }
      console.log({
        x: neighbour.x,
        y: neighbour.y,
        h: neighbour.h,
        f: neighbour.f,
      });
    }
  }
  // return empty array if there is no path
  return [];
}

function manhattan_h(node, end) {
  let D = 1;
  let d1 = Math.abs(node.x - end.x);
  let d2 = Math.abs(node.y - end.y);
  return D * (d1 + d2);
}

function getFinalPath(node, grid, start) {
  let result = [];
  let cur = node;
  while (cur.parent) {
    result.push(cur);
    let { x, y } = cur.parent;
    cur = grid[x][y];
  }
  result.push(grid[start.x][start.y]);
  return result.reverse();
}

function isEnd(currentNode, end) {
  let { x: curX, y: curY } = currentNode;
  let { x, y } = end;
  return curX === x && curY === y;
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

function getShortestNode(openList) {
  let shortest = null;
  for (let node in openList) {
    let isCurrentShortest =
      shortest === null || openList[node].f < openList[shortest].f;
    if (isCurrentShortest) {
      shortest = node;
    }
  }
  return openList[shortest];
}

function normalizeGrid(inputGrid) {
  let outerArr = [];
  let length = inputGrid.length;
  for (let x = 0; x < length; x++) {
    let xLength = inputGrid[x].length;
    let innerArr = [];
    for (let y = 0; y < xLength; y++) {
      innerArr.push(normalizeNode(inputGrid, x, y));
    }
    outerArr.push(innerArr);
  }
  return outerArr;
}

function normalizeNode(inputGrid, x, y) {
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
  };
}
