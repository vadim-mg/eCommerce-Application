import categoriesApi from '@Src/api/categories';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import ProductCard from '@Src/components/logic/product-card';
import Products from '@Src/controllers/products';
import classes from './style.module.scss';

export default class CataloguePage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #products: Products;

  #productList!: BaseElement<HTMLDivElement>;

  #filters!: BaseElement<HTMLDivElement>;

  #categorySection!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'catalogue page' });
    this.#products = new Products();
    this.#createContent();
    this.#showCategories();
    this.#showProducts();
    this.container.node.append(this.#content.node);
  }

  #showProducts = async () => {
    try {
      const respBody = await this.#products.all;
      this.#productList.node.innerHTML = '';
      // console.log(respBody);
      respBody.results.forEach((product) => {
        console.log(product);
        this.#productList.node.append(new ProductCard({}, product).node);
      });
    } catch (error) {
      console.log(error);
    }
  };

  #showCategories = async () => {
    try {
      const resp = await categoriesApi.getCategories();
      const categoryList = resp.body.results.map((category) => category.name['en-GB']);
      console.log(resp.body.results);
      this.#categorySection.node.append(
        tag({ tag: 'ul', text: `categories` }).node,
        ...categoryList.map(
          (categoryName: string) => tag({ tag: 'li', text: `${categoryName}` }).node,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.catalogue,
      },
      (this.#categorySection = tag<HTMLDivElement>({ tag: 'div' })),
      tag<HTMLHeadingElement>({ tag: 'h1', text: this.title }),
      tag<HTMLDivElement>(
        { tag: 'div', class: classes.contentSection },
        (this.#filters = tag<HTMLDivElement>({
          tag: 'div',
          text: 'filters',
          class: classes.filters,
        })),
        (this.#productList = tag<HTMLDivElement>({ tag: 'div' })),
      ),
    );
  };
}
