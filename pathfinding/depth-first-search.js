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

// depth first search use stack (Last In First Out)
// it will go to last item on stack

function depth_first_search(grid, start, end) {
  let startNode = grid[start.x][start.y];
  let openList = [startNode];
  startNode.visited = true;
  let numNodes = 0; // num of nodes considered, not really important (for extra information)

  while (Object.keys(openList).length > 0) {
    // get the first item
    let currentNode = openList.pop();

    currentNode.closed = true;

    currentNode.visited = true;

    numNodes++;
    // reach end
    if (currentNode.x === end.x && currentNode.y === end.y) {
      let path = getFinalPath(currentNode, grid, start);
      console.log("Number of nodes considered: ", numNodes);
      return path;
    }

    let neighbours = getNeighbourNodes(grid, currentNode, true);
    let neighbourLength = neighbours.length;

    for (let x = 0; x < neighbourLength; x++) {
      let neighbour = neighbours[x];

      // if neighbour is already considered or wall, continue to next neighbour
      if (neighbour.closed || neighbour.isWall) {
        continue;
      }
      // if the neighbour is visited very first time
      if (!neighbour.visited) {
        neighbour.parent = { x: currentNode.x, y: currentNode.y };
        openList.push(neighbour);
      }
    }
  }
  return [];
}

let result = depth_first_search(inputGrid, start, end);
console.log("total costs: ", result[result.length - 1].g);
console.log(
  "nodes: ",
  result.map((el) => el.name)
);
