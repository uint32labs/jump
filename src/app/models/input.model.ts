export class Input {
  private _axes: number[];

  constructor() {
    this._axes = [0, 0, 0, 0];
    this.buttons = [];
  }

  public get axes(): number[] {
    return this._axes;
  }

  public set axes(input: number[]) {
    for (let i = 0; i < input.length; i++) {
      this._axes[i] = Math.round(input[i] * 10) / 10;
    }
  }

  public buttons: GamepadButton[];
}
