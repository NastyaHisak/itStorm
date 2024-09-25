import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {DefaultResponseType} from "../../../types/default-response.type";
import {PopupService} from "../../shared/services/popup.service";
import {ArticlesService} from "../../shared/services/articles.service";
import {ArticlesArrayType} from "../../../types/articles.type";
import {LoaderService} from "../../shared/services/loader.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  @ViewChild('inputName') inputName!: ElementRef;
  @ViewChild('inputPhone') inputPhone!: ElementRef;
  @ViewChild('typeName') typeName!: ElementRef;


  articles: ArticlesArrayType[] = [];
  orderSuccess: boolean = false;
  orderFailed: boolean = false;

  name: string = '';
  phone: string = '';
  service: string = '';
  type: string = 'order';
  frilans: boolean = false;
  dizain: boolean = false;
  smm: boolean = false;
  target: boolean = false;
  kopiraiting: boolean = false;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  };
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 20,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  };
  banners = [
    {
      pretitle: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса <span>-15%!</span>',
      text: '',
      image: 'banner-1.png',
      service: 'Продвижение',
      engService: 'target',
    },
    {
      pretitle: 'Акция',
      title: 'Нужен грамотный <span>копирайтер?</span>',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      image: 'banner-2.png',
      service: 'Копирайтинг',
      engService: 'kopiraiting'

    },
    {
      pretitle: 'Новость дня',
      title: '<span>6 место</span> в ТОП-10 SMM-агенств Москвы!',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      image: 'banner-3.png',
      service: 'Создание сайтов',
      engService: 'frilans'
    },
  ];
  reviews = [
    {
      name: 'Станислав',
      image: 'review-1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review-2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review-3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Станислав',
      image: 'review-1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review-2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review-3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
  ];

  popupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^([А-Я][а-я]+\s*)+$/)]],
    phone: ['', [Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/), Validators.required]]
  });
  get userName() {return this.popupForm.get('name');}
  get userPhone() {return this.popupForm.get('phone');}

  constructor(private articleService: ArticlesService,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private popupService: PopupService,
              private loaderService: LoaderService) {

  }
  ngOnInit(): void {
    this.loaderService.show();

    this.articleService.getTopArticles()
      .subscribe((articles: ArticlesArrayType[]) => {
        this.articles = articles;
        this.loaderService.hide();
      })
  }

  orderClose() {
    this.dialog.closeAll();
  }

  orderOpen(engService: string) {
    this.dialog.open(this.popup);
    this.frilans = false;
    this.dizain = false;
    this.smm = false;
    this.target = false;
    this.kopiraiting = false;

    switch (engService) {
      case 'Фриланс':
        this.frilans = true;
        break;
      case 'Дизайн':
        this.dizain = true;
        break;
      case 'SMM':
        this.smm = true;
        break;
      case 'Таргет':
        this.target = true;
        break;
      case 'Копирайтинг':
        this.kopiraiting = true;
        break;
    }
  }

  createOrder() {
    this.service = this.typeName.nativeElement.value
    this.name = this.inputName.nativeElement.value
    this.phone = this.inputPhone.nativeElement.value
    this.popupService.createOrder(this.name, this.phone, this.service, this.type)
      .subscribe( {
        next: (data: DefaultResponseType) => {
          if ((data as DefaultResponseType).error) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          } else {
            this.orderSuccess = true;
          }
        },
        error: (error) => {
          this.orderFailed = true;
        }
      });
  }
}
