const {
  getNeighbourNodes,
  normalizeGrid,
  getFinalPath,
  isEnd,
} = require("./utils");
const { open_100_100 } = require("../grids/no-obstacles-grids");

// for different movement costs
// eg. climbing a hill has higher cost than walking at downtown
// 0 means obstacle, positive no. n means open and has cost of n

let start = { x: 0, y: 0 };
let end = { x: 99, y: 99 };

// a-start idea is basically the same as dijkstra
// except a-star is queued by,
// heuristics to end node from current node + distacne from start to current node

// this implementation uses Binary Heap for Priority Queue
// !BinaryHeap Class required
let inputGrid = normalizeGrid(open_100_100);
let priorityQueue = new BinaryHeap((x) => x?.f); // Binary Heap as a Priority Queue

function a_star(grid, start, end, heuristics = manhattan_h) {
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
      // for first time visiting, there is no previous g so current g will be the best
      if (!visited || currentG < neighbour.g) {
        neighbour.visited = true;
        neighbour.parent = { x: currentNode.x, y: currentNode.y };
        neighbour.h = neighbour.h || heuristics(neighbour, end);
        neighbour.g = currentG;
        neighbour.f = neighbour.g + neighbour.h;

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

function manhattan_h(node, end) {
  let D = 1;
  let d1 = Math.abs(node.x - end.x);
  let d2 = Math.abs(node.y - end.y);
  return D * (d1 + d2);
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
