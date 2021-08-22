const {
  getNeighbourNodes,
  normalizeGrid,
  getFinalPath,
  isEnd,
} = require("./utils");
const { open_100_100 } = require("../grids/no-obstacles-grids");

// 0 means obstacle, positive no. n means open and has cost of n

let start = { x: 0, y: 0 };
let end = { x: 49, y: 49 };

// dijkstra idea is basically the same as breadth-first-search
// except dijkstra includes priority queue, queued by the distance from the start node to current node in ascending order

// dijkstra uniform movement costs
let inputGrid = normalizeGrid(open_100_100);

function dijkstra(grid, start, end) {
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
        neighbour.g = currentG;

        if (!visited) {
          openList[neighbour.name] = neighbour;
        }
      }
    }
  }

  // return empty array if there is no path
  return [];
}

function getShortestNode(openList) {
  let shortest = null;
  for (let node in openList) {
    let isCurrentShortest =
      shortest === null || openList[node].g < openList[shortest].g;
    if (isCurrentShortest) {
      shortest = node;
    }
  }
  return openList[shortest];
}

console.time("Dijkstra");
let result = dijkstra(inputGrid, start, end);
console.log("Path length: ", result.length);
console.timeEnd("Dijkstra");
// console.log("total costs: ", result[result.length - 1].g);
// console.log(
//   "nodes: ",
//   result.map((el) => el.name)
// );
