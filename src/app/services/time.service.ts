import {injectArgs} from '@angular/core/src/di/injector';
import {Inject, Injectable} from '@angular/core';
import {Time} from '@angular/common';

export class TimeService implements ITimeService {
  constructor(@Inject('UNIT_MULTIPLIER') public multiplier: number) {
    console.log(multiplier);
  }

  GetCoefficient(delta: number): number {
    return this.multiplier * (1 / 10 * delta);
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
  constructor(@Inject('UNIT_MULTIPLIER') public multiplier: number) {
  }

  abstract GetCoefficient(delta: number): number;

  abstract GetTimestamp(): number;
}
