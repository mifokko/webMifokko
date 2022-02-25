import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { UneteComponent } from '../unete/unete.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  closeResult = '';
  
  constructor(private modalService: NgbModal, private authService: AuthService) { }

  async ngOnInit() {
    console.log('Navbar');
    const user = await this.authService.getCurrentUser();
    if (user) {
      console.log('User -> ', user);
    }
  }

  options: NgbModalOptions = {
    size: 'sm',
    centered: true
  };

  openUnete(){
    this.modalService.open(UneteComponent, this.options);
  }

  openLogin( ){
    const modalRef = this.modalService.open(LoginComponent, this.options);
  }

  Salir(){
    this.authService.cerrarSesion().then(res => {
      console.log("Sesión cerrado: ", res);
    });
  }

}
