const {
  getNeighbourNodes,
  normalizeGrid,
  getFinalPath,
  isEnd,
} = require("./utils");
const {
  open_500_500,
  open_100_100,
  open_150_150,
  open_250_250,
} = require("../grids/no-obstacles-grids");
// for different movement costs
// eg. climbing a hill has higher cost than walking at downtown
// 0 means obstacle, positive no. n means open and has cost of n

let start = { x: 0, y: 0 };
let end = { x: 99, y: 99 };

// let inputGrid = normalizeGrid(input);
let inputGrid = normalizeGrid(open_100_100);

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
      let visited = neighbour.visited;
      // for first time visiting or current g is smaller than the previous one
      if (!visited || currentG < neighbour.g) {
        neighbour.visited = true;
        neighbour.parent = { x: currentNode.x, y: currentNode.y };
        neighbour.h = neighbour.h || heuristics(neighbour, end);
        neighbour.g = currentG;
        neighbour.f = neighbour.g + neighbour.h;

        if (!visited) {
          openList[neighbour.name] = neighbour;
        }
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

console.time("A*");
let result = a_star(inputGrid, start, end);
console.log("Path Length: ", result.length);
console.timeEnd("A*");
// console.log("total costs: ", result[result.length - 1].g);
// console.log(
//   "nodes: ",
//   result.map((el) => el.name)
// );
