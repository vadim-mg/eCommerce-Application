import {
  _BaseAddress,
  Cart,
  CustomerSignInResult,
  LineItem,
  MyCartDraft,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import cartApi from '@Src/api/cart';
import errorHandler from './error-handler';

class CartController {
  #cartData!: Cart | null;

  #productInCart!: Map<string, Pick<LineItem, 'id' | 'quantity'>>;

  #requestForActiveCartSent!: boolean; // if already sent request for active cart, nee to exclude concurrent same requests

  constructor() {
    this.#init();
  }

  #init = () => {
    this.#requestForActiveCartSent = false;
    this.#cartData = null;
    this.#fillProductInCartMap();
  };

  #fillProductInCartMap = () => {
    this.#productInCart = new Map(
      this.#cartData?.lineItems.map((item) => [
        item.productId,
        {
          id: item.id,
          quantity: item.quantity,
        },
      ]),
    );
  };

  #getActiveCart = async () => {
    try {
      const carts = (await cartApi.getCarts()).body;
      this.#cartData = carts.results.find((val) => val.cartState === 'Active') ?? null;

      if (!this.#cartData) {
        await this.#createNewEmptyCart();
      }
      this.#fillProductInCartMap();
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
      if (error.code === 404) {
        console.log('Will create cart, because it is not found!');
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
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
    }
  };

  addItemToCart = async (productId: string, quantity = 1) => {
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
        quantity,
      };

      this.#cartData = (
        await cartApi.updateCart(this.#cartData?.id, this.#cartData?.version, [
          addLineItemToCartAction,
        ])
      ).body;

      const id =
        this.#productInCart.get(productId)?.id ??
        this.#cartData.lineItems.find((val) => val.productId === productId)?.id;
      if (id) {
        this.#productInCart.set(productId, {
          id,
          quantity: (this.#productInCart.get(productId)?.quantity ?? 0) + quantity,
        });
      } else {
        console.log(`In added cart was not found added productId: ${productId}`);
      }
      // console.log('#addItemToCart, this.#cartData = ', this.#cartData);
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
      throw new Error(error.message);
    }
  };

  removeItemFromCart = async (productId: string, quantity = 1) => {
    try {
      if (!this.#cartData) {
        this.#cartData = await this.#getActiveCart();
      }
      if (!this.#cartData) {
        return;
      }

      const lineItemId = this.#productInCart.get(productId)?.id;
      const storedQuantity = this.#productInCart.get(productId)?.quantity;

      const removeLineItemAction: MyCartUpdateAction = {
        action: 'removeLineItem',
        lineItemId,
        quantity,
      };
      this.#cartData = (
        await cartApi.updateCart(this.#cartData?.id, this.#cartData?.version, [
          removeLineItemAction,
        ])
      ).body;

      if (!storedQuantity || !lineItemId) {
        return;
      }

      if (storedQuantity <= quantity) {
        this.#productInCart.delete(productId);
      } else {
        this.#productInCart.set(productId, {
          id: lineItemId,
          quantity: storedQuantity - quantity,
        });
      }
      console.log('#removeItemFromCart, this.#cartData = ', this.#cartData);
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
      throw new Error(error.message);
    }
  };

  getCartData = async () => {
    try {
      if (!this.#cartData) {
        // If there isn't active request then make it
        if (!this.#requestForActiveCartSent) {
          this.#requestForActiveCartSent = true;
          this.#cartData = await this.#getActiveCart();
          this.#requestForActiveCartSent = false;
        } else {
          // else try read current request's result
          await new Promise((resolve, reject) => {
            const interval = setInterval(() => {
              if (this.#cartData) {
                clearTimeout(interval);
                resolve(this.#cartData);
              }
            }, 100);
            // If it won't be get, return reject wit error
            setTimeout(() => {
              clearTimeout(interval);
              reject(new Error('Cart not exist'));
            }, 5000);
          });
        }
      }
      // console.log('getCartData, this.#cartData = ', this.#cartData);
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
    }
    return this.#cartData;
  };

  setCartData = (cartData: Cart | null) => {
    this.#cartData = cartData;
    this.#fillProductInCartMap();
  };

  howManyAlreadyInCart = (productId: string) => this.#productInCart.get(productId)?.quantity ?? 0;

  get totalProductCount() {
    return Array.from(this.#productInCart).reduce((acc, val) => acc + val[1].quantity, 0);
  }

  removeAllItemFromCart = async () => {
    try {
      if (!this.#cartData) {
        this.#cartData = await this.#getActiveCart();
      }
      if (!this.#cartData) {
        return;
      }
      const arrayRemoveLineItemAction: MyCartUpdateAction[] = [];

      this.#productInCart.forEach((product) => {
        const lineItemId = product.id;
        const lineItemQuantity = product.quantity;
        const removeLineItemAction: MyCartUpdateAction = {
          action: 'removeLineItem',
          lineItemId,
          quantity: lineItemQuantity,
        };
        arrayRemoveLineItemAction.push(removeLineItemAction);
      });

      this.#cartData = (
        await cartApi.updateCart(
          this.#cartData?.id,
          this.#cartData?.version,
          arrayRemoveLineItemAction,
        )
      ).body;

      this.#productInCart = new Map();
    } catch (e) {
      const error = e as HttpErrorType;
      errorHandler(error);
      console.log(error);
      throw new Error(error.message);
    }
  };

  deleteCart = async () => {
    if (this.#cartData) {
      try {
        await cartApi.deleteCart(this.#cartData.id, this.#cartData.version);
        this.#init();
      } catch (error) {
        console.log(error);
      }
    }
  };

  setShippingAddress = async (address: _BaseAddress) => {
    if (this.#cartData) {
      const setShippingAddressAction: MyCartUpdateAction = {
        action: 'setShippingAddress',
        address,
      };
      try {
        await cartApi.updateCart(this.#cartData?.id, this.#cartData?.version, [
          setShippingAddressAction,
        ]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  setShippingAddressForCustomer = async (customerSignInResult: CustomerSignInResult) => {
    const shippingAddressId = customerSignInResult.customer.shippingAddressIds?.[0];
    if (shippingAddressId) {
      const shippingAddress = customerSignInResult.customer.addresses.find(
        (val) => val.id === shippingAddressId,
      );
      if (shippingAddress) {
        await this.setShippingAddress(shippingAddress);
      }
    }
  };
}

export const cartController = new CartController();

export default cartController;
