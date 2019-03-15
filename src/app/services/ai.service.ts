import {Input} from '../models/input.model';
import {Object} from '../models/object.model';
import {Player} from '../models/player.object.model';
import {Injectable} from '@angular/core';
import {Vector} from '../models/vector.model';
import {Point} from '../models/point.model';
import {GlobalSettings} from '../models/settings.model';

export class AiService implements IAiService {
  actions: Vector[] = [];
  currentAction: Vector = new Vector(0, 0);

  CalculateInput(map: Object[], player: Player, delta: number): Input {
    if (this.actions.length === 0) {
      this.currentAction = new Vector(0, 0);
      const trajectory = player.velocity * GlobalSettings.jumpingTime;
      const obj = this.FindBestObject(map, trajectory, player.position);
      const distance = new Vector(obj.center().x - player.position.x, obj.center().z - player.position.z);
      const extraNorm = (trajectory - distance.norm()) / 2;
      const extra = new Vector(extraNorm / distance.norm() * distance.x, extraNorm / distance.norm() * distance.y);
      this.actions.push(distance);
      this.actions.push(extra);
      this.actions.push(new Vector(-extra.x, -extra.y));
    }
    const axes = [1 / this.actions[0].norm() * this.actions[0].x, 1 / this.actions[0].norm() * this.actions[0].y, 0, 0];
    this.currentAction.x += axes[0] * delta * player.velocity;
    this.currentAction.y += axes[1] * delta * player.velocity;
    const input = new Input();
    input.axes = axes;
    input.buttons = [];
    if (this.currentAction.norm() >= this.actions[0].norm()) {
      this.actions.shift();
      this.currentAction = new Vector(0, 0);
    }
    return input;

  }

  FindBestObject(map: Object[], trajectory: number, pos: Point): Object {
    let best = map[0];
    let bestDelta: number = trajectory;
    for (let i = 0; i < map.length; i++) {
      const obj = map[i];
      const center = obj.center();
      const vector = new Vector(center.x - pos.x, center.z - pos.z);
      const delta = trajectory - vector.norm();
      if (delta < bestDelta && delta > 0) {
        bestDelta = delta;
        best = obj;
      }
    }
    return best;
  }
}

@Injectable({
  providedIn: 'root',
  useClass: AiService
})
export abstract class IAiService {
  abstract CalculateInput(map: Object[], player: Player, delta: number): Input;

}



