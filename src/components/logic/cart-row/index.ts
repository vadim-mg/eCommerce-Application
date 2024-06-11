import crossSVG from '@Assets/icons/cross.svg';
import trashSVG from '@Assets/icons/trash.svg';
import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import SpinerInput from '@Src/components/ui/spinner-input';
import cartController from '@Src/controllers/cart';
import Products, { ImageSize } from '@Src/controllers/products';
import classes from './style.module.scss';

const removeProdFromCart = async (id: string, quantity: number): Promise<void> => {
  await cartController.removeItemFromCart(id, quantity);
};

const addProdInCart = async (id: string): Promise<void> => {
  await cartController.addItemToCart(id);
};

export default class CartRow extends BaseElement<HTMLElement> {
  constructor(
    onChangeProductStateInCart: () => void,
    prodId: string,
    imgUrl: string,
    name: string,
    quantity: number,
    price: number,
    totalPrice: number,
    discount?: number,
  ) {
    super({
      tag: 'div',
      class: discount ? [classes.prodRow, classes.prodRowDiscount] : classes.prodRow,
    });
    // image
    const imgEl = tag(
      { tag: 'div', class: classes.prodRowImgWrapper },
      tag<HTMLImageElement>({
        tag: 'img',
        class: classes.prodRowImg,
        src: Products.getImageUrl(imgUrl ?? '', ImageSize.small),
        alt: name,
      }),
    );
    // name
    const nameEl = tag({ tag: 'div', class: classes.prodRowName, text: name });
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
            class: discount ? classes.prodRowPriceOld : classes.prodRowPrice,
            innerHTML: `€${price.toFixed(2)}`,
          }),
          // discount price
          tag({
            tag: 'div',
            class: classes.prodRowPrice,
            innerHTML: discount ? `€${discount.toFixed(2)}` : '',
          }),
        ),
        // cross icon
        tag({ tag: 'div', class: classes.prodRowCross, innerHTML: crossSVG }),

        new SpinerInput(
          quantity,
          classes.spinnerInput,
          async () => {
            await addProdInCart(String(prodId));
            onChangeProductStateInCart();
          },
          async () => {
            await removeProdFromCart(prodId, 1);
            onChangeProductStateInCart();
          },
        ),
      ),
      // total price
      tag({ tag: 'div', class: classes.prodRowTotalPrice, text: `€${totalPrice.toFixed(2)}` }),
      // trash icon
      tag({
        tag: 'div',
        class: classes.prodRowTrash,
        innerHTML: trashSVG,
        onclick: async () => {
          await removeProdFromCart(prodId, quantity);
          onChangeProductStateInCart();
        },
      }),
    );
    this.node.append(imgEl.node, nameEl.node, rightPart.node);
  }
}
