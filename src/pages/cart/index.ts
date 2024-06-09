import cardSVG from '@Assets/icons/basket.svg';
import crossSVG from '@Assets/icons/cross.svg';
import trashSVG from '@Assets/icons/trash.svg';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import SpinerInput from '@Src/components/ui/spinner-input';
import cartController from '@Src/controllers/cart';
import Products, { ImageSize } from '@Src/controllers/products';
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

  #createContent = () => {
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
    this.#createProductList();
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };

  #createProductList = async () => {
    const list = tag({ tag: 'div', class: classes.prodList });
    const data = await cartController.getCartData();
    console.log(data);
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
}
