import cardSVG from '@Assets/icons/basket.svg';
import crossSVG from '@Assets/icons/cross.svg';
import trashSVG from '@Assets/icons/trash.svg';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import SpinerInput from '@Src/components/ui/spinner-input';
import cartController from '@Src/controllers/cart';
import Products, { ImageSize } from '@Src/controllers/products';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import { Cart } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

const createProductRow = (
  id: string,
  imgUrl: string,
  name: string,
  quantity: number,
  price: number,
  totalPrice: number,
  discount?: number,
): BaseElement<HTMLElement> => {
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

      new SpinerInput(quantity, classes.spinnerInput, () =>
        console.log(`отправляем данные о добавлении еще одного товара с ${id} и получаем !`),
      ),
    ),
    // total price
    tag({ tag: 'div', class: classes.prodRowTotalPrice, text: `€${totalPrice.toFixed(2)}` }),
    // trash icon
    tag({
      tag: 'div',
      class: classes.prodRowTrash,
      innerHTML: trashSVG,
      onclick: () => console.log(`удаляю товар с ${id}`),
    }),
  );

  const row = tag({
    tag: 'div',
    class: discount ? [classes.prodRow, classes.prodRowDiscount] : classes.prodRow,
  });
  row.node.append(imgEl.node, nameEl.node, rightPart.node);

  return row;
};

export default class CartPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'Cart', showBreadCrumbs: true });
    this.#createContent();
    this.#showContent();
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
        const firstImgUrl = item.variant.images ? item.variant.images[0].url : '';
        const price = item.price.value.centAmount / 100;
        const totalPrice = item.totalPrice.centAmount / 100;
        const priceDiscount =
          totalPrice / item.quantity !== price ? totalPrice / item.quantity : undefined;
        const row = createProductRow(
          item.id,
          firstImgUrl,
          item.name[Products.locale],
          item.quantity,
          price,
          totalPrice,
          priceDiscount,
        );
        list.node.append(row.node);
      });
    }
    this.#content.node.append(list.node);
  };

  #createRowAfterList = (price: number) => {
    // row with promo code input and total price
    const row = tag({ tag: 'div', class: classes.rowAfterList },
      // total price
      tag({ tag: 'div', class: classes.totalPriceRow, text: 'Total price:' },
        tag({ tag: 'span', class: classes.totalPrice, text: `€${price.toFixed(2)}` }))
    );
    this.#content.node.append(row.node);
  };

  #createEmptyMessage = () => {
    const message = tag({ tag: 'div', class: classes.emptyMessage },
      tag({ tag: 'p', text: 'Your cart is still empty.' }),
      new Button({ text: `Let's go get the games!` }, ButtonClasses.NORMAL, () => Router.getInstance().route(AppRoutes.CATALOGUE))
    );
    this.#content.node.append(message.node);
  };

}
