import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  closeResult = '';
  
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openLogin(){
    const modalRef = this.modalService.open(LoginComponent);
  }
}
