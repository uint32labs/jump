import {ObjectTypes, Object} from './object.model';
import {Point} from './point.model';

export class Plate extends Object {
  public strikes = 0;
  constructor(position: Point) {
    super(position);
    this.type = ObjectTypes.Plate;
    this.color = '#353535';
  }
}
