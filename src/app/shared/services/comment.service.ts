import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {CommentType} from "../../../types/comment.type";
import {ActionsType} from "../../../types/actions.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  addComment(text: string, article: string, accessToken: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {text, article}, {
      headers: {'x-auth': accessToken},
    });
  }

  getMoreComments(id: string, offsetCount: number): Observable<CommentType> {
    return this.http.get<CommentType>(environment.api + 'comments?offset=' + offsetCount + '&article=' + id);
  }

  applyAction(action: string, id: string, accessToken: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {action}, {
      headers: {'x-auth': accessToken},
    });
  }

  getActions(id: string, accessToken: string): Observable<ActionsType[] | DefaultResponseType | null> {
    return this.http.get<ActionsType[] | DefaultResponseType | null>(environment.api + 'comments/article-comment-actions?articleId=' + id, {
      headers: {'x-auth': accessToken},
    });
  }
}
