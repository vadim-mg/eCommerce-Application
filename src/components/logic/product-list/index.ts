import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import { ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';
import Products from '@Src/controllers/products';
import testData from '@Src/pages/catalogue/test-data';
import ProductCard from '../product-card';
import classes from './style.module.scss';

type ProductListProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;

export default class ProductList extends BaseElement<HTMLDivElement> {
  #products: Products;

  constructor(props: ProductListProps) {
    super({ tag: 'div', ...props });
    this.#products = new Products();
    this.node.classList.add(classes.productList);
    this.#showProducts();
  }

  #showProducts = async () => {
    try {
      const respBody: ProductProjectionPagedQueryResponse =
        testData as ProductProjectionPagedQueryResponse;
      // const respBody = await this.#products.all; // todo return it on his place
      this.node.innerHTML = '';
      console.log(respBody);
      respBody.results.forEach((product) => {
        console.log(product);
        this.node.append(new ProductCard({}, product).node);
      });
    } catch (error) {
      console.log(error);
    }
  };
}
