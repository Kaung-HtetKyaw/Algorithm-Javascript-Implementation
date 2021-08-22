const { getNeighbourNodes, getFinalPath, normalizeGrid } = require("./utils");
// doesn't matter different or same movement costs, it won't check the costs anyway
// 0 means obstacle, 1 means open
let input_uniform = [
  [1, 1, 1, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 0, 1],
];

let start = { x: 0, y: 0 };
let end = { x: 4, y: 4 };

let inputGrid = normalizeGrid(input_uniform);

function breadth_first_search(grid, start, end) {
  let openList = [grid[start.x][start.y]];
  let numNodes = 0; // num of nodes considered, not really important (for extra information)

  while (Object.keys(openList).length > 0) {
    // get the first item
    let currentNode = openList[0];
    numNodes++;
    // reach end
    if (currentNode.x === end.x && currentNode.y === end.y) {
      console.log("Number of nodes considered: ", numNodes);
      return getFinalPath(currentNode, grid, start);
    }
    // remove it from list
    openList.shift();

    currentNode.closed = true;

    let neighbours = getNeighbourNodes(grid, currentNode);
    let neighbourLength = neighbours.length;

    for (let x = 0; x < neighbourLength; x++) {
      let neighbour = neighbours[x];

      // if neighbour is already considered or wall, continue to next neighbour
      if (neighbour.closed || neighbour.isWall || neighbour.visited) {
        continue;
      }
      // if the neighbour is visited very first time
      if (!neighbour.visited) {
        neighbour.visited = true;
        neighbour.parent = { x: currentNode.x, y: currentNode.y };
        openList.push(neighbour);
      }
    }
  }
  return [];
}

let result = breadth_first_search(inputGrid, start, end);
console.log("total costs: ", result[result.length - 1].g);
console.log(
  "nodes: ",
  result.map((el) => el.name)
);
