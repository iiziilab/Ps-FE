import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculationDataService {
  private res: any[] = [];

  constructor() {
    
  }
  public get currentData(): any {
    return this.res;
  }
  
  public set currentData(v : any) {
    this.res = v;
  }
  
}
