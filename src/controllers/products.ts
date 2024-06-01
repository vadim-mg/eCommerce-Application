import {
  Attribute,
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

type AvailableAttributes = {
  [AttrName.TYPE]: Set<string>;
  [AttrName.DESCRIPTION]: Set<string>;
  [AttrName.BRAND]: Set<string>;
  [AttrName.AGE_FROM]: Set<number>;
  [AttrName.MAX_PLAYER_COUNT]: Set<number>;
  [AttrName.MIN_PLAYER_COUNT]: Set<number>;
};

export default class Products {
  #products!: ProductProjectionPagedQueryResponse;

  #attributes!: ProductAttributes[];

  #availableAttributes: AvailableAttributes;

  constructor() {
    this.#availableAttributes = {
      [AttrName.TYPE]: new Set(),
      [AttrName.BRAND]: new Set(),
      [AttrName.DESCRIPTION]: new Set(),
      [AttrName.AGE_FROM]: new Set(),
      [AttrName.MAX_PLAYER_COUNT]: new Set(),
      [AttrName.MIN_PLAYER_COUNT]: new Set(),
    };
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

  getFilterAttributes = async () => {
    try {
      const products = (await productsApi.getAllProducts()).body;
      const isNeedAttr = (attr: Attribute) =>
        [
          AttrName.BRAND,
          AttrName.AGE_FROM,
          AttrName.MIN_PLAYER_COUNT,
          AttrName.MAX_PLAYER_COUNT,
        ].includes(attr.name as AttrName);

      products.results.forEach((product) => {
        product.masterVariant.attributes?.forEach((attr) => {
          if (isNeedAttr(attr)) {
            this.#availableAttributes[attr.name as AttrName].add(attr.value as never);
          }
        });
      });
      console.log(this.#availableAttributes);
    } catch (error) {
      errorHandler(error as HttpErrorType);
      throw error;
    }
    return this.#availableAttributes;
  };

  // get url for different size of original image
  // https://docs.commercetools.com/api/projects/products#image
  static getImageUrl = (originalUrl: string, imageSize = ImageSize.origin) =>
    originalUrl.replace(/(\.jpg|\.png)/i, `${imageSize}$1`);
}
