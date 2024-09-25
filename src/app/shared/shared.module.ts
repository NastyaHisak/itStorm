import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { ArticleCardComponent } from './components/article-card/article-card.component';
import {ShortTextPipe} from "./pipes/short-text.pipe";
import { LoaderComponent } from './components/loader/loader.component';



@NgModule({
  declarations: [
    ArticleCardComponent,
    ShortTextPipe,
    LoaderComponent,

  ],
  imports: [
    CommonModule,
    MatDialogModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    ArticleCardComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
