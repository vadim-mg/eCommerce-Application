import cardSVG from '@Assets/icons/basket.svg';
import trashSVG from '@Assets/icons/trash.svg';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import CartRow from '@Src/components/logic/cart-row';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText from '@Src/components/ui/input-text';
import Loader from '@Src/components/ui/loader';
import ModalWindow from '@Src/components/ui/modal';
import cartController, { getCartDiscountCode } from '@Src/controllers/cart';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import { Cart } from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import classes from './style.module.scss';

export default class CartPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #loader: Loader;

  #inputPromoCode!: InputText;

  #buttonPromoCode!: Button;

  #appliedPromoCodes!: BaseElement<HTMLDivElement>;

  #cartData!: Cart;

  #totalPrice!: number;

  #totalPriceOld!: number;

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
      if (data && data.lineItems.length > 0) {
        this.#cartData = data;
        this.#totalPrice = data.totalPrice.centAmount / 100;
        this.#totalPriceOld = data.discountOnTotalPrice
          ? (this.#totalPriceOld =
              (data.totalPrice.centAmount +
                data.discountOnTotalPrice.discountedAmount.centAmount) /
              100)
          : 0;
        this.#createProductList(data);
        this.#createRowAfterList(this.#totalPrice);
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
      this.#createPromoCodeForm(),
      // total price
      tag(
        { tag: 'div', class: classes.totalPriceRow, text: 'Total price:' },
        tag({
          tag: 'span',
          class: classes.totalPriceOld,
          text: this.#totalPriceOld > 0 ? `€${this.#totalPriceOld.toFixed(2)}` : '',
        }),
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
    const modal = new ModalWindow(
      classes.modal,
      true,
      tag(
        { tag: 'div', class: classes.modalWrapper },
        tag({ tag: 'h2', class: classes.modalTitle, text: 'Attention' }),
        tag({ tag: 'p', text: 'Do you want to remove all items from your shopping cart?' }),
        tag(
          { tag: 'div', class: classes.modalButtonRow },
          new Button(
            { text: 'Yes', class: classes.modalButton },
            ButtonClasses.NORMAL,
            async () => {
              await this.#clearCart();
              modal.hide();
            },
          ),
          new Button({ text: 'No', class: classes.modalButton }, ButtonClasses.NORMAL, () => {
            modal.hide();
          }),
        ),
      ),
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

  #createPromoCodeForm = (): BaseElement<HTMLElement> => {
    this.#appliedPromoCodes = tag({
      tag: 'div',
      class: classes.promoCodeMessage,
      text: '',
    });
    const form = tag(
      { tag: 'div', class: classes.form },
      (this.#inputPromoCode = new InputText(
        {
          placeholder: 'PROMOCODE',
          type: 'text',
          name: 'promocode',
          maxLength: 20,
          minLength: 2,
        },
        undefined,
      )),
      (this.#buttonPromoCode = new Button(
        { text: 'Apply', class: classes.formButton },
        ButtonClasses.NORMAL,
        this.#handlerApplyPromoCode,
      )),
    );
    const formWrapper = tag(
      { tag: 'div', class: classes.formWrapper },
      form,
      this.#appliedPromoCodes,
    );

    Promise.all(
      this.#cartData.discountCodes.map(
        async (cartDiscountCode) =>
          (await getCartDiscountCode(cartDiscountCode.discountCode.id))?.code,
      ),
    ).then((codes) => {
      if (codes.length > 0)
        this.#appliedPromoCodes.node.textContent = `Applied promo code: ${codes.join(';')}`;
      if (this.#appliedPromoCodes.node.classList.contains(classes.error))
        this.#appliedPromoCodes.node.classList.remove(classes.error);
    });

    return formWrapper;
  };

  #handlerApplyPromoCode = async () => {
    try {
      this.#inputPromoCode.setDisabled(true);
      this.#buttonPromoCode.disable();
      const cart = await cartController.applyCartDiscounts(this.#inputPromoCode.value); // - если промокод верный, ответ 200, но скидка применяется ко всей корзине.
      this.#totalPriceOld = this.#totalPrice;
      if (cart) {
        this.#appliedPromoCodes.node.textContent = await Promise.all(
          cart.discountCodes.map(
            async (cartDiscountCode) =>
              (await getCartDiscountCode(cartDiscountCode.discountCode.id))?.code,
          ),
        ).then((codes) => codes.join(';'));
        if (this.#appliedPromoCodes.node.classList.contains(classes.error))
          this.#appliedPromoCodes.node.classList.remove(classes.error);
        this.#refreshCart();
      }
    } catch (e) {
      const error = e as HttpErrorType;
      console.log(e);
      this.#appliedPromoCodes.node.textContent = error.message;
      this.#appliedPromoCodes.node.classList.add(classes.error);
    } finally {
      this.#inputPromoCode.setDisabled(false);
      this.#buttonPromoCode.enable();
    }
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
