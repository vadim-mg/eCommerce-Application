import { getProductByKey } from '@Src/api/products';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
// import ProductCard from '@Src/components/logic/product-card';
import Products, { ImageSize } from '@Src/controllers/products';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import { Image, ProductProjection } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

export default class ProductPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #product!: ProductProjection;

  #productKey!: string | undefined;

  #productPrice!: number | undefined;

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

  constructor(props: string[]) {
    super({ containerTag: 'main', title: 'product page' });
    console.log(props);
    const productKey = props[0];
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
            this.#productDiscount = product.body.masterVariant.prices[0].discounted.value.centAmount;
          }

          this.#productCurrency = product.body.masterVariant.prices[0].value.currencyCode;
        }

        this.#productDescription = product.body.masterVariant.attributes?.find((item) => item.name === 'description')?.value;
        this.#productBrand = product.body.masterVariant.attributes?.find((item) => item.name === 'brand')?.value;
        this.#productMinPlayers = product.body.masterVariant.attributes?.find((item) => item.name === 'min-number-of-players')?.value;
        this.#productMaxPlayers = product.body.masterVariant.attributes?.find((item) => item.name === 'max-number-of-players')?.value;
        this.#productAgeFrom = product.body.masterVariant.attributes?.find((item) => item.name === 'age-from')?.value;
        this.#productTypeOfGame = product.body.masterVariant.attributes?.find((item) => item.name === 'type-of-game')?.value;
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
        tag: 'main',
        class: classes.product,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: this.#productName }),
      new BaseElement<HTMLOListElement>({ tag: 'ul' },
        tag<HTMLHeadingElement>({ tag: 'li', text: `Title: ${this.#productName}` }),
        this.#showImages(ImageSize.thumb),
        tag<HTMLHeadingElement>({ tag: 'li', text: `Price: ${String(this.#productPrice)}` }),
        tag<HTMLHeadingElement>({ tag: 'li', text: `Sale price: ${String(this.#productDiscount)}` }),
        tag<HTMLHeadingElement>({ tag: 'li', text: `Currency: ${String(this.#productCurrency)}` }),
        tag<HTMLHeadingElement>({ tag: 'li', text: `TypeOfGame: ${String(this.#productTypeOfGame)}` }),
        tag<HTMLHeadingElement>({ tag: 'li', text: `MinPlayers: ${String(this.#productMinPlayers)}` }),
        tag<HTMLHeadingElement>({ tag: 'li', text: `MaxPlayers: ${String(this.#productMaxPlayers)}` }),
        tag<HTMLHeadingElement>({ tag: 'li', text: `AgeFrom: ${String(this.#productAgeFrom)}` }),
        tag<HTMLHeadingElement>({ tag: 'li', text: `Description: ${String(this.#productDescription)}` }),

      ),
    );
  };

  #showImages = (size: ImageSize): BaseElement<HTMLOListElement> => {
    console.log(this.#productImages);
    const imagesEl = new BaseElement<HTMLOListElement>({ tag: 'ul' },);
    this.#productImages.forEach((image) => {
      const url = Products.getImageUrl(image.url, size);
      const li = new BaseElement<HTMLHeadingElement>({ tag: 'li' }, new BaseElement<HTMLImageElement>({ tag: 'img', src: url, alt: image.label },));
      imagesEl.node.append(li.node);
    });
    return imagesEl;

  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
