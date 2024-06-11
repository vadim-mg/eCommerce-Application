import crossSVG from '@Assets/icons/cross.svg';
import trashSVG from '@Assets/icons/trash.svg';
import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import SpinnerInput from '@Src/components/ui/spinner-input';
import cartController from '@Src/controllers/cart';
import Products, { ImageSize } from '@Src/controllers/products';
import { AppRoutes } from '@Src/router/routes';
import { LineItem } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

export default class CartRow extends BaseElement<HTMLElement> {
  #onChangeProductStateInCart: () => void;

  constructor(onChangeProductStateInCart: () => void, dataItem: LineItem) {
    super({
      tag: 'div',
      class:
        dataItem.totalPrice.centAmount / dataItem.quantity !== dataItem.price.value.centAmount
          ? [classes.prodRow, classes.prodRowDiscount]
          : classes.prodRow,
    });
    this.#onChangeProductStateInCart = onChangeProductStateInCart;
    // image
    const imgEl = tag(
      { tag: 'div', class: classes.prodRowImgWrapper },
      tag<HTMLImageElement>({
        tag: 'img',
        class: classes.prodRowImg,
        src: Products.getImageUrl(
          dataItem.variant.images ? dataItem.variant.images[0].url : '' ?? '',
          ImageSize.small,
        ),
        alt: dataItem.name[Products.locale],
      }),
    );
    // name
    console.log();
    const nameEl = tag<HTMLLinkElement>({
      tag: 'a',
      class: classes.prodRowName,
      text: dataItem.name[Products.locale],
      href: `${AppRoutes.CATALOGUE}/all/${dataItem.productKey}`, // найти ключ в дате
    });
    const rightPart = tag(
      { tag: 'div', class: classes.prodRowRight },
      // block with price for one and quantity
      tag(
        { tag: 'div', class: classes.prodRowPricesAndCount },
        tag(
          { tag: 'div', class: classes.prodRowPrices },
          // normal price
          tag({
            tag: 'div',
            class:
              dataItem.totalPrice.centAmount / dataItem.quantity !==
              dataItem.price.value.centAmount
                ? classes.prodRowPriceOld
                : classes.prodRowPrice,
            innerHTML: `€${(dataItem.price.value.centAmount / 100).toFixed(2)}`,
          }),
          // discount price
          tag({
            tag: 'div',
            class: classes.prodRowPrice,
            innerHTML:
              dataItem.totalPrice.centAmount / dataItem.quantity !==
              dataItem.price.value.centAmount
                ? `€${(dataItem.totalPrice.centAmount / 100 / dataItem.quantity).toFixed(2)}`
                : '',
          }),
        ),
        // cross icon
        tag({ tag: 'div', class: classes.prodRowCross, innerHTML: crossSVG }),

        new SpinnerInput(
          dataItem.quantity,
          classes.spinnerInput,
          this.#onPlusHandler.bind(this, String(dataItem.productId)),
          this.#onMinusHandler.bind(this, String(dataItem.productId)),
        ),
      ),
      // total price
      tag({
        tag: 'div',
        class: classes.prodRowTotalPrice,
        text: `€${(dataItem.totalPrice.centAmount / 100).toFixed(2)}`,
      }),
      // trash icon
      tag({
        tag: 'div',
        class: classes.prodRowTrash,
        innerHTML: trashSVG,
        onclick: async () => {
          try {
            await cartController.removeItemFromCart(String(dataItem.productId), dataItem.quantity);
            onChangeProductStateInCart();
          } catch (e) {
            console.log(e);
          }
        },
      }),
    );
    this.node.append(imgEl.node, nameEl.node, rightPart.node);
  }

  #onMinusHandler = async (prodId: string) => {
    try {
      await cartController.removeItemFromCart(prodId, 1);
      this.#onChangeProductStateInCart();
    } catch (e) {
      console.log(e);
    }
  };

  #onPlusHandler = async (prodId: string) => {
    try {
      await cartController.addItemToCart(prodId);
      this.#onChangeProductStateInCart();
    } catch (e) {
      console.log(e);
    }
  };
}
