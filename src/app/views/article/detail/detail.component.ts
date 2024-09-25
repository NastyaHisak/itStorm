import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DetailType} from "../../../../types/detail.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {AuthService} from "../../../core/auth/auth.service";
import {environment} from "../../../../environments/environment";
import {ArticlesArrayType} from "../../../../types/articles.type";
import {CommentService} from "../../../shared/services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentArrayType, CommentType} from "../../../../types/comment.type";
import {ActionsType} from "../../../../types/actions.type";
import {LoaderService} from "../../../shared/services/loader.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  article!: DetailType;
  comments!: CommentArrayType[];
  articles: ArticlesArrayType[] = [];
  actions: ActionsType[] = [];
  serverStaticPath: string = environment.serverStaticPath;
  isLogged: boolean = false;
  textarea: string = '';
  offset: number = 0;


  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private articlesService: ArticlesService,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private commentService: CommentService,
              private loaderService: LoaderService) {
    this.isLogged = this.authService.getIsLoggedIn();

  }

  ngOnInit() {
    this.loaderService.show();

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });
    this.activatedRoute.params.subscribe(params => {
      this.articlesService.getArticle(params['url'])
        .subscribe((data: DetailType) => {
          this.article = data;
          this.comments = data.comments;
          if (this.comments) {
            let accessToken: string | null = this.authService.getTokens().accessToken!.toString();
            this.getActions(this.article.id, accessToken);
          }
        });

      this.articlesService.getRelatedArticles(params['url'])
        .subscribe((data: ArticlesArrayType[]) => {
          this.articles = data;
          this.loaderService.hide();

        })
    });
  }


  getActions(id: string, accessToken: string) {
    this.commentService.getActions(id, accessToken)
      .subscribe({
        next: (data: ActionsType[] | DefaultResponseType | null) => {
          if ((data as DefaultResponseType).error) {
            this._snackBar.open((data as DefaultResponseType).message);
            throw new Error();
          }
          if ((data as ActionsType[]).length > 0) {
            this.actions = data as ActionsType[];
          }

          this.actions.forEach(item2 => {
            this.comments.find(item1 => {
              if(item1.id === item2.comment){
                item1.action = item2.action;
              }
            });
          })
          this.router.navigate(['/articles/' + this.article.url]);


        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка, попробуйте позже');

          }
        }
      })

  }

  applyAction(action: string, id: string) {
    if(!this.isLogged){
      this._snackBar.open("Чтобы оставить реакцию, пожалуйста, войдите или зерегестрируйтесь");
    }

    if (this.comments && this.comments.length > 0) {
      let accessToken: string | null = this.authService.getTokens().accessToken!.toString();
      this.commentService.applyAction(action, id, accessToken)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message);
              throw new Error();
            }

            this.activatedRoute.params.subscribe(params => {
              this.articlesService.getArticle(params['url'])
                .subscribe((data: DetailType) => {
                  this.comments = data.comments;
                  if (this.comments) {
                    let accessToken: string | null = this.authService.getTokens().accessToken!.toString();
                    this.getActions(this.article.id, accessToken);
                  }
                });
            });


            this._snackBar.open(data.message);
            this.router.navigate(['/articles/' + this.article.url]);

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка, попробуйте позже');
            }
          }
        })
    }
  }

  addComment(text: string, article: string) {

    let accessToken: string | null = this.authService.getTokens().accessToken!.toString();
    this.commentService.addComment(text, article, accessToken)
      .subscribe({
        next: (data: DefaultResponseType) => {
          if (data.error) {
            this._snackBar.open(data.message);
            throw new Error();
          }
          this.activatedRoute.params.subscribe(params => {
            this.articlesService.getArticle(params['url'])
              .subscribe((data: DetailType) => {
                this.comments = data.comments;
                /*if (this.comments) {
                  let accessToken: string | null = this.authService.getTokens().accessToken!.toString();
                  this.getActions(this.article.id, accessToken);
                }*/
              });
          });
          this.textarea = '';
          this._snackBar.open(data.message);
          this.router.navigate(['/articles/' + this.article.url]);

        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка, попробуйте позже');

          }
        }
      })
  }

  moreComments(id: string) {
    if (this.article.commentsCount > 3 || this.article.commentsCount < 14 && this.comments.length < (this.offset + 11)) {
      this.offset = 3;
      this.commentService.getMoreComments(id, this.offset)
        .subscribe((data: CommentType) => {
          let overlap = this.comments.find(item => item.id === data.comments[0].id)
          if (!overlap) {
            this.comments = [...this.comments, ...data.comments];
            let accessToken: string | null = this.authService.getTokens().accessToken!.toString();
            this.getActions(id, accessToken);
          } else if (this.article.commentsCount > this.comments.length) {
            this.offset += 10;
            this.commentService.getMoreComments(id, this.offset)
              .subscribe((data: CommentType) => {
                let overlap = this.comments.find(item => item.id === data.comments[0].id)
                if (!overlap) {
                  this.comments = [...this.comments, ...data.comments];
                  let accessToken: string | null = this.authService.getTokens().accessToken!.toString();
                  this.getActions(id, accessToken);
                } else {
                  return;
                }
              })
          } else {
            return;
          }
        })
    }
  }
}

