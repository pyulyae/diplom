import {NgModule} from "@angular/core";
import {ClassificationsComponent} from "./classifications.component";
import {ClassificationsRoutingModule} from "./classifications-routing.module";
import {ClassificationService} from "../services/classification.service";

@NgModule({
  imports: [ClassificationsRoutingModule],
  declarations: [ClassificationsComponent],
  exports: [ClassificationsComponent],
  providers: [ClassificationService]
})
export class ClassificationsModule {}
