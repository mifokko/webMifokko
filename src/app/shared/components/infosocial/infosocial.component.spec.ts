import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosocialComponent } from './infosocial.component';

describe('InfosocialComponent', () => {
  let component: InfosocialComponent;
  let fixture: ComponentFixture<InfosocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfosocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
