import {Classification} from "../classifications/classification.model";
import {Language} from "./language.model";

export class Document {
  entityId: number | undefined;
  extension: string | undefined;
  fullName: string | undefined;
  name: string | undefined;
  classification: Classification | undefined;
  languages: Array<Language> = [];
  downloads: number | undefined;

  constructor(params: any) {
    if (!params) return;
    this.entityId = params.document.entityId;
    this.extension = params.document.extension;
    this.fullName = params.document.fullName;
    this.name = params.document.name;
    this.downloads = params.downloads;
    this.classification = new Classification(params.document.classification);
    this.languages = params.resources.map((language: any) => {
      return new Language(language.language);
    });
  }

  setLanguages(languages: Array<Language>) {
    this.languages = languages;
  }
}
