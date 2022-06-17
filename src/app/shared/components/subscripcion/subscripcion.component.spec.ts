import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscripcionComponent } from './subscripcion.component';

describe('SubscripcionComponent', () => {
  let component: SubscripcionComponent;
  let fixture: ComponentFixture<SubscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscripcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
