import { getProductByKey } from '@Src/api/products';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import ProductCard from '@Src/components/logic/product-card';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import classes from './style.module.scss';

export default class ProductPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  constructor(props: string[]) {
    super({ containerTag: 'main', title: 'product page' });
    this.#createContent();
    this.#showContent();
    console.log(props);
    const productKey = props[0];
    getProductByKey(productKey)
      .then((product) => {
        console.log(product);
        // Hello! this is only for example, don't use ProductCard for page, because it is component fo catalogue.
        // But you can see how get all need params And Also you can use static properties and classes from here '@Src/controllers/products' for pictures for example
        this.#content.node.append(new ProductCard({}, product.body).node);
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 404) {
          Router.getInstance().route(AppRoutes.NOT_FOUND, false);
        }
      });
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.product,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: this.title }),
    );
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
