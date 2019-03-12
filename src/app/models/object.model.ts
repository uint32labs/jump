import {Point} from './point.model';
import {Rectangle} from './rectangle.model';

export class Object {
  public readonly position: Point;
  public size: Rectangle;
  public color: string;
  public type: ObjectTypes;

  constructor(position: Point) {
    this.position = position;
    this.color = '#000000';
  }

  public center(): Point {
    return new Point(this.position.x + this.size.width / 2, this.position.y, this.position.z + this.size.height / 2);
  }
}

export enum ObjectTypes {
  Player,
  Plate
}
