import cartApi from '@Src/api/cart';
import { Cart, MyCartDraft, MyCartUpdateAction } from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import errorHandler from './error-handler';

class CartController {
  #cartData: Cart | null;

  constructor() {
    this.#cartData = null;
  }

  #getActiveCart = async () => {
    try {
      this.#cartData = (await cartApi.getActiveCart()).body;
      // console.log('#getActiveCart, this.#cartData = ', this.#cartData);
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
      if (error.code === 404) {
        console.log('Will create cart');
        await this.#createNewEmptyCart();
      }
    }
    return this.#cartData;
  };

  #createNewEmptyCart = async () => {
    try {
      const myCartDraft: MyCartDraft = {
        currency: 'EUR',
      };
      this.#cartData = (await cartApi.createCart(myCartDraft)).body;
      // ('#createNewEmptyCart, this.#cartData = ', this.#cartData);
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
    }
  };

  addItemToCart = async (productId: string) => {
    try {
      if (!this.#cartData) {
        this.#cartData = await this.#getActiveCart();
      }
      if (!this.#cartData) {
        return;
      }
      const addLineItemToCartAction: MyCartUpdateAction = {
        action: 'addLineItem',
        productId,
        quantity: 1,
      };
      this.#cartData = (
        await cartApi.updateCart(this.#cartData?.id, this.#cartData?.version, [
          addLineItemToCartAction,
        ])
      ).body;
      // console.log('#addItemToCart, this.#cartData = ', this.#cartData);
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
    }
  };

  getCartData = async () => {
    try {
      if (!this.#cartData) {
        this.#cartData = await this.#getActiveCart();
      }
      // console.log('getCartData, this.#cartData = ', this.#cartData);
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
    }
    return this.#cartData;
  };
}

const cart = new CartController();

export default cart;
