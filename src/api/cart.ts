import { MyCartDraft, MyCartUpdateAction } from '@commercetools/platform-sdk';
import apiRoot from './api-root';

const getActiveCart = () => apiRoot.apiBuilder.me().activeCart().get().execute();
const getCarts = () => apiRoot.apiBuilder.me().carts().get().execute();

const createCart = (myCartDraft: MyCartDraft) =>
  apiRoot.apiBuilder
    .me()
    .carts()
    .post({
      body: myCartDraft,
    })
    .execute();

const updateCart = (ID: string, version: number, actions: MyCartUpdateAction[]) =>
  apiRoot.apiBuilder
    .me()
    .carts()
    .withId({ ID })
    .post({
      body: {
        version,
        actions,
      },
    })
    .execute();

const deleteCart = (ID: string, version: number) =>
  apiRoot.apiBuilder
    .me()
    .carts()
    .withId({ ID })
    .delete({
      queryArgs: {
        version,
      },
    })
    .execute();

const getCartDiscounts = () => apiRoot.apiBuilder.cartDiscounts().get().execute();

const getDiscountCodes = () => apiRoot.apiBuilder.discountCodes().get().execute();

const checkCartDiscount = (key: string) =>
  apiRoot.apiBuilder
    .cartDiscounts()
    .withKey({
      key,
    })
    .get()
    .execute();

const checkDiscountCode = (key: string) =>
  apiRoot.apiBuilder
    .discountCodes()
    .withKey({
      key,
    })
    .get()
    .execute();

const getDiscountCode = (ID: string) =>
  apiRoot.apiBuilder
    .discountCodes()
    .withId({
      ID,
    })
    .get()
    .execute();

export default {
  getActiveCart,
  createCart,
  updateCart,
  getCarts,
  deleteCart,
  getCartDiscounts,
  checkCartDiscount,
  getDiscountCode,
  getDiscountCodes,
  checkDiscountCode,
};
