import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ClassificationsComponent} from "./classifications.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'classifications', component: ClassificationsComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ClassificationsRoutingModule {}
