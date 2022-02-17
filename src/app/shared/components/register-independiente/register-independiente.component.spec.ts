import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterIndependienteComponent } from './register-independiente.component';

describe('RegisterIndependienteComponent', () => {
  let component: RegisterIndependienteComponent;
  let fixture: ComponentFixture<RegisterIndependienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterIndependienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterIndependienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
