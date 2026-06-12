class PathGenerator {
  constructor() {
    this.trackMap = {
      red: [
        { r: 6, c: 0 },
        { r: 6, c: 1 },
        { r: 5, c: 1 },
        { r: 4, c: 1 },
        { r: 3, c: 1 },
        { r: 2, c: 1 },
        { r: 1, c: 1 },
        { r: 1, c: 2 },
        { r: 1, c: 3 },
        { r: 1, c: 4 },
        { r: 1, c: 5 },
        { r: 1, c: 6 },
        { r: 0, c: 6 },
        { r: 0, c: 7 },
        { r: 0, c: 8 },
        { r: 1, c: 8 },
        { r: 2, c: 8 },
        { r: 3, c: 8 },
        { r: 4, c: 8 },
        { r: 5, c: 8 },
        { r: 6, c: 8 },
        { r: 6, c: 9 },
        { r: 6, c: 10 },
        { r: 6, c: 11 },
        { r: 6, c: 12 },
        { r: 6, c: 13 },
        { r: 7, c: 13 },
        { r: 8, c: 13 },
        { r: 8, c: 12 },
        { r: 8, c: 11 },
        { r: 8, c: 10 },
        { r: 8, c: 9 },
        { r: 8, c: 8 },
        { r: 9, c: 8 },
        { r: 10, c: 8 },
        { r: 11, c: 8 },
        { r: 12, c: 8 },
        { r: 13, c: 8 },
        { r: 13, c: 7 },
        { r: 14, c: 7 },
        { r: 14, c: 6 },
        { r: 13, c: 6 },
        { r: 12, c: 6 },
        { r: 11, c: 6 },
        { r: 10, c: 6 },
        { r: 9, c: 6 },
        { r: 8, c: 6 },
        { r: 8, c: 5 },
        { r: 8, c: 4 },
        { r: 8, c: 3 },
        { r: 8, c: 2 },
        { r: 8, c: 1 },
        { r: 7, c: 1 },
      ],
    };
  }

  getTrackPath(color) {
    return this.trackMap[color] || this.trackMap.red;
  }

  getSafeCells() {
    return [
      [0, 6],
      [6, 0],
      [6, 12],
      [7, 1],
      [7, 13],
      [1, 7],
      [13, 7],
    ];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PathGenerator;
}
