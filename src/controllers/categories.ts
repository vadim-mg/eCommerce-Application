import categoriesApi from '@Src/api/categories';
import { Category } from '@commercetools/platform-sdk';


class ProductCategories {
  #cache: Category[];

  constructor() {
    this.#cache = [];
  }

  getCategories = async (fromCache = true) => {
    if (fromCache && this.#cache.length) {
      return this.#cache;
    }

    try {
      this.#cache = (await categoriesApi.getCategories()).body.results;
    } catch (error) {
      console.log(error);
    }
    return this.#cache;
  };
}

const productCategories = new ProductCategories();

// export instance for caching array with categories
export default productCategories;