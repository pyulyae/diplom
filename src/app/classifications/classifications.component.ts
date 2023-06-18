import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ClassificationService} from "../services/classification.service";
import {Classification} from "./classification.model";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Role} from "../login/user-role.enum";

@Component({
  selector: 'app-classifications',
  templateUrl: './classifications.component.html',
  styleUrls: ['./classifications.component.css', "../documents/documents.component.css", "../documents/popup.scss"]
})
export class ClassificationsComponent implements OnInit, AfterViewInit {
  classificationPopupWindow!: Element | null;
  classificationPopup!: Element | null;
  addClassificationBtn!: Element | null;
  popupCloseBtns!: NodeListOf<Element>;
  classificationForm!: HTMLFormElement | null;
  classificationFormCloseBtn!: Element | null;
  folderList!: Element | null;
  folderTemplate!: Node | null;

  classifications: Array<Classification> = [];
  newClassificationName: string = '';

  searchString: string = '';
  role = Role;
  currentRole: string = '';

  sortDirect: boolean = true;
  protected readonly document = document;

  constructor(private classificationsService: ClassificationService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.currentRole = localStorage.getItem("role")!.toString();
    this.getClassifications();
  }

  ngAfterViewInit() {
    this.classificationPopupWindow = document.querySelector(".popup-window-classification");
    this.classificationPopup = this.classificationPopupWindow!.querySelector(".popup");
    this.addClassificationBtn = document.querySelector(".content-menu-btn-classification");

    this.popupCloseBtns = document.querySelectorAll(".popup__close-btn");

    this.classificationForm = document.querySelector(".classification-form");
    this.classificationFormCloseBtn = this.classificationForm!.querySelector(".popup-form__cancel-btn");

    this.folderList = document.querySelector(".folders-list");

    this.folderTemplate = document.querySelector("#folder-template")!.querySelector(".folder-item");

    this.classificationFormCloseBtn!.addEventListener("click", () => {
      this.closePopupWindow(this.classificationPopupWindow);
    });

    this.addClassificationBtn?.addEventListener("click", () => {
      this.openPopupWindow(this.classificationPopupWindow);
    });

    this.popupCloseBtns.forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        let target = e.target as HTMLElement;
        const popupWindow = target.closest(".popup-window");
        this.closePopupWindow(popupWindow);
      });
    });

    this.classificationForm!.addEventListener("submit", (e) => {
      e.preventDefault();
      let target = e.target as HTMLFormElement;

      if (target.elements[0].nodeValue) {
        const date = new Date();
        this.renderFolder(
          this.createFolder(target.elements[0].nodeValue, date.toLocaleDateString().split(".").join("/")),
        );
        this.classificationForm!.reset();
        this.closePopupWindow(this.classificationPopupWindow);
      }
    });
  }

  closePopupWindow(popupSelector: any) {
    popupSelector.classList.add("popup-window--hidden");
    window.removeEventListener("click", this.closePopupWindowClick);
    window.removeEventListener("keydown", this.closePopupWindowByEsc);
  }

  openPopupWindow(popupSelector: any) {
    popupSelector.classList.remove("popup-window--hidden");
    window.addEventListener("click", this.closePopupWindowClick);
    window.addEventListener("keydown", this.closePopupWindowByEsc);
  }

  closePopupWindowClick(e: any) {
    if (e.target === this.classificationPopupWindow) {
      this.closePopupWindow(this.classificationPopupWindow);
    }
  }

  closePopupWindowByEsc(e: any) {
    if (e.key === "Escape") {
      this.closePopupWindow(this.classificationPopupWindow);
    }
  }

  createFolder(title: string, date: any) {
    const newFolder: Node = this.folderTemplate!.cloneNode(true);
    const newFolderTitle = newFolder.parentElement!.querySelector(".folder-item__heading");
    const newFolderDate = newFolder.parentElement!.querySelector(".folder-item__date");
    const newFolderDelBtn = newFolder.parentElement!.querySelector(".folder-item__delete-btn");

    newFolderTitle!.textContent = title;
    newFolderDate!.textContent = date;

    newFolderDelBtn!.addEventListener("click", () => {
      newFolder.parentElement!.remove();
    });

    return newFolder;
  }

  renderFolder(folder: any) {
    this.folderList!.append(folder);
  }

  saveClassification(name: string) {
    this.classificationsService.saveClassification(name).subscribe(() => {
      this.getClassifications();
      this.newClassificationName = '';
      this.closePopupWindow(this.classificationPopupWindow);
    });
  }

  deleteClassification(classification: Classification) {
    this.classificationsService.deleteClassification(classification.entityId!)
      .subscribe(() => {
        this.getClassifications();
      })
  }

  getClassifications(searchString: string = this.searchString) {
    this.searchString = searchString;
    this.classificationsService.getClassifications()
      .subscribe(classifications => {
        this.classifications = classifications.list.map((classification: any) => {
          return new Classification(classification);
        })
        this.classifications = this.classifications
          .filter((classification: Classification) =>
            this.searchString === '' || classification.name?.toLowerCase().includes(this.searchString.toLowerCase()));
      });
  }

  goToDocuments(classificationId: number) {
    this.router.navigate([`documents`, classificationId]);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/'])
    })
  }

  sortObjects() {
    this.classifications.sort((a, b) => a.name! > b.name! ? 1 : -1);
    if (!this.sortDirect) {
      this.classifications.reverse();
    }
    this.sortDirect = !this.sortDirect;
  }
}
