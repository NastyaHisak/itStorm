import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticlesArrayType} from "../../../../types/articles.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {CategoriesType} from "../../../../types/categories.type";
import {ActivatedRoute, Router} from "@angular/router";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {LoaderService} from "../../../shared/services/loader.service";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticlesArrayType[] = [];
  categories: CategoriesType[] = [];
  pages: number[] = [];
  activeParams: ActiveParamsType = {categories: []};
  sortingOpen: boolean = false;
  appliedFilters: AppliedFilterType[] = [];

  constructor(private articlesService: ArticlesService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.show();
    this.articlesService.getCategories()
      .subscribe((item: CategoriesType[]) => {
        this.categories = item;
        this.updateFilterParam();
        this.loaderService.hide();
      });
  }



  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  updateFilterParam() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params['categories']) {
          this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
        }
        this.activeParams = ActiveParamsUtil.processParams(params);

        this.appliedFilters = [];
        this.activeParams.categories.forEach(url => {
            const foundType = this.categories.find(categories => categories.url === url);
            if (foundType) {
              this.appliedFilters.push({
                name: foundType.name,
                urlParam: foundType.url
              });
            }
        });

        this.articlesService.getArticles(this.activeParams)
          .subscribe((data: { count: number, pages: number, items: ArticlesArrayType[] }) => {
            if (data) {
              this.articles = data.items;
              this.pages = [];
              for (let i = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }
            }
          });
      });
  }
  updateSortingParam(url: string, checked: boolean) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);
      if (existingTypeInParams && !checked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingTypeInParams && checked) {
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else if (checked) {
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    if(!this.activeParams.page){
      this.activeParams.page = 1;
    }
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }

}
