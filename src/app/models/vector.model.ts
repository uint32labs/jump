export class Vector {
  constructor(public x: number, public y: number) {
  }

  public norm(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}
