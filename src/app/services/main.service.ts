import {Injectable} from '@angular/core';
import {IDrawingService} from './drawing.service';
import {Object} from '../models/object.model';
import {Point} from '../models/point.model';
import {Rectangle} from '../models/rectangle.model';
import {IInputService} from './input.service';
import {Player} from '../models/player.model';
import {ITimeService} from './time.service';
import {last} from 'rxjs/operators';

class Animal {
  public name: string;
}

class Dog extends Animal {
  public collar: number;
}

@Injectable({
  providedIn: 'root'
})
export class MainService {
  public context: CanvasRenderingContext2D;
  public players: Player[] = [];
  private lastTime: number;
  constructor(public drawingService: IDrawingService, public inputService: IInputService, public timeService: ITimeService) {
    const player = new Player(-1);
    player.position = new Point(20, 0, 20);
    player.size = new Rectangle(20, 20);
    this.players.push(player);
    this.lastTime = timeService.GetTimestamp();
  }

  public Update() {
    for (let i = 0; i < this.players.length; i++) {
      const coefficient = this.timeService.GetCoefficient(this.timeService.GetTimestamp() - this.lastTime);

      const input = this.inputService.GetLastInput(this.players[i].device);
      this.players[i].position.x += (coefficient * input.axes[0]);
      this.players[i].position.z += (coefficient * input.axes[1]);
    }
    this.drawingService.context = this.context;
    this.drawingService.size = new Rectangle(this.context.canvas.width, this.context.canvas.height);
    this.drawingService.Draw(this.players);
    this.lastTime = this.timeService.GetTimestamp();
    window.requestAnimationFrame(() => {
      this.Update();
    });
  }
}

