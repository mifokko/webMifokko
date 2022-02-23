import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UneteComponent } from './unete.component';

describe('UneteComponent', () => {
  let component: UneteComponent;
  let fixture: ComponentFixture<UneteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UneteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UneteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
