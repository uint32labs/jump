import {Object, ObjectTypes} from '../models/object.model';
import {forEach} from '@angular/router/src/utils/collection';
import {inject, Injectable} from '@angular/core';
import {Rectangle} from '../models/rectangle.model';
import {Point} from '../models/point.model';
import {Vector} from '../models/vector.model';
import {GlobalSettings} from '../models/settings.model';
import {Plate} from '../models/plate.object.model';
import {Player} from '../models/player.object.model';

export class DrawingService implements IDrawingService {
  context: CanvasRenderingContext2D;

  Draw(objects: Object[]): void {
    const c = this.context;
    c.strokeStyle = 'rgba(0,0,0,0.1)';
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      c.fillStyle = obj.color;
      if (obj.type === ObjectTypes.Plate) {
        c.lineWidth = 7;
        const plate = obj as Plate;
        c.globalAlpha = (GlobalSettings.maxStrikes - plate.strikes) / GlobalSettings.maxStrikes;
        c.fillRect(obj.position.x, obj.position.z, obj.size.width, obj.size.height);
        c.strokeRect(obj.position.x, obj.position.z, obj.size.width, obj.size.height);
        c.globalAlpha = 1;
      }
      if (obj.type === ObjectTypes.Player) {
        const player = obj as Player;
        c.globalAlpha = (GlobalSettings.maxJumpHeight - player.position.y + GlobalSettings.maxJumpHeight / 2)  / GlobalSettings.maxJumpHeight;
        c.beginPath();
        c.moveTo(obj.position.x, obj.position.z + obj.size.height / 2);
        c.arcTo(obj.position.x, obj.position.z, obj.position.x + obj.size.width / 2, obj.position.z, obj.size.width / 2);
        c.arcTo(obj.position.x + obj.size.width, obj.position.z, obj.position.x + obj.size.width, obj.position.z + obj.size.height, obj.size.width / 2);
        c.arcTo(obj.position.x + obj.size.width, obj.position.z + obj.size.height, obj.position.x + obj.size.width / 2, obj.position.z + obj.size.height, obj.size.width / 2);
        c.arcTo(obj.position.x, obj.position.z + obj.size.height, obj.position.x, obj.position.z + obj.size.height / 2, obj.size.width / 2);
        c.fill();
        c.lineWidth = 5;
        c.stroke();
        c.closePath();
        c.globalAlpha = 1.1;
      }
    }
  }


  Clear(size: Rectangle): void {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 1);
    this.context.clearRect(0, 0, size.width, size.height);
    this.context.restore();
  }

  DrawTextCenter(text: string, area: Rectangle, z: number, translation: Vector, font: string, color: string): void {
    const size = this.context.measureText(text);
    this.context.textAlign = 'center';
    this.DrawText(text, new Point(area.width / 2 - translation.x, 0, z - translation.y), font, color);
    this.context.textAlign = 'left';

  }

  DrawText(text: string, position: Point, font: string, color: string): void {
    const c = this.context;
    c.font = font;
    c.lineWidth = 3;
    c.strokeStyle = 'rgba(170,170,170,0.5)';
    c.strokeText(text, position.x, position.z);
    c.fillStyle = color;
    c.fillText(text, position.x, position.z);
  }

  CenterPosition(size: Rectangle, area: Rectangle, translation: Vector): Point {
    return new Point((area.width - size.width) / 2 - translation.x, 0, (area.height - size.height) / 2 - translation.y);
  }

  DrawProgressBar(position: Point, size: Rectangle, progress: number, color: string): void {
    const c = this.context;
    const strokeSize = 3;
    c.fillStyle = '#FFFFFF';
    c.fillRect(position.x, position.z, size.width, size.height);
    c.fillStyle = color;
    c.fillRect(position.x, position.z, size.width * progress, size.height);
    c.strokeStyle = 'rgba(0,0,0,0.3)';
    c.lineWidth = strokeSize;
    c.strokeRect(position.x, position.z, size.width, size.height);
  }

  DrawGameOver(score: number, size: Rectangle): void {
    const c = this.context;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = '#000000';
    c.fillRect(0, 0, size.width, size.height);
    this.DrawTextCenter(`Score: ${score}`, size, 600, new Vector(0, 0), '18pt Century Gothic', '#FFFFFF');
    this.DrawTextCenter(`Appuyez sur 'A' pour réessayer`, size, 460, new Vector(0, 0), '16pt Century Gothic', '#FFFFFF');
    this.DrawTextCenter(`GAME OVER`, size, 400, new Vector(0, 0), '26pt Century Gothic', '#FFFFFF');
  }


}

@Injectable({
  providedIn: 'root',
  useClass: DrawingService
})
export abstract class IDrawingService {
  context: CanvasRenderingContext2D;

  abstract Draw(objects: Object[]): void;

  abstract DrawTextCenter(text: string, area: Rectangle, z: number, translation: Vector, font: string, color: string): void;

  abstract DrawText(text: string, position: Point, font: string, color: string): void;

  abstract Clear(size: Rectangle): void;

  abstract CenterPosition(size: Rectangle, area: Rectangle, translation: Vector): Point;

  abstract DrawProgressBar(position: Point, size: Rectangle, progress: number, color: string): void;

  abstract DrawGameOver(score: number, size: Rectangle): void;

}


