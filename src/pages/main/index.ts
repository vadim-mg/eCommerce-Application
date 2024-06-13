import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import Banner from '@Src/components/ui/banner';
import Link from '@Src/components/ui/link';
import { AppRoutes } from '@Src/router/routes';
import ProductList from '@Src/components/logic/product-list';
import Products from '@Src/controllers/products';
import { SortingType } from '@Src/api/products';
import classes from './style.module.scss';

export default class MainPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #banner: Banner;

  #homePageContent!: BaseElement<HTMLDivElement>;

  #products: Products;

  #productList!: ProductList;

  constructor() {
    super({ containerTag: 'div', title: 'Main page' });
    this.#banner = new Banner({});
    this.#createContent();
    this.placeForBanner.node.append(this.#content.node, this.#banner.node);
    this.#products = new Products();
    this.#createHomePageContent();
    this.container.node.append(this.#homePageContent.node);
    this.#renderProductList();

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
        { tag: 'div' },
        this.#productList = new ProductList(
          { class: classes.products },
          {
            products: this.#products,
            onAddToCartCb: () => this.header.refreshCountInCartElement,
          },
        ),
      ),
    );
  };

  #renderProductList = async () => {
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
      limit: 8,
      isClear: false,
    });
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
