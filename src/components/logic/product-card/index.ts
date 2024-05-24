import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import Link from '@Src/components/ui/link';
import Products, { ImageSize } from '@Src/controllers/products';
import { AppRoutes } from '@Src/router/routes';
import { ProductProjection } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

type ProductCardProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;
export default class ProductCard extends BaseElement<HTMLElement> {
  #product: ProductProjection;

  constructor(props: ProductCardProps, product: ProductProjection) {
    super({ tag: 'div', ...props });
    this.#product = product;
    this.node.append(this.#createElement().node);
    this.node.classList.add(classes.productCard);
  }

  #createElement = () => {
    const { key, name, description, masterVariant } = this.#product;
    return tag<HTMLDivElement>(
      { tag: 'div', class: classes.productCard },
      new Link({
        href: `${AppRoutes.PRODUCT}/${key}`,
        text: `link(key): ${key}`,
        class: classes.productLink,
      }),
      tag<HTMLDivElement>({
        tag: 'div',
        text: `Name: ${name[Products.locale]}`,
      }),
      tag<HTMLParagraphElement>({
        tag: 'p',
        text: `Description: ${description?.[Products.locale]}`,
      }),
      ...(masterVariant.images ?? []).map((img, index) =>
        tag<HTMLImageElement>({
          tag: 'img',
          class: classes.productImage,
          // one image medium, other small
          src: Products.getImageUrl(img.url ?? '', index ? ImageSize.small : ImageSize.medium),
        }),
      ),
      ...(masterVariant.attributes ?? []).map((attr) =>
        tag<HTMLParagraphElement>({
          tag: 'p',
          text: `${attr.name}: ${attr.value}`,
        }),
      ),
      ...(masterVariant.prices ?? []).map((price) =>
        tag<HTMLParagraphElement>({
          tag: 'p',
          text: `${price.value.centAmount} ${price.value.currencyCode} ${price.discounted ? 'discounted' : ''}`,
        }),
      ),
    );
  };
}
