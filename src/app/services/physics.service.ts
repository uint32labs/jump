import {Injectable} from '@angular/core';
import {Object} from '../models/object.model';
import {Vector} from '../models/vector.model';
import {GlobalSettings} from '../models/settings.model';

export class PhysicsService implements IPhysicsService {
  CalculateSpeed(speed: number, acceleration: number, delta: number): number {
    return speed + (acceleration * delta);
  }

  IsColliding(obj1: Object, obj2: Object): boolean {

    if (obj1.position.z <= obj2.position.z + obj2.size.height + GlobalSettings.collisionPadding && obj1.position.z + obj1.size.height + GlobalSettings.collisionPadding >= obj2.position.z) {
      if (obj1.position.x <= obj2.position.x + obj2.size.width + GlobalSettings.collisionPadding && obj1.position.x + obj1.size.width + GlobalSettings.collisionPadding >= obj2.position.x) {
        return true;
      }
    }
    return false;
  }

  CalculatePositionVector(speed: number, input: Vector, delta: number): Vector {
    const norm = input.norm();
    if (norm === 0) {
      return new Vector(0, 0);
    }
    const coefficient = this.CalculatePositionDelta(speed, delta) / norm;
    return new Vector(coefficient * input.x, coefficient * input.y);
  }

  CalculatePositionDelta(speed: number, delta: number): number {
    return speed * delta;
  }

}

@Injectable({
  providedIn: 'root',
  useClass: PhysicsService
})
export abstract class IPhysicsService {
  abstract IsColliding(obj1: Object, obj2: Object): boolean;

  abstract CalculateSpeed(speed: number, acceleration: number, delta: number): number;

  abstract CalculatePositionVector(speed: number, input: Vector, delta: number): Vector;

  abstract CalculatePositionDelta(speed: number, delta: number): number;
}
