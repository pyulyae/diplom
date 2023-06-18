import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {SignUpRoutingModule} from "./sign-up/sign-up-routing.module";
import {LoginRoutingModule} from "./login/login-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {ForgotPasswordRoutingModule} from "./forgot-password/forgot-password-routing.module";
import {AuthService} from "./services/auth.service";
import { DocumentsComponent } from './documents/documents.component';
import {DocumentsRoutingModule} from "./documents/documents-routing.module";
import { ClassificationsComponent } from './classifications/classifications.component';
import {ClassificationsRoutingModule} from "./classifications/classifications-routing.module";
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import {VerifyEmailRoutingModule} from "./verify-email/verify-email-routing.module";
@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    ForgotPasswordComponent,
    DocumentsComponent,
    ClassificationsComponent,
    VerifyEmailComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    SignUpRoutingModule,
    LoginRoutingModule,
    ForgotPasswordRoutingModule,
    DocumentsRoutingModule,
    ClassificationsRoutingModule,
    VerifyEmailRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
