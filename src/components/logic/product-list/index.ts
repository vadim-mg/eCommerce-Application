import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import { ProductGetOptions } from '@Src/api/products';
import tag from '@Src/components/common/tag';
import productCategories from '@Src/controllers/categories';
import Products from '@Src/controllers/products';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import loadingSvg from '@Assets/icons/loading.svg';
import ProductCard, { AddToCartCbFunction } from '../product-card';
import classes from './style.module.scss';

type ProductListProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;

export default class ProductList extends BaseElement<HTMLDivElement> {
  #products: Products;

  #onAddToCartCb;

  #productsContainer: BaseElement<HTMLDivElement>;

  #showMoreBtn!: Button;

  #limit: number = 9;

  #offset: number = 0;

  constructor(
    props: ProductListProps,
    logicProperties: {
      products: Products;
      onAddToCartCb: AddToCartCbFunction;
    },
  ) {
    super({ tag: 'div', ...props });
    this.#productsContainer = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.productsContainer });
    this.node.append(this.#productsContainer.node);
    this.#products = logicProperties.products;
    this.#onAddToCartCb = logicProperties.onAddToCartCb;
  }

  showProducts = async (options: ProductGetOptions) => {
    const { categoryId } = options;
    const showOptions: ProductGetOptions = options;
    try {
      showOptions.categoryId = categoryId === productCategories.CATEGORY_ALL.id ? '' : categoryId;

      if (options.isClear) {
        this.#productsContainer.node.innerHTML = '';
      }
      const respBody = await this.#products.getProducts(options);

      const selectedCategoryKey = categoryId
        ? productCategories.getById(categoryId)?.key
        : productCategories.CATEGORY_ALL.key;

      if (respBody.results.length) {
        respBody.results.forEach((product) => {
          this.#productsContainer.node.append(
            new ProductCard(
              {},
              {
                product,
                selectedCategoryKey,
                onAddToCartCb: this.#onAddToCartCb,
              },
            ).node,
          );
        });
        const total = respBody.total ?? 0;
        if (respBody.limit === 9 && total - 1 > respBody.count + respBody.offset) {
          this.#showMoreBtn = new Button(
            { text: 'Show more' },
            ButtonClasses.NORMAL,
            () => {
              this.#offset += this.#limit === 9 ? this.#limit : 0;
              this.#limit = 3;
              this.showProducts({
                categoryId: options.categoryId,
                sortingType: options.sortingType,
                search: options.search,
                filter: options.filter,
                limit: this.#limit,
                offset: this.#offset,
                isClear: false,
              });
              this.#offset += this.#limit;
            },
            loadingSvg,
          );
          this.#showMoreBtn.node.classList.add(classes.showMoreBtn);
          this.node.append(this.#showMoreBtn.node);
        }
        if (total - 1 <= respBody.count + respBody.offset) {
          this.#showMoreBtn.node.remove();
        }
      } else {
        this.node.append(tag({ tag: 'p', text: 'No product found with same parameters' }).node);
      }
    } catch (error) {
      console.log(error);
    }
  };
}
