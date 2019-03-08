import {Object} from '../models/object.model';
import {forEach} from '@angular/router/src/utils/collection';
import {inject, Injectable} from '@angular/core';
import {Rectangle} from '../models/rectangle.model';

export class DrawingService implements IDrawingService {
  context: CanvasRenderingContext2D;
  size: Rectangle;

  Draw(objects: Object[]): void {
    this.context.clearRect(0, 0, this.size.width, this.size.height);
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      this.context.fillStyle = '#000000';
      this.context.fillRect(obj.position.x, obj.position.z, obj.size.width, obj.size.height);
    }
  }

  MoveUp(y: number): void {
  }

}

@Injectable({
  providedIn: 'root',
  useClass: DrawingService
})
export abstract class IDrawingService {
  context: CanvasRenderingContext2D;
  size: Rectangle;

  abstract Draw(objects: Object[]): void;

  abstract MoveUp(y: number): void;
}


