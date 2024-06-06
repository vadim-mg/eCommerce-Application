import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import { ProductGetOptions } from '@Src/api/products';
import tag from '@Src/components/common/tag';
import productCategories from '@Src/controllers/categories';
import Products from '@Src/controllers/products';
import ProductCard from '../product-card';
import classes from './style.module.scss';

type ProductListProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;

export default class ProductList extends BaseElement<HTMLDivElement> {
  #products: Products;

  constructor(props: ProductListProps, products: Products) {
    super({ tag: 'div', ...props });
    this.#products = products;
    this.node.classList.add(classes.productList);
  }

  showProducts = async (options: ProductGetOptions) => {
    const { categoryId } = options;
    const showOptions: ProductGetOptions = options;
    try {
      showOptions.categoryId = categoryId === productCategories.CATEGORY_ALL.id ? '' : categoryId;

      const respBody = await this.#products.getProducts(options);

      const selectedCategoryKey = categoryId
        ? productCategories.getById(categoryId)?.key
        : productCategories.CATEGORY_ALL.key;

      this.node.innerHTML = '';
      if (respBody.results.length) {
        respBody.results.forEach((product) => {
          this.node.append(new ProductCard({}, product, selectedCategoryKey).node);
        });
      } else {
        this.node.append(tag({ tag: 'p', text: 'No product found with same parameters' }).node);
      }
    } catch (error) {
      console.log(error);
    }
  };
}
