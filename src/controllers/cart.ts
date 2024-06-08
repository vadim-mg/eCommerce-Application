import { Cart, MyCartDraft, MyCartUpdateAction } from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import cartApi from '@Src/api/cart';
import errorHandler from './error-handler';

class CartController {
  #cartData: Cart | null;

  #productInCart: Map<string, number>;

  constructor() {
    this.#cartData = null;
    this.#productInCart = new Map();
  }

  #getActiveCart = async () => {
    try {
      this.#cartData = (await cartApi.getActiveCart()).body;
      console.log('#getActiveCart, this.#cartData = ', this.#cartData);
      this.#productInCart = new Map(
        this.#cartData.lineItems.map((item) => [item.productId, item.quantity]),
      );
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
      console.log('#createNewEmptyCart, this.#cartData = ', this.#cartData);
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
      this.#productInCart.set(productId, (this.#productInCart.get(productId) ?? 0) + 1);
      console.log('#addItemToCart, this.#cartData = ', this.#cartData);
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
      console.log('getCartData, this.#cartData = ', this.#cartData);
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
    }
    return this.#cartData;
  };

  howManyAlreadyInCart = (productId: string) => this.#productInCart.get(productId) ?? 0;
}

export const cartController = new CartController();
// we should always give new data to show it in header and in other pages
cartController.getCartData();

export default cartController;
