// Helper functions
const randomInt = limit => {
  return Math.floor(Math.random() * limit);
};

const getRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const randomPairs = (rows, cols, numPairs) => {
  let pairs = [];
  let i = 0;
  while (i < numPairs) {
    let currPair;
    if (i % 2 == 0) {
      currPair = [getRandomInRange(0, rows / 2), getRandomInRange(0, cols / 2)];
    } else {
      currPair = [
        getRandomInRange(rows / 2, rows),
        getRandomInRange(cols / 2, cols)
      ];
    }
    if (searchForArray(pairs, currPair) == -1) {
      pairs.push(currPair);
      i++;
    }
  }

  return pairs;
};

const searchForArray = (haystack, needle) => {
  var i, j, current;
  for (i = 0; i < haystack.length; ++i) {
    if (needle.length === haystack[i].length) {
      current = haystack[i];
      for (j = 0; j < needle.length && needle[j] === current[j]; ++j);
      if (j === needle.length) return i;
    }
  }
  return -1;
};
