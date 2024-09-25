import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { DetailComponent } from './detail/detail.component';
import { BlogComponent } from './blog/blog.component';
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {DatePipePipe} from "../../shared/pipes/date-pipe.pipe";


@NgModule({
  declarations: [
    DetailComponent,
    BlogComponent,
    DatePipePipe
  ],
    imports: [
        CommonModule,
        ArticleRoutingModule,
        RouterModule,
        FormsModule,
        SharedModule
    ]
})
export class ArticleModule { }
