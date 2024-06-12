import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import loadingSvg from '@Assets/icons/loading.svg';
import { ProductGetOptions } from '@Src/api/products';
import tag from '@Src/components/common/tag';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import productCategories from '@Src/controllers/categories';
import Products from '@Src/controllers/products';
import { ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';
import ProductCard, { AddToCartCbFunction } from '../product-card';
import classes from './style.module.scss';

type ProductListProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;

export default class ProductList extends BaseElement<HTMLDivElement> {
  #products: Products;

  #onAddToCartCb;

  #productsContainer: BaseElement<HTMLDivElement>;

  #buttonContainer: BaseElement<HTMLDivElement>;

  #showMoreBtn!: Button;

  #limit!: number;

  #offset!: number;

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
    this.#resetToInitialState();
  }

  showProducts = async (options: ProductGetOptions) => {
    this.setCardCountByScreenWidth();
    const { categoryId } = options;
    const showOptions: ProductGetOptions = options;
    try {
      showOptions.categoryId = categoryId === productCategories.CATEGORY_ALL.id ? '' : categoryId;

      if (options.isClear) {
        this.#resetToInitialState();
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
        if (this.isWithinTotalLimit(respBody)) {
          this.#addShowMoreBtn(options);
        }
        if (ProductList.isTotalUnderOffset(respBody)) {
          this.#showMoreBtn.node.remove();
        }
      } else {
        this.node.append(tag({ tag: 'p', text: 'No product found with same parameters' }).node);
      }
    } catch (error) {
      console.log(error);
    }
  };

  isWithinTotalLimit = (response: ProductProjectionPagedQueryResponse) => {
    const total = response.total ?? 0;
    return total > response.count + response.offset && response.limit === this.#startLimitValue;
  };

  static isTotalUnderOffset = (response: ProductProjectionPagedQueryResponse) => {
    const total = response.total ?? 0;
    return total <= response.count + response.offset;
  };

  #addShowMoreBtn = (options: ProductGetOptions) => {
    this.#showMoreBtn = new Button(
      { text: 'Show more', class: classes.showMoreBtn },
      ButtonClasses.NORMAL,
      () => this.#onShowMoreBtn(options),
      loadingSvg,
    );
    this.#buttonContainer.node.append(this.#showMoreBtn.node);
  };

  #onShowMoreBtn = (options: ProductGetOptions) => {
    // offset - кол-во карточек отображенных ранее, limit - сколько нужно загрузить
    // здесь offset увеличивается на начальное кол-во карточек(9)
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

  setCardCountByScreenWidth = () => {
    this.#cardsCountToDisplay = ProductList.getCardCountByScreenWidth(window.screen.width);
  };

  static getCardCountByScreenWidth = (screenWidth: number): number => {
    switch (true) {
      case screenWidth >= 1449:
        return 3;
      case screenWidth > 720:
        return 2;
      default:
        return 1;
    }
  };

  #resetToInitialState = () => {
    this.#productsContainer.node.innerHTML = '';
    this.#buttonContainer.node.innerHTML = '';
    this.#offset = 0;
    this.#limit = 9;
  };
}
