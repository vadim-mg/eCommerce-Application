import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import cartController from '@Src/controllers/cart';
import Products from '@Src/controllers/products';
import classes from './style.module.scss';

interface ProductInCart {
  id: string;
  el: BaseElement<HTMLElement>;
}

export default class CartPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #cartDataDebugElement!: BaseElement<HTMLDivElement>;

  #productsInCart!: ProductInCart[];

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
                text: `price: ${JSON.stringify(item.price.value.centAmount)}`,
              }),
            ).node,
        ),
      ),
    );
  }

  #createContent = () => {
    this.#createProductList();
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

  #createProductList = async () => {
    const data = await cartController.getCartData();
    if (data && data.lineItems && data.lineItems.length > 0) {
      this.#productsInCart = data.lineItems.map((item) => {
        console.log(item);

        const firstImgUrl = item.variant.images ? item.variant.images[0].url : '';
        const name = item.name[Products.locale];
        const prodQuantity = item.quantity;
        const price = item.price.value.centAmount / 100;
        const totalPrice = item.totalPrice.centAmount / 100;
        const priceDiscount = totalPrice / prodQuantity;
        const buttonTrash = new BaseElement<HTMLElement>({
          tag: 'button',
          class: classes.buttonTrash,
        });

        console.log(firstImgUrl, name, prodQuantity, price, priceDiscount, totalPrice);

        const product = {
          id: item.id,
          el: new BaseElement<HTMLElement>({ tag: 'div' }, buttonTrash),
        };

        return product;
      });
    }
  };
}
