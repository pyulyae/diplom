import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {FileService} from "../services/file.service";
import {LanguageService} from "../services/language.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Document} from "./document.model";
import {Language} from "./language.model";
import {Classification} from "../classifications/classification.model";
import {ClassificationService} from "../services/classification.service";
import {i18nMetaToJSDoc} from "@angular/compiler/src/render3/view/i18n/meta";
import {AuthService} from "../services/auth.service";
import {Role} from "../login/user-role.enum";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css', 'popup.scss']
})
export class DocumentsComponent implements OnInit, AfterViewInit {
  popupWindowUploadFile!: Element | null;
  popupWindowDownloadFile!: Element | null;
  popupWindowUpdate!: Element | null;
  popupWindowDelete!: Element | null;
  popupWindowAvailTranslateWindow!: Element | null;
  popupWindowUnavailableTranslateWindow!: Element | null;
  popupWindowCloseBtns!: NodeListOf<Element>;
  popupWindowCancelBtns!: NodeListOf<Element>;
  popupAddLangBtn!: Element | null;
  popupWindowUploadFileConfirmBtn!: Element | null;
  uploadFileBtn!: Element | null;
  downloadFileBtns!: NodeListOf<Element>;
  deleteFileBtns!: NodeListOf<Element>;
  updateFileBtns!: NodeListOf<Element>;

  documents: Array<Document> = [];
  languages: Array<Language> = [];
  classifications: Array<Classification> = [];
  selectedLanguage!: Language | null;
  selectedClassification!: Classification | null;
  inputFile: File | undefined;
  selectedDocument!: Document | null;

  availableLanguages: Array<Language> = [];
  searchString: string = '';
  searchClassification!: number | null;

  errorMessage: string = '';

  role = Role;
  currentRole: string = '';
  sortDirect: boolean = true;


  constructor(private fileService: FileService,
              private languagesService: LanguageService,
              private classificationService: ClassificationService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.currentRole = localStorage.getItem("role")!.toString();
    this.route.params
      .subscribe(params => {
        this.searchClassification = +params['classificationId'];
      });
    this.getFiles();
    this.languagesService.getLanguages()
      .subscribe(languages => {
        this.languages = languages.list.map((language: any) => {
          return new Language(language);
        })
      });
    this.classificationService.getClassifications()
      .subscribe(classifications => {
        this.classifications = classifications.list.map((classification: any) => {
          return new Classification(classification);
        });
        if (this.searchClassification) {
          this.selectClassification(this.classifications.filter(c => c.entityId === this.searchClassification)[0]);
        }
      });
  }

