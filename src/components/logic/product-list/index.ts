import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import loadingSvg from '@Assets/icons/loading.svg';
import { ProductGetOptions } from '@Src/api/products';
import tag from '@Src/components/common/tag';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import productCategories from '@Src/controllers/categories';
import Products from '@Src/controllers/products';
import ProductCard, { AddToCartCbFunction } from '../product-card';
import classes from './style.module.scss';

type ProductListProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;

export default class ProductList extends BaseElement<HTMLDivElement> {
  #products: Products;

  #onAddToCartCb;

  #productsContainer: BaseElement<HTMLDivElement>;

  #buttonContainer: BaseElement<HTMLDivElement>;

  #showMoreBtn!: Button;

  #limit: number = 9;

  #offset: number = 0;

  #startLimitValue: number = 9;

  #cardsCountToDisplay: number = 3;

  constructor(
    props: ProductListProps,
    logicProperties: {
      products: Products;
      onAddToCartCb: AddToCartCbFunction;
    },
  ) {
    super({ tag: 'div', ...props });
    this.#productsContainer = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.productsContainer,
    });
    this.#buttonContainer = new BaseElement<HTMLDivElement>({
      tag: 'div',
    });
    this.node.append(this.#productsContainer.node);
    this.node.append(this.#buttonContainer.node);
    this.#products = logicProperties.products;
    this.#onAddToCartCb = logicProperties.onAddToCartCb;
  }

  showProducts = async (options: ProductGetOptions) => {
    this.getCardCountByScreenWidth();
    const { categoryId } = options;
    const showOptions: ProductGetOptions = options;
    try {
      showOptions.categoryId = categoryId === productCategories.CATEGORY_ALL.id ? '' : categoryId;

      if (options.isClear) {
        this.#productsContainer.node.innerHTML = '';
        this.#buttonContainer.node.innerHTML = '';
        this.#offset = 0;
        this.#limit = 9;
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
        if (total > respBody.count + respBody.offset && respBody.limit === this.#startLimitValue) {
          this.#addShowMoreBtn(options);
        }
        if (total <= respBody.count + respBody.offset) {
          this.#showMoreBtn.node.remove();
        }
      } else {
        this.node.append(tag({ tag: 'p', text: 'No product found with same parameters' }).node);
      }
    } catch (error) {
      console.log(error);
    }
  };

  #addShowMoreBtn = (options: ProductGetOptions) => {
    this.#showMoreBtn = new Button(
      { text: 'Show more' },
      ButtonClasses.NORMAL,
      () => this.#onShowMoreBtn(options),
      loadingSvg,
    );
    this.#showMoreBtn.node.classList.add(classes.showMoreBtn);
    this.#buttonContainer.node.append(this.#showMoreBtn.node);
  };

  #onShowMoreBtn = (options: ProductGetOptions) => {
    this.#offset += this.#limit === this.#startLimitValue ? this.#limit : 0;
    this.#limit = this.#cardsCountToDisplay;
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
  };

  getCardCountByScreenWidth = () => {
    if (window.screen.width >= 1449) {
      this.#cardsCountToDisplay = 3;
    } else if (window.screen.width < 1449 && window.screen.width > 720) {
      this.#cardsCountToDisplay = 2;
    } else {
      this.#cardsCountToDisplay = 1;
    }
  }
}
