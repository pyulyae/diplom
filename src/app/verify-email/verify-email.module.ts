import {NgModule} from "@angular/core";
import {VerifyEmailRoutingModule} from "./verify-email-routing.module";
import {VerifyEmailComponent} from "./verify-email.component";
import {AuthService} from "../services/auth.service";

@NgModule({
  imports: [VerifyEmailRoutingModule],
  declarations: [VerifyEmailComponent],
  exports: [VerifyEmailComponent],
  providers: [AuthService]
})
export class VerifyEmailModule {}
