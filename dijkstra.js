const {
  getNeighbourNodes,
  normalizeGrid,
  getFinalPath,
  isEnd,
} = require("./utils");
// for different movement costs
// eg. climbing a hill has higher cost than walking at downtown
// 0 means obstacle, positive no. n means open and has cost of n
// for uniform movement costs
let input_uniform = [
  [1, 1, 1, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 0, 1],
];

let start = { x: 0, y: 0 };
let end = { x: 4, y: 4 };

// dijkstra idea is basically the same as breadth-first-search
// except dijkstra includes priority queue, queued by the distance from the start node to current node in ascending order

// dijkstra uniform movement costs
let inputGrid = normalizeGrid(input_uniform, true);

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
      let currentG = currentNode.g + currentNode.weights[neighbour.name];
      let isBestG = false;
      // for first time visiting, there is no previous g so current g will be the best
      if (!neighbour.visited) {
        isBestG = true;
        neighbour.visited = true;
        openList[neighbour.name] = neighbour;
      } else if (neighbour.g > currentG) {
        // if visited and previous g is larger then the current one, current one will be the bset
        isBestG = true;
      }
      // if current g is the best, update current neighbour's g,parent
      if (isBestG) {
        neighbour.parent = { x: currentNode.x, y: currentNode.y };
        neighbour.g = currentG;
      }
      // console.log({
      //   x: neighbour.x,
      //   y: neighbour.y,
      //   g: neighbour.g,
      // });
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

// let result = dijkstra(inputGrid, start, end);
// console.log("total costs: ", result[result.length - 1].g);
// console.log(
//   "nodes: ",
//   result.map((el) => el.name)
// );
