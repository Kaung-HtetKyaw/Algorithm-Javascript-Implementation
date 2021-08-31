const {
  getNeighbourNodes,
  normalizeGrid,
  getFinalPath,
  isEnd,
} = require("./utils");
const { open_100_100 } = require("../grids/no-obstacles-grids");
const { BinomialHeap } = require("../DataStructure/BinomialHeap");

let start = { x: 0, y: 0 };
let end = { x: 49, y: 49 };

// dijkstra idea is basically the same as breadth-first-search
// except dijkstra includes priority queue, queued by the distance from the start node to current node in ascending order

// this implementation uses Binomial Heap for Priority Queue
// !BinomialHeap Class required
let inputGrid = normalizeGrid(open_100_100);
let priorityQueue = new BinomialHeap("g", "name");

// for (let i = 0; i < 100; i++) {
//   for (let j = 0; j < 100; j++) {
//     priorityQueue.push(inputGrid[i][j]);
//   }
// }
// inputGrid[0][0].g = -1;
// priorityQueue.decreaseKey(0, -1, inputGrid[0][0].name);
// inputGrid[1][2].g = -2;
// priorityQueue.decreaseKey(0, -2, inputGrid[1][2].name);

// console.log(priorityQueue.pop());

function dijkstra(grid, start, end) {
  let startNode = grid[start.x][start.y];
  let openList = priorityQueue;
  openList.push(startNode);
  let numNodes = 0; // num of nodes considered, not really important (for extra information)

  while (openList.size() > 0) {
    // get the shortest node from open list
    let currentNode = openList.pop();
    // console.log(currentNode);
    numNodes++;

    // if reach end
    if (isEnd(currentNode, end)) {
      console.log("Number of nodes considered: ", numNodes);
      return getFinalPath(currentNode, grid, start);
    }

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
      let currentG = currentNode.g + 1;
      let visited = neighbour.visited;
      // for first time visiting or current g is smaller than the previous one
      if (!visited || currentG < neighbour.g) {
        let previousDistance = neighbour.g;
        neighbour.visited = true;
        neighbour.parent = { x: currentNode.x, y: currentNode.y };
        neighbour.g = currentG;

        if (!visited) {
          openList.push(neighbour);
        } else {
          // already visited the node, but this time it got smaller g value than the previous one
          // so we need to reorder the node in priorityQueue
          openList.decreaseKey(previousDistance, neighbour.g, neighbour.name);
        }
      }
    }
  }

  // return empty array if there is no path
  return [];
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

// console.log(priorityQueue.pop());
