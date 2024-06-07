import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import cartController from '@Src/controllers/cart';
import Products from '@Src/controllers/products';
import classes from './style.module.scss';

export default class CartPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #cartDataDebugElement!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'cart page' });
    this.#createContent();
    this.#showContent();
    cartController.getCartData().then((cartData) =>
      this.#cartDataDebugElement.node.append(
        ...(cartData?.lineItems ?? []).map(
          (item) =>
            tag<HTMLUListElement>(
              { tag: 'ul', text: `id: ${item.id}` },
              tag<HTMLLIElement>({ tag: 'li', text: `name: ${item.name[Products.locale]}` }),
              tag<HTMLLIElement>({ tag: 'li', text: `quantity: ${item.quantity}` }),
              tag<HTMLLIElement>({
                tag: 'li',
                text: `price: ${JSON.stringify(item.price.value)}`,
              }),
            ).node,
        ),
      ),
    );
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.cart,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: this.title }),
      (this.#cartDataDebugElement = tag<HTMLDivElement>({ tag: 'div', text: `loading card` })),
    );
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
