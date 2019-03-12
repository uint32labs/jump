import {Observable} from 'rxjs';
import {EventEmitter} from '@angular/core';

export class Point {
  public XChanged = new EventEmitter<number>();
  public YChanged = new EventEmitter<number>();
  public ZChanged = new EventEmitter<number>();
  private _x: number;
  public get x(): number {
    return this._x;
  }

  public set x(val: number) {
    this._x = val;
    this.XChanged.emit(this.x);
  }

  private _y: number;
  public get y(): number {
    return this._y;
  }

  public set y(val: number) {
    this._y = val;
    this.YChanged.emit(this.y);
  }

  private _z: number;
  public get z(): number {
    return this._z;
  }

  public set z(val: number) {
    this._z = val;
    this.ZChanged.emit(this.z);
  }

  constructor(x: number, y: number, z: number) {
    this.XChanged = new EventEmitter<number>();
    this.YChanged = new EventEmitter<number>();
    this.ZChanged = new EventEmitter<number>();

    this.x = x;
    this.y = y;
    this.z = z;
  }
}
