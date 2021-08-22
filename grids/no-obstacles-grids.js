exports.open_100_100 = generateOpenGrid(100, 100);
exports.open_150_150 = generateOpenGrid(150, 150);
exports.open_250_250 = generateOpenGrid(250, 250);
exports.open_500_500 = generateOpenGrid(500, 500);

function generateOpenGrid(w, h) {
  let result = [];
  for (let x = 0; x < h; x++) {
    let inner = [];
    for (let y = 0; y < w; y++) {
      inner.push(1);
    }
    result.push(inner);
  }
  return result;
}
