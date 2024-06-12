import cardSVG from '@Assets/icons/basket.svg';
import trashSVG from '@Assets/icons/trash.svg';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import CartRow from '@Src/components/logic/cart-row';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import Loader from '@Src/components/ui/loader';
import ModalWindow from '@Src/components/ui/modal';
import cartController from '@Src/controllers/cart';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import { Cart } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

export default class CartPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #loader: Loader;

  constructor() {
    super({ containerTag: 'main', title: 'Cart', showBreadCrumbs: true });
    this.#createContent();
    this.#showContent();
    this.#loader = new Loader({});
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
        this.#createButtonClearCart();
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
      // total price
      tag(
        { tag: 'div', class: classes.totalPriceRow, text: 'Total price:' },
        tag({ tag: 'span', class: classes.totalPrice, text: `€${price.toFixed(2)}` }),
      ),
    );
    this.#content.node.append(row.node);
  };

  #createButtonClearCart = () => {
    const button = new Button(
      { text: 'Clear the Cart', class: classes.buttonClear },
      ButtonClasses.NORMAL,
      this.#showModalPrompt,
      trashSVG,
    );
    this.#content.node.append(button.node);
  };

  #showModalPrompt = () => {
    const modal = new ModalWindow(classes.modal, true,
      tag({ tag: 'div', class: classes.modalWrapper },
        tag({ tag: 'h2', class: classes.modalTitle, text: 'Attention' }),
        tag({ tag: 'p', text: 'Do you want to remove all items from your shopping cart?' }),
        tag({ tag: 'div', class: classes.modalButtonRow },
          new Button({ text: 'Remove', class: classes.modalButton }, ButtonClasses.NORMAL, async () => {
            await this.#clearCart();
            modal.hide();
          }),
          new Button({ text: 'Cancel', class: classes.modalButton }, ButtonClasses.NORMAL, () => { modal.hide(); }),
        )
      )
    );
    modal.show();
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

  #refreshCart = () => {
    this.#content.node.remove();
    this.#createContent();
    this.#showContent();
    this.header.refreshCountInCartElement();
  };

  #clearCart = async () => {
    this.#loader.show();
    await cartController.removeAllItemFromCart();
    this.#loader.hide();
    this.#refreshCart();
  };
}
