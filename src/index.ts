import '@Src/styles/style.module.scss';
import Router from './router';
import State from './state';
import { passwordTokenCache } from './utils/token-cache';

State.getInstance().isLoggedIn = !!passwordTokenCache.get().token;
const router = Router.getInstance();
router.route();
