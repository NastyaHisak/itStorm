import {Component, Input} from '@angular/core';
import {ArticlesArrayType} from "../../../../types/articles.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {

  @Input() article!: ArticlesArrayType;
  serverStaticPath = environment.serverStaticPath;
  constructor() {
}

}
