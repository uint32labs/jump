import {Inject, Injectable} from '@angular/core';
import {Object} from '../models/object.model';
import {Point} from '../models/point.model';
import {Rectangle} from '../models/rectangle.model';
import {Vector} from '../models/vector.model';
import {GlobalSettings} from '../models/settings.model';
import {Plate} from '../models/plate.object.model';


export class MapService implements IMapService {
  map: Plate[] = [];

  constructor() {
  }


  DrawableObjects(translation: Vector, size: Rectangle): Object[] {
    const origin = new Point(-translation.x, 0, -translation.y);
    const region = new Rectangle(size.width + origin.x, size.height + origin.z);
    const result: Object[] = [];
    for (let i = 0; i < this.map.length; i++) {
      if (this.map[i].position.x + this.map[i].size.width > origin.x && this.map[i].position.x < region.width) {
        if (this.map[i].position.z + this.map[i].size.height > origin.z && this.map[i].position.z < region.height) {
          result.push(this.map[i]);
        }
      }
    }
    return result;
  }

  GetTranslation(pos: Point, size: Rectangle): Vector {
    const translation: Vector = new Vector(0, 0);
    if (pos.z < GlobalSettings.scrollPadding) {
      translation.y = GlobalSettings.scrollPadding - pos.z;
    }
    if (pos.z > size.height - GlobalSettings.scrollPadding) {
      translation.y = size.height - pos.z - GlobalSettings.scrollPadding;
    }
    if (pos.x < GlobalSettings.scrollPadding) {
      translation.x = GlobalSettings.scrollPadding - pos.x;
    }
    if (pos.x > size.width - GlobalSettings.scrollPadding) {
      translation.x = size.width - pos.x - GlobalSettings.scrollPadding;
    }
    return translation;
  }

  GetRelativePosition(translation: Vector, pos: Point): Point {
    return new Point(pos.x + translation.x, pos.y, pos.z + translation.y);
  }

  LoadMap(map: Plate[]): void {
    this.map = map;
  }

  // not functional because this retarded ass language can't pass by value & it's fucking impossible to clone an object
  // like how deeply fucking stupid is that
  ApplyTranslate(translation: number, objects: Object[]): Object[] {
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      obj.position.z -= translation;
      obj.position.x -= translation;
      }
      return objects;
  }

}

@Injectable({
  providedIn: 'root',
  useClass: MapService
})
export abstract class IMapService {
  public map: Plate[] = [];

  constructor() {
  }

  abstract ApplyTranslate(translation: number, objects: Object[]): Object[];

  abstract LoadMap(map: Object[]): void;

  abstract GetTranslation(pos: Point, size: Rectangle): Vector;

  abstract GetRelativePosition(translation: Vector, pos: Point): Point;

  abstract DrawableObjects(translation: Vector, size: Rectangle): Object[];
}
