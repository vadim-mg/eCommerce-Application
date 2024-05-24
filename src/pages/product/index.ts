import { getProductByKey } from '@Src/api/products';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import classes from './style.module.scss';

export default class ProductPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  constructor(productKey: string[]) {
    super({ containerTag: 'main', title: 'product page' });
    this.#createContent();
    this.#showContent();
    console.log(productKey);
    getProductByKey(productKey[0])
      .then((product) => {
        console.log(product);
      })
      .catch(console.error);
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
