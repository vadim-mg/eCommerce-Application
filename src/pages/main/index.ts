import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import Banner from '@Src/components/ui/banner';
import Link from '@Src/components/ui/link';
import { AppRoutes } from '@Src/router/routes';
import ProductList from '@Src/components/logic/product-list';
import Products from '@Src/controllers/products';
import { SortingType } from '@Src/api/products';
import gamesImg from '@Assets/img/home-games.jpg';
import classes from './style.module.scss';

export default class MainPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #banner: Banner;

  #homePageContent!: BaseElement<HTMLDivElement>;

  #products: Products;

  #productList!: ProductList;

  #aboutInfo!: BaseElement<HTMLDivElement>;

  #cardsCountToDisplay!: number;

  constructor() {
    super({ containerTag: 'div', title: 'Main page' });
    this.#banner = new Banner({});
    this.#createContent();
    this.placeForBanner.node.append(this.#content.node, this.#banner.node);
    this.#products = new Products();
    this.#createHomePageContent();
    this.container.node.append(this.#homePageContent.node);
    this.#renderProductList();
    this.#createAboutInfoContent();
    this.placeForAboutInfo.node.append(this.#aboutInfo.node);
    // this.#showContent();
  }

  #createContent = () => {
    const secretLinks =
      process.env.NODE_ENV === 'development'
        ? new BaseElement<HTMLDivElement>(
            {
              tag: 'div',
              class: classes.linksContainer,
            },
            new Link({
              text: 'rs.school',
              href: 'https://rs.school',
              target: '_blank',
              class: classes.listItemSecret,
            }),
            new Link({
              text: 'example',
              href: AppRoutes.HIDDEN_EXAMPLE,
              class: classes.listItemSecret,
            }),
            new Link({ text: 'api', href: AppRoutes.HIDDEN_API, class: classes.listItemSecret }),
          )
        : new BaseElement<HTMLDivElement>({ tag: 'div' });

    this.#content = new BaseElement<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.main,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: 'MainPage' }),
      new BaseElement<HTMLDivElement>(
        { tag: 'div', class: classes.linksContainer },
        new Link({ text: 'main', href: AppRoutes.MAIN, class: classes.listItem }),
        new Link({ text: 'catalogue', href: AppRoutes.CATALOGUE, class: classes.listItem }),
        new Link({ text: 'product', href: AppRoutes.CATALOGUE, class: classes.listItem }),
        new Link({
          text: 'product/test',
          href: `${AppRoutes.CATALOGUE}/test`,
          class: classes.listItem,
        }),
        new Link({ text: 'cart', href: AppRoutes.CART, class: classes.listItem }),
        new Link({ text: 'login', href: AppRoutes.LOGIN, class: classes.listItem }),
        new Link({ text: 'signup', href: AppRoutes.SIGNUP, class: classes.listItem }),
        new Link({ text: 'error404', href: AppRoutes.NOT_FOUND, class: classes.listItem }),
        new BaseElement<HTMLSpanElement>({ tag: 'span', text: 'For authorized users: ' }),
        new Link({ text: 'profile', href: AppRoutes.PROFILE, class: classes.listItem }),
        new Link({ text: 'logout', href: AppRoutes.LOGOUT, class: classes.listItem }),
      ),
      secretLinks,
    );
  };

  #createHomePageContent = () => {
    this.#homePageContent = new BaseElement<HTMLDivElement>(
      { tag: 'div' },
      new BaseElement<HTMLHeadingElement>({
        tag: 'h2',
        text: 'New games',
        class: classes.cardsTitle,
      }),
      new BaseElement<HTMLDivElement>(
        { tag: 'div', class: classes.cardsContainer },
        (this.#productList = new ProductList(
          { class: classes.products },
          {
            products: this.#products,
            onAddToCartCb: () => this.header.refreshCountInCartElement,
          },
        )),
      ),
    );
  };

  #renderProductList = async () => {
    this.setCardCountByScreenWidth();
    this.#productList.showProducts({
      categoryId: 'all-categories-id',
      search: '',
      filter: {
        'age-from': [],
        brand: [],
        'min-number-of-players-start': 1,
        'min-number-of-players-end': 3,
        'max-number-of-players-start': 4,
        'max-number-of-players-end': 10,
      },
      sortingType: SortingType['name-asc'],
      limit: this.#cardsCountToDisplay,
      isClear: false,
    });
  };

  #createAboutInfoContent = () => {
    this.#aboutInfo = tag<HTMLDivElement>(
      { tag: 'div', class: classes.aboutInfo },
      tag<HTMLHeadingElement>({ tag: 'h2', text: 'About us', class: classes.aboutTitle }),
      tag<HTMLDivElement>(
        { tag: 'div', class: classes.aboutContentWrapper },
        tag<HTMLDivElement>(
          { tag: 'div', class: classes.imageWrapper },
          tag<HTMLImageElement>({ tag: 'img', src: gamesImg, alt: 'Games image' }),
        ),
        tag<HTMLDivElement>(
          { tag: 'div', class: classes.textWrapper },
          tag<HTMLParagraphElement>({
            tag: 'p',
            text: 'Welcome to our cosy corner of board adventures!',
            class: classes.firstSentence,
          }),
          tag<HTMLParagraphElement>({
            tag: 'p',
            text: 'We are your new favourite board game shop, where every move is a step towards new experiences and fun. Together we explore endless worlds of fantasy, uncover strategies and win the hearts of friends and family.',
          }),
          tag<HTMLParagraphElement>({
            tag: 'p',
            text: 'Immerse yourself in the world of board games with us, where every purchase is an invitation to exciting adventures. From classic board games to the newest releases, we have everything you need for unforgettable evenings with loved ones.',
          }),
          tag<HTMLParagraphElement>({
            tag: 'p',
            text: 'Join us today and discover the joy of play, inspiration and the opportunity to create memories that will live long in your heart. Welcome to our world of board games!',
          }),
          tag<HTMLParagraphElement>({
            tag: 'p',
            text: 'With love from the team, Dice and Meeple',
            class: classes.teamMessage,
          }),
        ),
      ),
    );
  };

  setCardCountByScreenWidth = () => {
    this.#cardsCountToDisplay = MainPage.getCardCountByScreenWidth(window.screen.width);
  };

  static getCardCountByScreenWidth = (screenWidth: number): number => {
    switch (true) {
      case screenWidth >= 1416:
        return 8;
      case screenWidth > 712:
        return 6;
      default:
        return 5;
    }
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
