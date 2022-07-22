import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuicknoofitemComponent } from './quicknoofitem.component';

describe('QuicknoofitemComponent', () => {
  let component: QuicknoofitemComponent;
  let fixture: ComponentFixture<QuicknoofitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuicknoofitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuicknoofitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
