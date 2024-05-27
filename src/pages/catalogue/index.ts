import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import CategoryList from '@Src/components/logic/category-list';
import ProductList from '@Src/components/logic/product-list';
import productCategories from '@Src/controllers/categories';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import classes from './style.module.scss';

export default class CataloguePage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #productList!: ProductList;

  #filters!: BaseElement<HTMLDivElement>;

  #categorySection!: BaseElement<HTMLDivElement>;

  #header!: BaseElement<HTMLHeadingElement>;

  constructor(categoryPathPart: string[]) {
    super({ containerTag: 'main', title: 'catalogue page', showBreadCrumbs: true });
    productCategories.getCategories().then(() => {
      const currentCategoryId = productCategories.routeExist(categoryPathPart[0]) ?? '';
      if (categoryPathPart.length && !currentCategoryId) {
        Router.getInstance().route(AppRoutes.NOT_FOUND, false);
      }
      const backendCategoryId =
        currentCategoryId === productCategories.CATEGORY_ALL.id
          ? productCategories.CATEGORY_ALL.id
          : currentCategoryId;
      this.#createContent(backendCategoryId);
      this.container.node.append(this.#content.node);
    });
  }

  #onCategorySelectHandler = (id: string) => {
    Router.getInstance().changeCurrentRoute(productCategories.getById(id)?.key ?? '');
    this.#productList.showProducts(id);
    this.#header.node.textContent =
      productCategories.getById(id)?.name?.[process.env.LOCALE] ?? '';
  };

  #createContent = (currentCategoryId: string) => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.catalogue,
      },

      // category list
      (this.#categorySection = new CategoryList(
        { class: classes.categories },
        this.#onCategorySelectHandler,
        currentCategoryId,
      )),
      // header
      (this.#header = tag({
        tag: 'h1',
        text: productCategories.getById(currentCategoryId)?.name?.[process.env.LOCALE],
        class: classes.header,
      })),
      // main block
      tag(
        { tag: 'div', class: classes.contentSection },
        // filters
        (this.#filters = tag<HTMLDivElement>({
          tag: 'div',
          text: 'filters',
          class: classes.filters,
        })),
        // products
        (this.#productList = new ProductList({ class: classes.products }, currentCategoryId)),
      ),
    );
  };
}