  loadAllSelectors() {
    this.popupWindowUploadFile = document.querySelector("#upload-popup");
    this.popupWindowDownloadFile = document.querySelector("#download-popup");
    this.popupWindowUpdate = document.querySelector("#update-popup");
    this.popupWindowDelete = document.querySelector("#delete-popup");
    this.popupWindowAvailTranslateWindow = document.querySelector("#translate-available-popup");
    this.popupWindowUnavailableTranslateWindow = document.querySelector(
      "#translate-unavailable-popup",
    );

    this.popupWindowCloseBtns = document.querySelectorAll(".popup__close-btn");
    this.popupWindowCancelBtns = document.querySelectorAll(".popup__cancel-btn");
    this.popupAddLangBtn = document.querySelector(".popup__add-lang-btn");

    this.popupWindowUploadFileConfirmBtn = this.popupWindowUploadFile!.querySelector(".popup__confirm-btn");

    this.uploadFileBtn = document.querySelector(".content-menu-btn-file");
    this.downloadFileBtns = document.querySelectorAll(".file-item-menu__download-btn");
    this.deleteFileBtns = document.querySelectorAll(".file-item-menu__delete-btn");
    this.updateFileBtns = document.querySelectorAll(".file-item-menu__update-btn");

    this.uploadFileBtn?.addEventListener("click", (e) => {
      this.openPopupWindow(this.popupWindowUploadFile);
    });

    this.popupWindowCloseBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let target = e.target as HTMLElement
        this.closePopupWindow(target.closest(".popup-window"));
      });
    });

    this.downloadFileBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.openPopupWindow(this.popupWindowDownloadFile);
      });
    });

    // this.popupWindowUploadFileConfirmBtn!.addEventListener("click", () => {
    //   if (!this.errorMessage) {
    //     this.closePopupWindow(this.popupWindowUploadFile);
    //     this.openPopupWindow(this.popupWindowUpdate);
    //   }
    // });

    this.popupWindowCancelBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let target = e.target as HTMLElement
        this.closePopupWindow(target.closest(".popup-window"));
      });
    });

    this.deleteFileBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.openPopupWindow(this.popupWindowDelete);
      });
    });

    this.updateFileBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.openPopupWindow(this.popupWindowAvailTranslateWindow);
      });
    });

    this.popupAddLangBtn!.addEventListener("click", () => {
      this.openPopupWindow(this.popupWindowUnavailableTranslateWindow);
      this.closePopupWindow(this.popupWindowAvailTranslateWindow);
    });
  }

  ngAfterViewInit() {
    this.loadAllSelectors();
    /*Dropdown Menu*/
    $(".dropdown").click(function () {
      $(this).attr("tabindex", 1).focus();
      $(this).toggleClass("active");
      $(this).find(".dropdown-menu").slideToggle(300);
    });
    $(".dropdown").focusout(function () {
      $(this).removeClass("active");
      $(this).find(".dropdown-menu").slideUp(300);
    });
    $(".dropdown .dropdown-menu li").click(function () {
      $(this).parents(".dropdown").find("span").text($(this).text());
      $(this).parents(".dropdown").find("input").attr("value", $(this).attr("id") as string);
    });
  }

  closePopupWindow(popupSelector: Element | null) {
    popupSelector!.classList.add("popup-window--hidden");
    this.selectedLanguage = null;
    this.errorMessage = '';
    this.inputFile = undefined;
    // this.selectedDocument = null;
  }

  openPopupWindow(popupSelector: any) {
    popupSelector.classList.remove("popup-window--hidden");
    window.addEventListener("click", (e) => {
      this.closePopupWindowClick(e, popupSelector);
    });
    window.addEventListener("keydown", (e) => {
      this.closePopupWindowByEsc(e, popupSelector);
    });
  }

  closePopupWindowClick(e: any, popupWindow: any) {
    if (e.target == popupWindow) {
      this.closePopupWindow(popupWindow);
    }
  }

  closePopupWindowByEsc(e: any, popupWindow: any) {
    if (e.key === "Escape") {
      this.closePopupWindow(popupWindow);
    }
  }

  selectLanguage(language: any) {
    this.selectedLanguage = language;
    this.errorMessage = '';
  }

  selectClassification(classification: Classification) {
    this.selectedClassification = classification;
    this.errorMessage = '';
  }

  onFileSelected(event: any) {
    this.inputFile = event.target.files[0];
    this.errorMessage = '';
  }

  saveFile() {
    this.fileService.saveFile(this.inputFile, this.selectedClassification!.entityId!, this.selectedLanguage!.entityId!)
      .subscribe(complete => {
        this.getFiles();
        this.inputFile = undefined;
        this.closePopupWindow(this.popupWindowUploadFile);
        this.openPopupWindow(this.popupWindowUpdate);
      }, error => {
        this.errorMessage = error.error.status.description;
      });
  }

  addFileTranslation() {
    this.fileService.addFileTranslation(this.inputFile, this.selectedDocument!.entityId!, this.selectedLanguage?.entityId!)
      .subscribe(() => {
        this.getFiles();
        this.closePopupWindow(this.popupWindowUnavailableTranslateWindow);
        this.openPopupWindow(this.popupWindowUpdate);
        this.inputFile = undefined;
      }, error => {
        this.errorMessage = error.error.status.description;
      })
  }

  deleteFile() {
    this.fileService.deleteFile(this.selectedDocument!.entityId!).subscribe(() => {
      this.closePopupWindow(this.popupWindowDelete);
      this.closePopupWindow(this.popupWindowAvailTranslateWindow);
      this.getFiles();
    });
  }

  deleteFileByLanguage(languageId: number | undefined) {
    this.fileService.deleteFileByLanguage(this.selectedDocument!.entityId!, languageId ? languageId : 1).subscribe(() => {
      this.selectedDocument?.setLanguages(this.selectedDocument?.languages.filter(language => language.entityId !== languageId));
      this.closePopupWindow(this.popupWindowDelete);
      this.getFiles();
    });
  }

  getFiles(searchString: string = this.searchString) {
    this.searchString = searchString;
    this.fileService.getFiles()
      .subscribe(documents => {
        this.documents = documents.list.map((document: any) => {
          return new Document(document);
        });
        this.documents = this.documents.filter((document: Document) =>
          this.searchString === '' || document!.name!.toLowerCase().includes(this.searchString.toLowerCase())
        );
        if (this.searchClassification) {
          this.documents = this.documents.filter((document: Document) => document!.classification!.entityId === this.searchClassification);
        }
      });
  }

  downloadFile(closePopup: boolean = true) {
    this.fileService.downloadFile(this.selectedDocument?.entityId!, this.selectedDocument?.languages[0]?.entityId!)
      .subscribe(data => {
        if (closePopup) {
          this.closePopupWindow(this.popupWindowDownloadFile);
        }
      });
  }

  downloadFileByLanguage(languageId: number | undefined, closePopup: boolean = true) {
    this.fileService.downloadFile(this.selectedDocument?.entityId!, languageId ? languageId : 1)
      .subscribe(data => {
        if (closePopup) {
          this.closePopupWindow(this.popupWindowDownloadFile);
        }
      });
  }

  selectFile(document: Document) {
    this.selectedDocument = document;
    this.getAvailableLanguages();
    this.errorMessage = '';
  }

  getAvailableLanguages() {
    this.fileService.getFreeLanguages(this.selectedDocument!.entityId!)
      .subscribe(languages => {
        this.availableLanguages = languages.list.map((language: any) => {
          return new Language(language);
        })
      })
  }

  isLanguageOk(document: Document | null): boolean {
    return !!document?.languages[0]?.name;
  }

  getLanguage(document: Document | null): string {
    return document!.languages[0]!.name!;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/'])
    })
  }

  sortObjects() {
    this.documents.sort((a, b) => a.name! > b.name! ? 1 : -1);
    if (!this.sortDirect) {
      this.documents.reverse();
    }
    this.sortDirect = !this.sortDirect;
  }


}
