const {
  normalizeGrid,
  getFinalPath,
  isEnd,
  getNeighbourNodes,
} = require("./utils");
// for different movement costs
// eg. climbing a hill has higher cost than walking at downtown
// 0 means obstacle, positive no. n means open and has cost of n
let input = [
  [1, 3, 2, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 5, 1],
  [0, 1, 1, 0, 1],
];

// for uniform movement costs
let input_uniform = [
  [1, 1, 1, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 0, 1],
];

let start = { x: 0, y: 0 };
let end = { x: 4, y: 4 };

//  idea is basically the same as dijkstra
// except queued by the estimate distance to goal in ascending order
// ! but it may not find the shortest path sometime, instead of gbfs, use A* with unadmissible heurisitcs
// * read more https://www.redblobgames.com/pathfinding/a-star/introduction.html

let inputGrid = normalizeGrid(input_uniform);

function greedy_best_first_search(grid, start, end, heuristics = manhattan_h) {
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
      let currentH = heuristics(neighbour, end);
      let isBestH = false;
      // for first time visiting, there is no previous g so current g will be the best
      if (!neighbour.visited) {
        isBestH = true;
        neighbour.visited = true;
        openList[neighbour.name] = neighbour;
      } else if (neighbour.h > currentH) {
        // if visited and previous g is larger then the current one, current one will be the bset
        isBestH = true;
      }
      // if current g is the best, update current neighbour's g,parent
      if (isBestH) {
        neighbour.parent = { x: currentNode.x, y: currentNode.y };
        neighbour.h = currentH;
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
      shortest === null || openList[node].h < openList[shortest].h;
    if (isCurrentShortest) {
      shortest = node;
    }
  }
  return openList[shortest];
}

let result = greedy_best_first_search(inputGrid, start, end);

console.log(
  "nodes: ",
  result.map((el) => el.name)
);
