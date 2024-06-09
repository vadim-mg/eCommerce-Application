import crossSVG from '@Assets/icons/cross.svg';
import trashSVG from '@Assets/icons/trash.svg';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import SpinerInput from '@Src/components/ui/spinner-input';
import cartController from '@Src/controllers/cart';
import Products, { ImageSize } from '@Src/controllers/products';
import classes from './style.module.scss';

const createProductRow = (id: string,
  imgUrl: string,
  name: string,
  quantity:
    number,
  price: number,
  totalPrice: number,
  discount?: number,): BaseElement<HTMLElement> => {
  const leftPart = tag({ tag: 'div', class: classes.prodRowLeft },
    // image
    tag<HTMLImageElement>({
      tag: 'img',
      class: classes.prodRowImg,
      src: Products.getImageUrl(imgUrl ?? '', ImageSize.small),
      alt: name,
    }),
    // name
    tag({ tag: 'div', class: classes.prodRowName, text: name })
  );
  const rightPart = tag({ tag: 'div', class: classes.prodRowRight },
    // block with price for one and quantity
    tag({ tag: 'div', class: classes.prodRowPrices },
      // normal price
      tag({ tag: 'div', class: discount ? classes.prodRowPriceOld : classes.prodRowPrice, innerHTML: `€${price}` }),
      // discount price
      tag({ tag: 'div', class: classes.prodRowPrice, innerHTML: discount ? `€${discount}` : '' }),

      // cross icon
      tag({ tag: 'div', class: classes.prodRowName, innerHTML: crossSVG }),

      new SpinerInput(quantity, classes.spinnerInput, () => console.log(`отправляем данные о добавлении еще одного товара с ${id} и получаем !`)),
    ),
    // total price
    tag({ tag: 'div', class: classes.prodRowTotalPrice, text: `€${totalPrice}` }),
    // trash icon
    tag({ tag: 'div', class: classes.prodRowTrash, innerHTML: trashSVG, onclick: () => console.log(`удаляю товар с ${id}`) })
  );

  const row = tag({ tag: 'div', class: classes.prodRow });
  row.node.append(leftPart.node, rightPart.node);

  return row;
};

export default class CartPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  // #cartDataDebugElement!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'Cart' });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.cart,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: this.title })
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
        const priceDiscount = totalPrice / item.quantity !== price ? totalPrice / item.quantity : undefined;
        const row = createProductRow(item.id,
          firstImgUrl,
          item.name[Products.locale],
          item.quantity,
          price,
          totalPrice,
          priceDiscount
        );
        list.node.append(row.node);
      });
    };
    this.#content.node.append(list.node);
  };


}
