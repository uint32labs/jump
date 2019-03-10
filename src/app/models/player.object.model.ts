import {Object} from './object.model';

export class Player extends Object {
  public velocity: number;
  constructor(public device: number) {
    super();
  }
}
