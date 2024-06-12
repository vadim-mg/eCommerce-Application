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

export default { getActiveCart, createCart, updateCart, getCarts, deleteCart };
