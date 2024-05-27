import { getProductByKey } from '@Src/api/products';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
// import ProductCard from '@Src/components/logic/product-card';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import Products, { ImageSize } from '@Src/controllers/products';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import { Image, ProductProjection } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

export default class ProductPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #product!: ProductProjection;

  #productKey!: string | undefined;

  #productPrice!: number;

  #productDiscount!: number | undefined;

  #productName!: string;

  #productCurrency!: string;

  #productDescription!: string;

  #productMinPlayers!: number;

  #productMaxPlayers!: number;

  #productTypeOfGame!: string;

  #productAgeFrom!: number;

  #productBrand!: string;

  #productImages!: Image[];

  #productImagesSmall!: Image[];

  /**
   *
   * @param props // props[0] - category key, props[1] - product key
   */
  constructor(props: string[]) {
    super({ containerTag: 'main', title: 'product page', showBreadCrumbs: true });
    console.log(props);

    const productKey = props[1];
    getProductByKey(productKey)
      .then((product) => {
        // You can use static properties and classes from here '@Src/controllers/products' for pictures for example
        this.#product = product.body;
        this.#productKey = product.body.key;
        this.#productName = product.body.name['en-GB'];
        console.log(this.#product);
        if (product.body.masterVariant.prices) {
          this.#productPrice = product.body.masterVariant.prices[0].value.centAmount;
          if (product.body.masterVariant.prices[0].discounted) {
            this.#productDiscount =
              product.body.masterVariant.prices[0].discounted.value.centAmount;
          }

          this.#productCurrency = product.body.masterVariant.prices[0].value.currencyCode;
        }

        this.#productDescription = product.body.masterVariant.attributes?.find(
          (item) => item.name === 'description',
        )?.value;
        this.#productBrand = product.body.masterVariant.attributes?.find(
          (item) => item.name === 'brand',
        )?.value;
        this.#productMinPlayers = product.body.masterVariant.attributes?.find(
          (item) => item.name === 'min-number-of-players',
        )?.value;
        this.#productMaxPlayers = product.body.masterVariant.attributes?.find(
          (item) => item.name === 'max-number-of-players',
        )?.value;
        this.#productAgeFrom = product.body.masterVariant.attributes?.find(
          (item) => item.name === 'age-from',
        )?.value;
        this.#productTypeOfGame = product.body.masterVariant.attributes?.find(
          (item) => item.name === 'type-of-game',
        )?.value;
        this.#productImages = product.body.masterVariant.images as Image[];

        this.#createContent();
        this.#showContent();
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 404) {
          Router.getInstance().route(AppRoutes.NOT_FOUND, false);
        }
      });
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.product,
      },
      this.#createProductData(),
    );
  };

  #createProductData = () => {
    const wrapper = new BaseElement<HTMLElement>({ tag: 'div', class: classes.productInfo });
    const h1 = new BaseElement<HTMLHeadingElement>({
      tag: 'h1',
      class: classes.productName,
      text: this.#productName,
    });
    const priceRow = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.productPriceRow,
    });
    const priceEl = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.price,
      text: `€${String(this.#productPrice)}`,
    });
    const button = new Button(
      { text: 'Add to Cart', class: classes.button },
      ButtonClasses.NORMAL,
      () => {
        console.log('Product added to the cart');
      },
    );
    const priceWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.productPriceWrapper },
      new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.priceTitle, text: 'Price:' }),
      priceEl,
    );
    if (this.#productDiscount) {
      const discountPrice = new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.price,
        text: `€${String(this.#productDiscount)}`,
      });
      priceWrapper.node.append(discountPrice.node);
      priceEl.node.classList.add(classes.priceOld);
      h1.node.classList.add(classes.productNameSale);
    }
    priceRow.node.append(priceWrapper.node);
    priceRow.node.append(button.node);

    const brandRow = new BaseElement<HTMLDivElement>(
      { tag: 'li', class: classes.attributeRow },
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.attributeTitle,
        text: 'Brand:',
      }),
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.attribute,
        text: this.#productBrand,
      }),
    );
    const typeRow = new BaseElement<HTMLDivElement>(
      { tag: 'li', class: classes.attributeRow },
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.attributeTitle,
        text: 'Type of game:',
      }),
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.attribute,
        text: this.#productTypeOfGame,
      }),
    );
    const numberRow = new BaseElement<HTMLDivElement>(
      { tag: 'li', class: classes.attributeRow },
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.attributeTitle,
        text: 'Number of players:',
      }),
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.attribute,
        text: `${this.#productMinPlayers} - ${this.#productMaxPlayers} `,
      }),
    );
    const ageRow = new BaseElement<HTMLDivElement>(
      { tag: 'li', class: classes.attributeRow },
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.attributeTitle,
        text: 'Recommended age from:',
      }),
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.attribute,
        text: `${this.#productAgeFrom} years`,
      }),
    );
    const attributesList = new BaseElement<HTMLOListElement>(
      { tag: 'ul', class: classes.attributeList },
      brandRow,
      typeRow,
      numberRow,
      ageRow,
    );
    const desc = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.desc },
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.descTitle,
        text: 'Description:',
      }),
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.descText,
        text: this.#productDescription,
      }),
    );
    wrapper.node.append(h1.node);
    wrapper.node.append(priceRow.node);
    wrapper.node.append(attributesList.node);
    wrapper.node.append(desc.node);

    return wrapper;
  };

  #showSlider = (size: ImageSize): BaseElement<HTMLOListElement> => {
    // testing the display of product images, the slider component will be implemented in another branch
    const imagesEl = new BaseElement<HTMLOListElement>({ tag: 'ul' });
    this.#productImages.forEach((image) => {
      const url = Products.getImageUrl(image.url, size);
      const li = new BaseElement<HTMLHeadingElement>(
        { tag: 'li' },
        new BaseElement<HTMLImageElement>({ tag: 'img', src: url, alt: image.label }),
      );
      imagesEl.node.append(li.node);
    });
    return imagesEl;
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
