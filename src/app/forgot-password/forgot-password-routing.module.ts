import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ForgotPasswordComponent} from "./forgot-password.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'forgot-password', component: ForgotPasswordComponent}
    ])
  ]
})
export class ForgotPasswordRoutingModule {}
