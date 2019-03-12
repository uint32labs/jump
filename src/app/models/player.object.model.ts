import {Object, ObjectTypes} from './object.model';
import {Vector} from './vector.model';
import {Rectangle} from './rectangle.model';
import {GlobalSettings} from './settings.model';
import {Point} from './point.model';

export class Player extends Object {
  public velocity = 0;
  public verticalVelocity = 0;
  public lastInputVector: Vector;
  private readonly maxSize: Rectangle;
  private readonly initialSize: Rectangle;

  constructor(public device: number, size: Rectangle, position: Point) {
    super(position);
    this.type = ObjectTypes.Player;
    this.initialSize = new Rectangle(size.width, size.height);
    this.size = size;
    this.maxSize = new Rectangle(size.width * GlobalSettings.sizeIncreaseMultiplier, size.height * GlobalSettings.sizeIncreaseMultiplier);
    this.lastInputVector = new Vector(0, 0);
    this.position.YChanged.subscribe({
      next: y => {
        const rectangle = this.CalculateSize(y);
        const diff = new Rectangle((rectangle.width - this.size.width) / 2, (rectangle.height - this.size.height) / 2);

        this.position.x -= diff.width;
        this.position.z -= diff.height;

        this.size = rectangle;
      }
    });

  }

  private CalculateSize(y: number): Rectangle {
    const width = (this.maxSize.width - this.initialSize.width) * (y / GlobalSettings.maxJumpHeight) + this.initialSize.width;
    const height = (this.maxSize.height - this.initialSize.height) * (y / GlobalSettings.maxJumpHeight) + this.initialSize.height;
    return new Rectangle(width, height);
  }
}
