import cartIcon from '@Assets/icons/basket.svg';
import checkIcon from '@Assets/icons/check_big.svg';
import trashIcon from '@Assets/icons/trash-icon.svg';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import ProductCard from '@Src/components/logic/product-card';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import Slider, { SliderIsZoom } from '@Src/components/ui/slider';
import cartController from '@Src/controllers/cart';
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

interface Product {
  id?: string;
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

  #product!: Product;

  #alreadyInCart!: number;

  #addToCartButton!: Button;

  #removeFromCartButton!: Button;

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
        this.#product.id = product.id;
        this.#product.name = product.name['en-GB'];
        this.#createPrice(product.masterVariant.prices as Price[]);
        this.#createAttributes(product.masterVariant.attributes as Attribute[]);
        this.#product.images = product.masterVariant.images as Image[];
        this.#alreadyInCart = cartController.howManyAlreadyInCart(this.#product.id);

        productCategories.getCategories().then(async () => {
          this.#product.categories = product.categories
            .map((val) => productCategories.getById(val.id)?.name?.[process.env.LOCALE])
            .join(', ');
          await cartController.getCartData();
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
    const wrapper = new BaseElement<HTMLElement>(
      { tag: 'div', class: classes.productInfo },

      // header1
      tag({
        tag: 'h1',
        class: [classes.productName, ...(this.#product.discount ? [classes.productNameSale] : [])],
        text: this.#product.name,
      }),

      // price row
      tag(
        {
          tag: 'div',
          class: classes.productPriceRow,
        },

        // prices
        tag(
          { tag: 'div', class: classes.productPriceWrapper },
          tag({ tag: 'div', class: classes.priceTitle, text: 'Price:' }),

          // first price
          tag({
            tag: 'div',
            class: [classes.price, ...(this.#product.discount ? [classes.priceOld] : [])],
            text: `€${String((this.#product.price! / 100).toFixed(2))}`,
          }),

          // second price
          ...(this.#product.discount
            ? [
                tag({
                  tag: 'div',
                  class: classes.price,
                  text: `€${String((this.#product.discount / 100).toFixed(2))}`,
                }),
              ]
            : []),
        ),

        // add cart button
        (this.#addToCartButton = new Button(
          {
            text: ProductCard.inCartText(this.#alreadyInCart),
            class: classes.button,
            disabled: !!this.#alreadyInCart,
          },
          ButtonClasses.NORMAL,
          async (event: Event) => {
            event.stopPropagation();
            if (!this.#alreadyInCart && this.#product.id) {
              try {
                await cartController.addItemToCart(this.#product.id);
                this.#alreadyInCart += 1;
                this.#addToCartButton.node.textContent = ProductCard.inCartText(
                  this.#alreadyInCart,
                );
                this.header.refreshCountInCartElement();
                this.#addToCartButton.disable();
                this.#addToCartButton.addIcon(checkIcon);
                this.#removeFromCartButton.node.hidden = false;
              } catch (err) {
                console.log(err);
              }
            }
          },
          !this.#alreadyInCart ? cartIcon : checkIcon,
        )),
        // remove cart button
        (this.#removeFromCartButton = new Button(
          {
            text: 'Remove from cart',
            class: [classes.button, classes.buttonRemove],
            hidden: !this.#alreadyInCart,
          },
          ButtonClasses.NORMAL,
          async (event: Event) => {
            event.stopPropagation();
            if (this.#alreadyInCart && this.#product.id) {
              try {
                await cartController.removeItemFromCart(this.#product.id);
                this.#alreadyInCart -= 1;
                this.#addToCartButton.node.textContent = ProductCard.inCartText(
                  this.#alreadyInCart,
                );
                this.#addToCartButton.addIcon(checkIcon);
                if (this.#alreadyInCart === 0) {
                  this.#removeFromCartButton.node.hidden = true;
                  this.#addToCartButton.enable();
                  this.#addToCartButton.icon = cartIcon;
                }
                this.header.refreshCountInCartElement();
              } catch (err) {
                console.log(err);
              }
            }
          },
          trashIcon,
        )),
      ),

      // attributes list
      tag(
        { tag: 'ul', class: classes.attributeList },
        createAttributeRow('Brand:', this.#product.brand!),
        createAttributeRow('Categories:', this.#product.categories!),
        createAttributeRow(
          'Number of players:',
          `${this.#product.minNumberOfPlayers} - ${this.#product.maxNumberOfPlayers} `,
        ),
        createAttributeRow('Recommended age from:', `${this.#product.ageFrom} years`),
      ),

      // description
      tag(
        { tag: 'div', class: classes.desc },
        tag({
          tag: 'div',
          class: classes.descTitle,
          text: 'Description:',
        }),
        tag({
          tag: 'div',
          class: classes.descText,
          text: this.#product.description,
        }),
      ),
    );
    return wrapper;
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
