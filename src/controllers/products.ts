import { ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';
import { getProducts } from '@Src/api/products';

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

  constructor() {
    console.log('Products constructor');
  }

  getProducts = async (categoryId?: string) => {
    try {
      this.#products = (await getProducts(categoryId)).body;
    } catch (error) {
      console.error(error);
    }
    return this.#products;
  };

  // get url for different size of original image
  // https://docs.commercetools.com/api/projects/products#image
  static getImageUrl = (originalUrl: string, imageSize = ImageSize.origin) =>
    originalUrl.replace(/(\.jpg|\.png)/i, `${imageSize}$1`);
}
