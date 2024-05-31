import { HttpErrorType } from '@commercetools/sdk-client-v2';
import apiRoot from '@Src/api/api-root';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import State from '@Src/state';
import { anonymousTokenCache, passwordTokenCache } from '@Src/utils/token-cache';

const errorHandler = (error: HttpErrorType) => {
  /* Sometimes on dev, we catch the bug when token and refresh token are invalid, and we can't get any query to backend */
  /* this temporary fix this problem by removing invalid tokens */
  if (error.code === 401 && error.message === 'invalid_token') {
    anonymousTokenCache.remove();
    passwordTokenCache.remove();
    Router.getInstance().refresh();
  }

  if (error.code === 403) {
    anonymousTokenCache.remove();
    apiRoot.logoutUser();
    State.getInstance().isLoggedIn = false;
    State.getInstance().currentUser = null;
    Router.getInstance().route(AppRoutes.LOGIN);
  }
};

export default errorHandler;
