import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  empresaForm!: FormGroup;
  private isNIT= "^([0-9]{0,15}-[0-9]{1})?$";
  private isEmail= /\S+@\S+\.\S+/;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }
  
  private initForm(): void {
  this.empresaForm = this.fb.group({
    nombreE: ['', [Validators.required]],
    nitE: ['', [Validators.required, Validators.pattern(this.isNIT)]],
    


  })

  }
}
