import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { UneteComponent } from '../unete/unete.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  closeResult = '';
  
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
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

  isLogin() {
    
  }
}
