import {Object, ObjectTypes} from './object.model';
import {Point} from './point.model';
import {Rectangle} from './rectangle.model';
import {Plate} from './plate.object.model';

export class MapGenerator {
  static GenerateRandom(elements: number, origin: Point, size: Rectangle): Object[] {
    const map: Object[] = [];
    for (let i = 0; i < elements; i++) {
      const obj = new Plate(new Point(this.Random(origin.x, origin.x + size.width), 0, this.Random(origin.z, origin.z + size.height)));
      obj.size = new Rectangle(100, 100);
      map.push(obj);
    }
    return map;
  }

  static GenerateGrid(dimensions: Rectangle, size: Rectangle, origin: Point, elementSize: Rectangle): Plate[] {
    const spacingRect = new Rectangle(0, 0);
    spacingRect.width = (size.width - elementSize.width * dimensions.width) / dimensions.width;
    spacingRect.height = (size.height - elementSize.height * dimensions.height) / dimensions.height;
    const map: Plate[] = [];
    for (let i = 0; i < dimensions.width; i++) {
      for (let b = 0; b < dimensions.height; b++) {
        const obj = new Plate(new Point((spacingRect.width + elementSize.width) * i + origin.x, 0, (spacingRect.width + elementSize.width) * b + origin.z));
        obj.size = elementSize;
        map.push(obj);
      }
    }
    return map;
  }

  static GenerateRandomGrid(dimensions: Rectangle, origin: Point, elementSizeMax: Rectangle, elementSizeMin: Rectangle, spacingMax: number, spacingMin: number): Plate[] {
    const map: Plate[] = [];
    let lastPlate: Plate = new Plate(new Point(0, 0, 0));
    lastPlate.size = new Rectangle(130, 130);
    for (let i = 0; i < dimensions.width; i++) {
      for (let b = 0; b < dimensions.height; b++) {
        const spacing = this.Random(spacingMin, spacingMax);
        const elementSize = new Rectangle(this.Random(elementSizeMin.width, elementSizeMax.width), this.Random(elementSizeMin.height, elementSizeMax.height));
        const obj = new Plate(new Point((spacing + elementSize.width) * i + origin.x, 0, (spacing + elementSize.width) * b + origin.z));
        obj.size = elementSize;
        map.push(obj);
        lastPlate = obj;
      }
    }
    return map;
  }

  static Random(from: number, to: number): number {
    return (Math.floor(Math.random() * (to - from)) + from);
  }
}

