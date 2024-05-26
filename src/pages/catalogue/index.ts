import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import CategoryList from '@Src/components/logic/category-list';
import ProductList from '@Src/components/logic/product-list';
import classes from './style.module.scss';

export default class CataloguePage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #productList!: ProductList;

  #filters!: BaseElement<HTMLDivElement>;

  #categorySection!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'catalogue page', showBreadCrumbs: true });
    this.#createContent();
    this.container.node.append(this.#content.node);
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.catalogue,
      },

      // category list
      (this.#categorySection = new CategoryList({ class: classes.categories })),
      // header
      tag({ tag: 'h1', text: 'All games', class: classes.header }),

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
        (this.#productList = new ProductList({ class: classes.products })),
      ),
    );
  };
}
