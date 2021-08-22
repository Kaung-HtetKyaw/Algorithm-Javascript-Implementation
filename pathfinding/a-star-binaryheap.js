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

// class BinaryHeap {
//   constructor(getScore) {
//     this.content = [];
//     // instead of hard-coding getter for node's value, we will receive as an argument
//     //! But whenever we need node's value, we will call this function like getScore(node)
//     //! instead of hard-coding like node.value
//     this.getScore = getScore;
//   }
//   push(node) {
//     // add new element to the end of array
//     this.content.push(node);
//     // let it bubble up
//     this.bubbleUp(this.content.length - 1);
//   }
//   pop() {
//     let result = this.content[0];

//     // get last node and replace it with first node
//     let endNode = this.content.pop(); // this is Array.prototype.pop, not this class method pop

//     // let it sinkDown
//     if (this.content.length > 0) {
//       this.content[0] = endNode;
//       this.sinkDown(0);
//     }

//     return result;
//   }

//   remove(node) {
//     let length = this.content.length;
//     let nodeValue = this.getScore(node);
//     // to remove a node, we must find item that's equal to node's value
//     for (let i = 0; i < length; i++) {
//       // continue to next item if node value is not equal to current one
//       if (nodeValue !== this.getScore(this.content[i])) continue;

//       // get reference to the last item
//       let endNode = this.content.pop(); // this pop() is Array.prototype.pop

//       // if node is the last item, we r done
//       if (i === length - 1) break;
//       // replace the node with the last node
//       this.content[i] = endNode;
//       // let it bubble up or sinkdown to reorder the node and then break out the loop, we r done
//       this.bubbleUp(i);
//       this.sinkDown(i);
//       break;
//     }
//   }
//   size() {
//     return this.content.length;
//   }
//   reorderNode(node) {
//     let index = this.content.indexOf(node);
//     this.bubbleUp(index);
//     this.sinkDown(index);
//   }
//   sinkDown(i) {
//     let index = i;
//     let node = this.content[index];
//     let nodeValue = this.getScore(node);
//     let length = this.content.length;

//     while (true) {
//       let rightIndex = (index + 1) * 2;
//       let leftIndex = rightIndex - 1;
//       let rightNode = this.content[rightIndex];
//       let rightNodeValue = this.getScore(rightNode);
//       let leftNode = this.content[leftIndex];
//       let leftNodeValue = this.getScore(leftNode);
//       let temp = null;

//       // if left child exists
//       if (leftIndex < length) {
//         if (leftNodeValue < nodeValue) temp = leftIndex;
//       }
//       // if right child exists
//       if (rightIndex < length) {
//         if (rightNodeValue < (temp === null ? nodeValue : leftNodeValue))
//           temp = rightIndex;
//       }
//       // if temp is null, node is smaller than both of its children
//       if (temp === null) break;
//       // swap
//       this.content[index] = this.content[temp];
//       this.content[temp] = node;
//       index = temp;
//     }
//   }

//   bubbleUp(i) {
//     let index = i;
//     let node = this.content[index];
//     let nodeValue = this.getScore(node);

//     // except root node
//     while (index > 0) {
//       let parentIndex = Math.floor((index - 1) / 2);
//       let parent = this.content[parentIndex];
//       // node value is greater than parent value, break out the loop
//       if (nodeValue >= this.getScore(parent)) break;
//       // swap node and it's parent
//       this.content[parentIndex] = node;
//       this.content[index] = parent;
//       index = parentIndex;
//     }
//   }
// }

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
