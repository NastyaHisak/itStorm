import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {RequestService} from "../../services/request.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  callForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^([А-Я][а-я]+\s*)+$/)]],
    phone: ['', [Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/), Validators.required]]
  });

  get name() {return this.callForm.get('name');}
  get phone() {return this.callForm.get('phone');}

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(private dialog: MatDialog,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private requestService: RequestService) {
  }

  callMe(){
    this.dialogRef = this.dialog.open(this.popup);
    this.dialogRef.backdropClick()
      .subscribe(() => {
        this.dialogRef?.close();
      });

  }
  closePopup(){
    this.dialogRef?.close();
  }

  orderConsultation(){
    if(this.callForm.valid && this.callForm.value.name  && this.callForm.value.phone){
      this.requestService.createRequest(this.callForm.value.name, this.callForm.value.phone)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if(data.error){
              this._snackBar.open('error');
              throw new Error();
            }

            this._snackBar.open('Спасибо! Мы Вам перезвоним в ближайшее время.');
          },
          error: (errorResponse: HttpErrorResponse) => {
            if(!!errorResponse.error && !!errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка. Попробуйте снова');
            }
          }
        })
    }
  }
}
