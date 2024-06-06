import cartIcon from '@Assets/icons/basket.svg';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import Slider, { SliderIsZoom } from '@Src/components/ui/slider';
import productCategories from '@Src/controllers/categories';
import Products, { ImageSize } from '@Src/controllers/products';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import { Image, Price } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

interface Attribute {
  name: string;
  value: string | number;
}
interface ProductAttributes {
  [key: string]: string | number;
}

interface ProductFromPage {
  price?: number;
  discount?: number;
  name?: string;
  currency?: string;
  description?: string;
  minNumberOfPlayers?: number;
  maxNumberOfPlayers?: number;
  typeOfGame?: string;
  ageFrom?: number;
  brand?: string;
  images?: Image[];
  categories?: string;
}
function createAttributeRow(title: string, attribute: string): BaseElement<HTMLDivElement> {
  const row = new BaseElement<HTMLDivElement>(
    { tag: 'li', class: classes.attributeRow },
    new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.attributeTitle,
      text: title,
    }),
    new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.attribute,
      text: attribute,
    }),
  );
  return row;
}

export default class ProductPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #product!: ProductFromPage;

  #productKey!: string | undefined;

  #productPrice!: number;

  #productDiscount!: number;

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
    this.#product = {};
    const productKey = props[1];
    Products.getProductByKey(productKey)
      .then((product) => {
        // You can use static properties and classes from here '@Src/controllers/products' for pictures for example
        this.#product.name = product.name['en-GB'];
        this.#createPrice(product.masterVariant.prices as Price[]);
        this.#createAttributes(product.masterVariant.attributes as Attribute[]);
        this.#product.images = product.masterVariant.images as Image[];
        productCategories.getCategories().then(() => {
          this.#product.categories = product.categories
            .map((val) => productCategories.getById(val.id)?.name?.[process.env.LOCALE])
            .join(', ');
          this.#createContent();
          this.#showContent();
        });
      })
      .catch((error) => {
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
      new Slider(classes.slider, ImageSize.large, this.#product.images!, SliderIsZoom.TRUE, 0),
      this.#createProductData(),
    );
  };

  #createAttributes = (attributes: Attribute[]) => {
    attributes.reduce((acc: ProductAttributes, item: Attribute) => {
      if (item.name) {
        const key = item.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        acc[key as keyof ProductAttributes] = item.value;
      }
      return acc;
    }, this.#product as ProductAttributes);
  };

  #createPrice = (prices: Price[]) => {
    if (prices) {
      this.#product.price = prices[0].value.centAmount;
      if (prices[0].discounted) {
        this.#product.discount = prices[0].discounted.value.centAmount;
      }
      this.#product.currency = prices[0].value.currencyCode;
    }
  };

  #createProductData = () => {
    const wrapper = new BaseElement<HTMLElement>({ tag: 'div', class: classes.productInfo });
    const h1 = new BaseElement<HTMLHeadingElement>({
      tag: 'h1',
      class: classes.productName,
      text: this.#product.name,
    });

    const priceRow = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.productPriceRow,
    });
    const priceEl = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.price,
      text: `€${String((this.#product.price! / 100).toFixed(2))}`,
    });
    const button = new Button(
      { text: 'Add to Cart', class: classes.button },
      ButtonClasses.NORMAL,
      () => {
        console.log('Product added to the cart');
      },
      cartIcon,
    );
    const priceWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.productPriceWrapper },
      new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.priceTitle, text: 'Price:' }),
      priceEl,
    );
    if (this.#product.discount) {
      const discountPrice = new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.price,
        text: `€${String((this.#product.discount / 100).toFixed(2))}`,
      });
      priceWrapper.node.append(discountPrice.node);
      priceEl.node.classList.add(classes.priceOld);
      h1.node.classList.add(classes.productNameSale);
    }
    priceRow.node.append(priceWrapper.node);
    priceRow.node.append(button.node);

    const brandRow = createAttributeRow('Brand:', this.#product.brand!);
    const categoryRow = createAttributeRow('Categories:', this.#product.categories!);
    // const typeRow = createAttributeRow('Type of game:', this.#product.typeOfGame!);
    const numberRow = createAttributeRow(
      'Number of players:',
      `${this.#product.minNumberOfPlayers} - ${this.#product.maxNumberOfPlayers} `,
    );
    const ageRow = createAttributeRow('Recommended age from:', `${this.#product.ageFrom} years`);

    const attributesList = new BaseElement<HTMLOListElement>(
      { tag: 'ul', class: classes.attributeList },
      brandRow,
      categoryRow,
      // typeRow,
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
        text: this.#product.description,
      }),
    );

    wrapper.node.append(h1.node);
    wrapper.node.append(priceRow.node);
    wrapper.node.append(attributesList.node);
    wrapper.node.append(desc.node);

    return wrapper;
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
