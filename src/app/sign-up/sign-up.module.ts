import {NgModule} from "@angular/core";
import {SignUpComponent} from "./sign-up.component";
import {RouterModule, Routes} from "@angular/router";
import {SignUpRoutingModule} from "./sign-up-routing.module";
import {AuthService} from "../services/auth.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  imports: [
    SignUpRoutingModule, FormsModule, ReactiveFormsModule
  ],
  exports: [SignUpComponent],
  declarations: [SignUpComponent],
  providers: [AuthService]
})
export class SignUpModule {}
