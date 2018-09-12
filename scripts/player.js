class Player {
  constructor(type, rowNumber, colNumber, score) {
    this.type = type;
    this.rowNumber = rowNumber;
    this.colNumber = colNumber;
    this.score = score;
    this.isAttacking = true;
    this.weapon = null;
  }

  move(newRow, newCol) {
    this.rowNumber = newRow;
    this.colNumber = newCol;
  }

  setIsAttacking(b) {
    this.isAttacking = b;
  }
}
