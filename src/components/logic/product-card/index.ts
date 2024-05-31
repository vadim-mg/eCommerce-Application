import basketIconPath from '@Assets/icons/basket.svg';
import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import Link from '@Src/components/ui/link';
import Products, { ImageSize } from '@Src/controllers/products';
import { AppRoutes } from '@Src/router/routes';
import { getPrice } from '@Src/utils/helpers';
import { ProductProjection } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

type ProductCardProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;
export default class ProductCard extends BaseElement<HTMLElement> {
  #product: ProductProjection;

  constructor(props: ProductCardProps, product: ProductProjection, selectedCategoryKey?: string) {
    super({ tag: 'div', ...props });
    this.#product = product;
    this.node.append(this.#createElement(selectedCategoryKey).node);
    this.node.classList.add(classes.productCard);
  }

  #createElement = (selectedCategory?: string) => {
    const { key, name, description, masterVariant } = this.#product;
    const categoryPath = selectedCategory?.length ? `${selectedCategory}/` : '';

    const image = masterVariant.images?.[0];
    const prices = (masterVariant.prices ?? [])[0];

    return new Link(
      {
        href: `${AppRoutes.CATALOGUE}/${categoryPath}${key}`,
        class: [classes.productLink],
      },
      // sale label
      prices.discounted
        ? tag<HTMLDivElement>({ tag: 'div', text: 'SALE', class: classes.discounted })
        : tag<HTMLSpanElement>({ tag: 'span' }),

      // cart caption
      tag<HTMLDivElement>(
        { tag: 'div', class: classes.productCardContainer },
        tag<HTMLHeadingElement>({
          tag: 'h2',
          text: name[Products.locale],
          class: classes.productName,
        }),

        // image
        tag<HTMLImageElement>({
          tag: 'img',
          class: classes.productImage,
          src: Products.getImageUrl(image?.url ?? '', ImageSize.medium),
        }),

        // description
        tag<HTMLDivElement>(
          { tag: 'div', class: classes.descriptionBox },
          tag<HTMLParagraphElement>({
            tag: 'p',
            text: description?.[Products.locale].slice(0, 75),
            class: classes.productDescription,
          }),
        ),

        // prices
        tag<HTMLParagraphElement>(
          {
            tag: 'p',
            class: classes.productPrice,
          },
          tag<HTMLSpanElement>({
            tag: 'span',
            text: getPrice(prices.value),
            class: prices.discounted ? classes.productPriceOld : '',
          }),
          tag<HTMLSpanElement>({
            tag: 'span',
            text: prices.discounted ? getPrice(prices.discounted.value) : '',
          }),
        ),

        // button cart
        new Button(
          { text: 'Add to Cart', class: classes.cardButton },
          ButtonClasses.NORMAL,
          (event: Event) => {
            event.stopPropagation();
            console.log(`Product ${this.#product.key} will added to cart in next sprint!`);
          },
          basketIconPath,
        ),
      ),
    );
    // todo filters with attributes
    // ...(masterVariant.attributes ?? []).map((attr) =>
    //   tag<HTMLParagraphElement>({
    //     tag: 'p',
    //     text: `${attr.name}: ${attr.value}`,
    //   }),
    // ),
  };
}
