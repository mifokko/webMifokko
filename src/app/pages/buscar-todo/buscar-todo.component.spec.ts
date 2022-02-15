import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarTodoComponent } from './buscar-todo.component';

describe('BuscarTodoComponent', () => {
  let component: BuscarTodoComponent;
  let fixture: ComponentFixture<BuscarTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarTodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
