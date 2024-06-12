import cardSVG from '@Assets/icons/basket.svg';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import CartRow from '@Src/components/logic/cart-row';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText from '@Src/components/ui/input-text';
import cartController from '@Src/controllers/cart';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import { Cart } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

export default class CartPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  // #loader: Loader;

  #formPromoCode!: InputText;

  constructor() {
    super({ containerTag: 'main', title: 'Cart', showBreadCrumbs: true });
    this.#createContent();
    this.#showContent();
    // this.#loader = new Loader({});
  }

  #createContent = async () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.cart,
      },
      tag(
        { tag: 'div', class: classes.h1 },
        tag({ tag: 'div', class: classes.h1Svg, innerHTML: cardSVG }),
        tag<HTMLHeadingElement>({ tag: 'h1', class: classes.h1Text, text: this.title }),
      ),
    );
    try {
      const data = await cartController.getCartData();
      console.log(data);
      if (data && data.lineItems.length > 0) {
        this.#createProductList(data);
        this.#createRowAfterList(Number(data.totalPrice.centAmount) / 100);
      } else {
        this.#createEmptyMessage();
      }
    } catch (e) {
      console.log(e);
    }
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };

  #createProductList = (data: Cart) => {
    const list = tag({ tag: 'div', class: classes.prodList });
    if (data?.lineItems ?? []) {
      data?.lineItems.forEach((item) => {
        const row = new CartRow(this.#refreshCart, item);
        list.node.append(row.node);
      });
    }
    this.#content.node.append(list.node);
  };

  #createRowAfterList = (price: number) => {
    // row with promo code input and total price
    const row = tag(
      { tag: 'div', class: classes.rowAfterList },
      this.#createPromoCodeForm(),
      // total price
      tag(
        { tag: 'div', class: classes.totalPriceRow, text: 'Total price:' },
        tag({ tag: 'span', class: classes.totalPrice, text: `€${price.toFixed(2)}` }),
      ),
    );
    this.#content.node.append(row.node);
  };

  #createEmptyMessage = () => {
    const message = tag(
      { tag: 'div', class: classes.emptyMessage },
      tag({ tag: 'p', text: 'Your cart is still empty.' }),
      new Button({ text: `Let's go get the games!` }, ButtonClasses.NORMAL, () =>
        Router.getInstance().route(AppRoutes.CATALOGUE),
      ),
    );
    this.#content.node.append(message.node);
  };

  #createPromoCodeForm = (): BaseElement<HTMLElement> => {
    const form = tag(
      { tag: 'div', class: classes.form },
      (this.#formPromoCode = new InputText(
        {
          placeholder: 'PROMOCODE',
          type: 'text',
          name: 'promocode',
          maxLength: 20,
          minLength: 2,
        },
        undefined,
      )),
      new Button({ text: 'Apply', class: classes.formButton }, ButtonClasses.NORMAL, () =>
        console.log('отправляем'),
      ),
    );
    return form;
  };

  #refreshCart = () => {
    this.#content.node.remove();
    this.#createContent();
    this.#showContent();
    this.header.refreshCountInCartElement();
  };
}
