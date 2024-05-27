import categoriesApi from '@Src/api/categories';
import { Category } from '@commercetools/platform-sdk';

class ProductCategories {
  #cache: Category[];

  #map: Map<string, Category>;

  constructor() {
    this.#cache = [];
    this.#map = new Map();
  }

  getCategories = async (fromCache = true) => {
    if (fromCache && this.#cache.length) {
      return this.#cache;
    }

    try {
      this.#cache = (await categoriesApi.getCategories()).body.results;
      this.#map = new Map(this.#cache.map((category) => [category.id, category]));
    } catch (error) {
      console.log(error);
    }
    return this.#cache;
  };

  getById = (id: string) => this.#map.get(id);
}

const productCategories = new ProductCategories();

// export instance for caching array with categories
export default productCategories;
