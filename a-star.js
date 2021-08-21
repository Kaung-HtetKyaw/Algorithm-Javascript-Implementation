const {
  getNeighbourNodes,
  normalizeGrid,
  getFinalPath,
  isEnd,
} = require("./utils");
// for different movement costs
// eg. climbing a hill has higher cost than walking at downtown
// 0 means obstacle, positive no. n means open and has cost of n

let input = [
  [1, 1, 1, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 0, 1],
];

let start = { x: 0, y: 0 };
let end = { x: 4, y: 4 };

let inputGrid = normalizeGrid(input, true);

// a-start idea is basically the same as dijkstra
// except a-star is queued by,
// heuristics to end node from current node + distacne from start to current node

function a_star(grid, start, end, heuristics = manhattan_h) {
  let startNode = grid[start.x][start.y];
  let openList = { [startNode.name]: startNode };
  let numNodes = 0; // num of nodes considered, not really important (for extra information)

  while (Object.keys(openList).length > 0) {
    // get the shortest node from open list
    let currentNode = getShortestNode(openList);
    numNodes++;
    // if reach end
    if (isEnd(currentNode, end)) {
      console.log("Number of nodes considered: ", numNodes);
      return getFinalPath(currentNode, grid, start);
    }

    // remove curretNode from openlist and set the flag to closed cuz currentNode is already considered
    delete openList[currentNode.name];
    currentNode.closed = true;

    // get neighbour nodes
    let neighbours = getNeighbourNodes(grid, currentNode);
    let neighboursLength = neighbours.length;
    // console.log("current: ", { x: currentNode.x, y: currentNode.y });
    for (let x = 0; x < neighboursLength; x++) {
      let neighbour = neighbours[x];

      // continue to next neighbour if closed or wall
      if (neighbour.closed || neighbour.isWall) {
        continue;
      }
      // cur to neighbour cost from start node
      let currentG = currentNode.g + currentNode.weights[neighbour.name];
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

// let result = a_star(inputGrid, start, end);
// console.log("Hello");
// console.log("***********");
// console.log("total costs: ", result[result.length - 1].g);
// console.log(
//   "nodes: ",
//   result.map((el) => el.name)
// );
