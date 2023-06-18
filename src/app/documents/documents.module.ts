import {NgModule} from "@angular/core";
import {DocumentsRoutingModule} from "./documents-routing.module";
import {DocumentsComponent} from "./documents.component";
import {FileService} from "../services/file.service";
import {LanguageService} from "../services/language.service";

@NgModule({
  imports: [DocumentsRoutingModule],
  declarations: [DocumentsComponent],
  exports: [DocumentsComponent],
  providers: [FileService, LanguageService]
})
export class DocumentsModule {}
