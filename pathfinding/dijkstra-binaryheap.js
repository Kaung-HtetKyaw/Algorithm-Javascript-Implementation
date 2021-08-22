const {
  getNeighbourNodes,
  normalizeGrid,
  getFinalPath,
  isEnd,
} = require("./utils");
const { input_50_50 } = require("./constants");

let start = { x: 0, y: 0 };
let end = { x: 49, y: 49 };

// dijkstra idea is basically the same as breadth-first-search
// except dijkstra includes priority queue, queued by the distance from the start node to current node in ascending order

// this implementation uses Binary Heap for Priority Queue
// !BinaryHeap Class required
let inputGrid = normalizeGrid(input_50_50);
let priorityQueue = new BinaryHeap((x) => x?.g); // binary heap as priority queue

function dijkstra(grid, start, end) {
  let startNode = grid[start.x][start.y];
  let openList = priorityQueue;
  openList.push(startNode);
  let numNodes = 0; // num of nodes considered, not really important (for extra information)

  while (openList.size() > 0) {
    // get the shortest node from open list
    let currentNode = openList.pop();

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
      let currentG = currentNode.g + currentNode.weights[neighbour.name];
      let visited = neighbour.visited;
      // for first time visiting or current g is smaller than the previous one
      if (!visited || currentG < neighbour.g) {
        neighbour.visited = true;
        neighbour.parent = { x: currentNode.x, y: currentNode.y };
        neighbour.g = currentG;

        if (!visited) {
          openList.push(neighbour);
        } else {
          // already visited the node, but this time it got smaller g value than the previous one
          // so we need to reorder the node in priorityQueue
          openList.reorderNode(neighbour);
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
