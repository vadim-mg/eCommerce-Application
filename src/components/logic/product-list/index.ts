import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import { SortingType } from '@Src/api/products';
import productCategories from '@Src/controllers/categories';
import Products from '@Src/controllers/products';
import ProductCard from '../product-card';
import classes from './style.module.scss';

type ProductListProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;

export default class ProductList extends BaseElement<HTMLDivElement> {
  #products: Products;

  constructor(props: ProductListProps) {
    super({ tag: 'div', ...props });
    this.#products = new Products();
    this.node.classList.add(classes.productList);
  }

  showProducts = async (categoryId?: string, sortingType?: SortingType) => {
    try {
      const realCategoryId = categoryId === productCategories.CATEGORY_ALL.id ? '' : categoryId;

      const respBody = await this.#products.getProducts(realCategoryId, sortingType);

      const selectedCategoryKey = categoryId
        ? productCategories.getById(categoryId)?.key
        : productCategories.CATEGORY_ALL.key;

      this.node.innerHTML = '';
      console.log(respBody);
      respBody.results.forEach((product) => {
        console.log(product);
        this.node.append(new ProductCard({}, product, selectedCategoryKey).node);
      });
    } catch (error) {
      console.log(error);
    }
  };
}
