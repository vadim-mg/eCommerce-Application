import categoriesApi from '@Src/api/categories';
import { Category } from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import errorHandler from './error-handler';

class ProductCategories {
  #cache: Category[];

  #map: Map<string, Partial<Category>>;

  #categoryRoutes: Map<string, string>;

  CATEGORY_ALL = {
    key: 'all',
    id: 'all-categories-id',
    name: { [process.env.LOCALE]: 'All games' },
  };

  constructor() {
    this.#cache = [];
    this.#map = new Map();
    this.#categoryRoutes = new Map();
  }

  getCategories = async (fromCache = true) => {
    if (fromCache && this.#cache.length) {
      return this.#cache;
    }

    try {
      this.#cache = (await categoriesApi.getCategories()).body.results.filter(
        (category) => category.key,
      ); // leave only category with key, it will be need for routes
      this.#map = new Map(
        [...this.#cache, this.CATEGORY_ALL].map((category) => [category.id, category]),
      );
      this.#categoryRoutes = new Map(
        this.#cache.map((category) => (category.key ? [category.key, category.id] : ['', ''])),
      );
      this.#categoryRoutes.set(this.CATEGORY_ALL.key, this.CATEGORY_ALL.id);
    } catch (error) {
      errorHandler(error as HttpErrorType);
      throw error;
    }
    return this.#cache;
  };

  getById = (id: string) => this.#map.get(id);

  routeExist = (route: string) => this.#categoryRoutes.get(route);
}

const productCategories = new ProductCategories();

// export instance for caching array with categories
export default productCategories;
