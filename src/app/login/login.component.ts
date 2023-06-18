import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  login: string = 'ivanov@mail.ruu';
  password: string = '12345';
  loginError: string = '';

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      "login": [this.login],
      "password": [this.password]
    });
  }

  logIn(value: any) {
    this.authService.login(value.login, value.password).subscribe(res => {
      localStorage.setItem("role", res.object.client.role);
      this.router.navigate(['classifications']);
      }, error => {
      this.loginError = error.error.status.description;
      }
    );
  }

}
