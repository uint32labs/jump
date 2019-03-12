import {injectArgs} from '@angular/core/src/di/injector';
import {Inject, Injectable} from '@angular/core';
import {Time} from '@angular/common';

export class TimeService implements ITimeService {
  public multiplier = 1;
  constructor() {
  }

  GetCoefficient(delta: number): number {
    return this.multiplier * (144 / 1000 * delta);
  }

  GetTimestamp(): number {
    return Date.now();
  }


}

@Injectable({
  providedIn: 'root',
  useClass: TimeService
})
export abstract class ITimeService {
  constructor() {
  }

  abstract GetCoefficient(delta: number): number;

  abstract GetTimestamp(): number;
}
