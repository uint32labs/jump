import {Injectable} from '@angular/core';
import {IDrawingService} from './drawing.service';
import {Point} from '../models/point.model';
import {Rectangle} from '../models/rectangle.model';
import {IInputService} from './input.service';
import {Player} from '../models/player.object.model';
import {ITimeService} from './time.service';
import {IMapService} from './map.service';
import {Vector} from '../models/vector.model';
import {MapGenerator} from '../models/map.model';
import {IPhysicsService} from './physics.service';
import {GlobalSettings} from '../models/settings.model';
import {Plate} from '../models/plate.object.model';
import {IAiService} from './ai.service';
import {Input} from '../models/input.model';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  public context: CanvasRenderingContext2D;
  public size: Rectangle;
  public players: Player[] = [];
  public player: Player;
  private lastTime: number;

  constructor(public drawingService: IDrawingService, public inputService: IInputService, public timeService: ITimeService, public mapService: IMapService, public physicsService: IPhysicsService, public aiService: IAiService) {
    const player = new Player(0, new Rectangle(20, 20), new Point(100, 0, 200));
    player.color = '#f05050';
    player.verticalVelocity = GlobalSettings.jumpSpeed;
    player.velocity = GlobalSettings.initialVelocity;
    this.player = player;
    this.players.push(player);
    this.lastTime = timeService.GetTimestamp();
    const testMap: Plate[] = [];
    testMap.push(new Plate(new Point(20, 0, 20)));
    testMap.push(new Plate(new Point(400, 0, 400)));
    testMap[0].size = new Rectangle(100, 100);
    testMap[1].size = new Rectangle(100, 100);
    //this.mapService.LoadMap(testMap);
    //this.mapService.LoadMap(MapGenerator.GenerateGrid(new Rectangle(100, 100), new Rectangle(100000, 100000), new Point(-2500, 0, -2500), new Rectangle(150, 150)));
    //mapService.LoadMap(MapGenerator.GenerateRandom(500, new Point(-2500, 0, -2500), new Rectangle(5000, 5000)));
    this.mapService.LoadMap(MapGenerator.GenerateRandomGrid(new Rectangle(100, 100), new Point(-10000, 0, -10000), new Rectangle(210, 210), new Rectangle(190, 190), 350, 320));
    this.drawingService.context = this.context;
    setInterval(this.FPS(), 1000);
  }

  private totalTranslation = new Vector(0, 0);
  public frames = 0;
  private lastVector: Vector;
  private gameStarted = false;
  private gameOver = false;
  public score = 0;

  public Update() {
    // calculate time passed since last frame
    const delta = this.timeService.GetTimestamp() - this.lastTime;
    // clear canvas & set context
    if (this.drawingService.context !== null) {
      this.drawingService.context = this.context;
    }
    this.drawingService.Clear(this.size);
    let objs = this.mapService.DrawableObjects(this.totalTranslation, this.size);
    this.drawingService.Draw(objs);
    // loop through all players
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      let input: Input;
      if (player.device === -2) {
        input = this.aiService.CalculateInput(this.mapService.map, player);
      } else {
        input = this.inputService.GetInput(player.device);
      }

      player.verticalVelocity = this.physicsService.CalculateSpeed(player.verticalVelocity, GlobalSettings.verticalAcceleration, delta);
      player.position.y += this.physicsService.CalculatePositionDelta(player.verticalVelocity, delta);

      let inputVector = new Vector(input.axes[0], input.axes[1]);

      if (inputVector.x === 0 && inputVector.y === 0) {
        inputVector = player.lastInputVector;
      }

      player.lastInputVector = inputVector;

      const vector = this.physicsService.CalculatePositionVector(player.velocity, inputVector, delta);
      player.position.x += (vector.x);
      player.position.z += (vector.y);
      let hasColided = false;
      for (let b = 0; b < this.mapService.map.length; b++) {
        const plate = this.mapService.map[b];
        const collision = this.physicsService.IsColliding(player, plate);
        if (player.position.y <= 0) {
          if (collision) {
            hasColided = true;
            plate.strikes++;
            if (plate.strikes === GlobalSettings.maxStrikes) {
              this.mapService.map.splice(this.mapService.map.indexOf(plate), 1);
            }
          }
        }
      }

      if (player.position.y <= 0) {

        if (hasColided) {
          player.velocity += GlobalSettings.canvasAcceleration;
          this.gameStarted = true;
        }
        if (this.gameStarted && !hasColided) {
          this.gameOver = true;
        }
        player.position.y = 0;
        player.verticalVelocity = GlobalSettings.jumpSpeed;
      }
      const score = Math.round((player.velocity - GlobalSettings.initialVelocity) * 1000);
      this.score = score;
      this.drawingService.DrawTextCenter(`Score: ${score.toString()}`, this.size, 35, this.totalTranslation, '18pt Century Gothic', '#000000');

      const pbSize = new Rectangle(300, 50);
      const pbPos: Point = this.drawingService.CenterPosition(pbSize, this.size, this.totalTranslation);
      pbPos.z = this.size.height - this.totalTranslation.y - 35 - pbSize.height;
      this.drawingService.DrawProgressBar(pbPos, pbSize, player.position.y / GlobalSettings.maxJumpHeight, '#3030a0');

    }
    // draw everything
    this.drawingService.Draw(this.players);

    const translation = this.mapService.GetTranslation(this.mapService.GetRelativePosition(this.totalTranslation, this.players[0].position), this.size);
    if (translation.x !== 0 || translation.y !== 0) {
      this.context.translate(translation.x, translation.y);
      this.totalTranslation.x += translation.x;
      this.totalTranslation.y += translation.y;
    }
    this.frames += 1;
    this.lastTime = this.timeService.GetTimestamp();

    window.requestAnimationFrame(() => {
      if (this.gameOver) {
        this.GameOver();
      } else {
        this.Update();
      }
    });
  }

  public GameOver() {
    this.drawingService.DrawGameOver(this.score, this.size);
    if (this.inputService.GetInput(this.player.device).buttons[0].pressed) {
      window.location.reload();
    }
    requestAnimationFrame(() => this.GameOver());
  }

  private FPS(): void {
    console.log(this.frames);
    this.frames = 0;
  }
}

