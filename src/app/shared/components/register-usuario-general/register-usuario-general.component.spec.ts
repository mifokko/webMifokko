import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUsuarioGeneralComponent } from './register-usuario-general.component';

describe('RegisterUsuarioGeneralComponent', () => {
  let component: RegisterUsuarioGeneralComponent;
  let fixture: ComponentFixture<RegisterUsuarioGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterUsuarioGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUsuarioGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
