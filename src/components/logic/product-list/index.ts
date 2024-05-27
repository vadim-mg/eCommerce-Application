import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import productCategories from '@Src/controllers/categories';
import Products from '@Src/controllers/products';
import ProductCard from '../product-card';
import classes from './style.module.scss';

type ProductListProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;

export default class ProductList extends BaseElement<HTMLDivElement> {
  #products: Products;

  constructor(props: ProductListProps, categoryId?: string) {
    super({ tag: 'div', ...props });
    this.#products = new Products();
    this.node.classList.add(classes.productList);
    this.showProducts(categoryId);
  }

  showProducts = async (categoryId?: string) => {
    try {
      // const respBody: ProductProjectionPagedQueryResponse =
      //   testData as ProductProjectionPagedQueryResponse;

      const respBody = await this.#products.getProducts(categoryId);

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
