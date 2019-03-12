import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MainService} from './services/main.service';
import {Rectangle} from './models/rectangle.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'jump';
  canvasWidth = 1920;
  canvasHeight = 1080;
  @ViewChild('mainCanvas')
  canvasRef: ElementRef;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(public mainService: MainService) {

  }

  ngOnInit(): void {
    this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
    this.mainService.context = this.context;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.mainService.size = new Rectangle(this.canvasWidth, this.canvasHeight);
    window.requestAnimationFrame(() => {
      this.mainService.Update();
    });
    window.onkeyup = (ev) => {
      this.mainService.inputService.KeyUpCallback(ev);
    };
    window.onkeydown = (ev) => {
      this.mainService.inputService.KeyDownCallback(ev);
    };
  }

}
