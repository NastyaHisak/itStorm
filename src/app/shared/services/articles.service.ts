import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ArticlesArrayType} from "../../../types/articles.type";
import {CategoriesType} from "../../../types/categories.type";
import {DetailType} from "../../../types/detail.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }
  getTopArticles(): Observable<ArticlesArrayType[]> {
    return this.http.get<ArticlesArrayType[]>(environment.api + 'articles/top');
  }
  getArticles(params: ActiveParamsType): Observable<{count: number, pages: number, items: ArticlesArrayType[]}>{
    return this.http.get<{count: number, pages: number, items: ArticlesArrayType[]}>(environment.api + 'articles', {
      params: params
    });
  }
  getCategories(): Observable<CategoriesType[]> {
    return this.http.get<CategoriesType[]>(environment.api + 'categories');
  }

  getArticle(url: string): Observable<DetailType> {
    return this.http.get<DetailType>(environment.api + 'articles/' + url);
  }
  getRelatedArticles(url: string): Observable<ArticlesArrayType[]> {
    return this.http.get<ArticlesArrayType[]>(environment.api + 'articles/related/' + url);
  }
}
