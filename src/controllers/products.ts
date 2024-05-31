import {
  ProductProjection,
  ProductProjectionPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import productsApi, { SortingType } from '@Src/api/products';
import errorHandler from './error-handler';

export enum ImageSize {
  origin = '',
  thumb = '-thumb', // (50x50)
  small = '-small', // (150x150)
  medium = '-medium', // (400x400)
  large = '-large', // (700x700)
  zoom = '-zoom', // (1400x1400)
}

export default class Products {
  #products!: ProductProjectionPagedQueryResponse;

  static locale = process.env.LOCALE;

  getProducts = async (categoryId?: string, sortingType?: SortingType) => {
    try {
      this.#products = (await productsApi.getProducts(categoryId, sortingType)).body;
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

  // get url for different size of original image
  // https://docs.commercetools.com/api/projects/products#image
  static getImageUrl = (originalUrl: string, imageSize = ImageSize.origin) =>
    originalUrl.replace(/(\.jpg|\.png)/i, `${imageSize}$1`);
}
