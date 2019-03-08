import {Vector} from '../models/vector.model';
import {Injectable} from '@angular/core';
import {Input} from '../models/input.model';

export class InputService implements IInputService {
  private keys: string[] = [];
  private keyMap = new KeyMap();

  GetLastInput(device: number): Input {
    if (device === -1) {
      return this.GetKeyboardInput();
    }
    return this.GetGamepadInput(device);
  }

  private GetGamepadInput(device: number): Input {
    const gamepads = navigator.getGamepads();
    const pad = gamepads[device];
    const input = new Input();
    input.buttons = pad.buttons;
    input.axes = pad.axes;
    return input;
  }

  private GetKeyboardInput(): Input {
    const output = new Input();
    for (let o = 0; o < this.keyMap.axes.length; o++) {
      for (let i = 0; i < this.keys.length; i++) {

        const index = this.keyMap.axes[o].indexOf(this.keys[i]);

        if (index === 0) {
          output.axes[o] = 1;
        } else if (index === 1) {
          output.axes[o] = -1;
        }
      }
    }
    // loop through keymap axes
    for (let i = 0; i < this.keyMap.buttons.length; i++) {
      // checks if there is a key that is pressed that matches the map's character
      const index = this.keys.indexOf(this.keyMap.buttons[i]);
      // set the button based on the if there is a character
      if (index > -1) {
        output.buttons[i] = {value: 1, pressed: true, touched: true};
      } else {
        output.buttons[i] = {value: 0, pressed: false, touched: false};
      }
    }
    return output;
  }

  public KeyDownCallback(event: KeyboardEvent): void {
    if (!this.keys.includes(event.key)) {
      this.keys.push(event.key);
    }
  }

  public KeyUpCallback(event: KeyboardEvent): void {
    const index = this.keys.indexOf(event.key);
    if (index > -1) {
      this.keys.splice(index, 1);
    }
  }
}

@Injectable({
  providedIn: 'root',
  useClass: InputService
})
export abstract class IInputService {
  abstract GetLastInput(device: number): Input;

  abstract KeyDownCallback(event: KeyboardEvent): void ;

  abstract KeyUpCallback(event: KeyboardEvent): void;
}

export class KeyMap {

  constructor(public axes?: string[][], public buttons?: string[]) {
    if (axes === undefined || axes == null) {
      this.axes = [['d', 'a'], ['s', 'w'], ['ArrowRight', 'ArrowLeft'], ['ArrowDown', 'ArrowUp']]
      ;
    }
    if (buttons === undefined || buttons == null) {
      this.buttons = ['z', 'x', 'c', 'v', ' ', 'q', 'e', 'r', 't', 'y'];
    }
  }
}
