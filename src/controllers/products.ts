import {
  ProductProjection,
  ProductProjectionPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import productsApi, { ProductGetOptions } from '@Src/api/products';
import errorHandler from './error-handler';

export enum ImageSize {
  origin = '',
  thumb = '-thumb', // (50x50)
  small = '-small', // (150x150)
  medium = '-medium', // (400x400)
  large = '-large', // (700x700)
  zoom = '-zoom', // (1400x1400)
}

export enum AttrName {
  TYPE = 'type-of-game',
  DESCRIPTION = 'description',
  MIN_PLAYER_COUNT = 'min-number-of-players',
  MAX_PLAYER_COUNT = 'max-number-of-players',
  AGE_FROM = 'age-from',
  BRAND = 'brand',
}

export type ProductAttributes = {
  [AttrName.TYPE]?: string[];
  [AttrName.DESCRIPTION]?: string;
  [AttrName.BRAND]?: string;
  [AttrName.AGE_FROM]?: number;
  [AttrName.MAX_PLAYER_COUNT]?: number;
  [AttrName.MIN_PLAYER_COUNT]?: number;
};

// for count unique attribute
type AvailableAttributesSets = {
  [AttrName.TYPE]: Set<string>;
  [AttrName.DESCRIPTION]: Set<string>;
  [AttrName.BRAND]: Set<string>;
  [AttrName.AGE_FROM]: Set<number>;
  [AttrName.MAX_PLAYER_COUNT]: Set<number>;
  [AttrName.MIN_PLAYER_COUNT]: Set<number>;
};

// for store unique filter attributes
export type FilterAttributes = {
  [AttrName.BRAND]: string[];
  [AttrName.MIN_PLAYER_COUNT]: number;
  [AttrName.MAX_PLAYER_COUNT]: number;
  [AttrName.AGE_FROM]: number[];
};

const FILTER_ATTRIBUTES_CACHE_NAME = 'Product_filters';
const CACHE_TIME = 600; // sec

export default class Products {
  #products!: ProductProjectionPagedQueryResponse;

  #availableAttributes!: FilterAttributes | null;

  constructor() {
    this.#initAvailableAttributes();
  }

  static locale = process.env.LOCALE;

  getProducts = async (options: ProductGetOptions) => {
    try {
      this.#products = (await productsApi.getProducts(options)).body;
    } catch (error) {
      errorHandler(error as HttpErrorType);
      throw error;
    }
    return this.#products;
  };

  static getProductByKey = async (productKey: string) => {
    let product: ProductProjection;
    try {
      product = (await productsApi.getProductByKey(productKey)).body;
    } catch (error) {
      errorHandler(error as HttpErrorType);
      throw error;
    }
    return product;
  };

  // if change isNeedAttr in calling function, you should wait until cach will experied or clear it in local storage
  getFilterAttributes = async (isNeedAttr: AttrName[] = []) => {
    try {
      this.#initAvailableAttributes();
      if (this.#availableAttributes) {
        return this.#availableAttributes; // from cache
      }

      const availableAttributesSets: AvailableAttributesSets = {
        [AttrName.TYPE]: new Set(),
        [AttrName.BRAND]: new Set(),
        [AttrName.DESCRIPTION]: new Set(),
        [AttrName.AGE_FROM]: new Set(),
        [AttrName.MAX_PLAYER_COUNT]: new Set(),
        [AttrName.MIN_PLAYER_COUNT]: new Set(),
      };

      const products = (await productsApi.getAllProducts()).body;

      products.results.forEach((product) => {
        product.masterVariant.attributes?.forEach((attr) => {
          if (isNeedAttr.includes(attr.name as AttrName)) {
            availableAttributesSets[attr.name as AttrName].add(attr.value as never);
          }
        });
      });

      const brandsSet = availableAttributesSets[AttrName.BRAND].values();
      const minPlayersCountSet = availableAttributesSets[AttrName.MIN_PLAYER_COUNT].values();
      const maxPlayersCountSet = availableAttributesSets[AttrName.MAX_PLAYER_COUNT].values();
      const ageSet = availableAttributesSets[AttrName.AGE_FROM].values();

      this.#availableAttributes = {
        [AttrName.BRAND]: Array.from(brandsSet),
        [AttrName.MIN_PLAYER_COUNT]: Math.min(...Array.from(minPlayersCountSet)),
        [AttrName.MAX_PLAYER_COUNT]: Math.max(...Array.from(maxPlayersCountSet)),
        [AttrName.AGE_FROM]: Array.from(ageSet).filter((val) => val % 2 === 0),
      };

      this.#setCacheForAttributes();
    } catch (error) {
      errorHandler(error as HttpErrorType);
      throw error;
    }

    return this.#availableAttributes;
  };

  #setCacheForAttributes = () => {
    localStorage.setItem(FILTER_ATTRIBUTES_CACHE_NAME, JSON.stringify(this.#availableAttributes));
    localStorage.setItem(`${FILTER_ATTRIBUTES_CACHE_NAME}_time`, Date.now().toString());
  };

  #initAvailableAttributes = () => {
    const data = localStorage.getItem(FILTER_ATTRIBUTES_CACHE_NAME);
    const time = localStorage.getItem(`${FILTER_ATTRIBUTES_CACHE_NAME}_time`);
    const diff = time ? (Date.now() - Number(time)) / 1000 : Infinity;
    this.#availableAttributes = data && time && diff < CACHE_TIME ? JSON.parse(data) : null;
  };

  // get url for different size of original image
  // https://docs.commercetools.com/api/projects/products#image
  static getImageUrl = (originalUrl: string, imageSize = ImageSize.origin) =>
    originalUrl.replace(/(\.jpg|\.png)/i, `${imageSize}$1`);
}
