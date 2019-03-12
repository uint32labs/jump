export class GlobalSettings {
  public static jumpingTime = 1.5 * 1000;
  public static verticalAcceleration = -5 / (1000 * 1000);
  public static maxJumpHeight = 1.5;
 // public static jumpSpeed = (GlobalSettings.maxJumpHeight - ((GlobalSettings.verticalAcceleration / 2) * ((GlobalSettings.jumpingTime / 2) * (GlobalSettings.jumpingTime / 2)))) / (GlobalSettings.jumpingTime / 2);
  public static jumpSpeed = 3.75 / 1000;
  public static scrollPadding = 350;
  public static sizeIncreaseMultiplier = 3;
  public static canvasAcceleration = 0.03;
  public static initialVelocity = 0.25;
  public static collisionPadding = 10;
  public static maxStrikes = 3;
}
