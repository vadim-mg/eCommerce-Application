import basketSvg from '@Assets/icons/basket.svg';
import logoSvg from '@Assets/icons/logo.svg';
import userSvg from '@Assets/icons/user.svg';
import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import HamburgerSidebar from '@Src/components/ui/hamburger-sidedar';
import Link from '@Src/components/ui/link';
import ROUTES, { AppRoutes, RouteVisibility } from '@Src/router/routes';
import State from '@Src/state';

import auth from '@Src/controllers/auth';
import cartController from '@Src/controllers/cart';
import Router from '@Src/router';
import classes from './style.module.scss';

type HeaderProps = Omit<ElementProps<HTMLElement>, 'tag'>;

const routeToLogin = () => Router.getInstance().route(AppRoutes.LOGIN);

const routeToSignup = () => Router.getInstance().route(AppRoutes.SIGNUP);

export default class Header extends BaseElement<HTMLElement> {
  #mainNavItems = [AppRoutes.MAIN, AppRoutes.CATALOGUE, AppRoutes.ABOUT];

  #sidebarNavItems = [AppRoutes.LOGIN, AppRoutes.SIGNUP, AppRoutes.PROFILE, AppRoutes.LOGOUT];

  #burgerButton: BaseElement<HTMLDivElement>;

  #hamburgerSidebar: HamburgerSidebar;

  #countInCartElement!: BaseElement<HTMLDivElement>;

  constructor(props: HeaderProps) {
    super({ tag: 'header', class: classes.header, ...props });
    this.#burgerButton = Header.#createBurgerButton();
    this.#hamburgerSidebar = this.#createBurgerMenu();
    this.#appendContent();
    this.#addEventListeners();
    // we should always give new data to show it in header and in other pages
    cartController.getCartData().then(() => {
      this.refreshCountInCartElement();
    });
  }

  refreshCountInCartElement() {
    const cartCountElement = this.#countInCartElement.node;
    if (cartCountElement) {
      cartCountElement.textContent = cartController.totalProductCount.toString();
      cartCountElement.classList[cartController.totalProductCount === 0 ? 'add' : 'remove'](
        classes.basketCountHidden,
      );
    }
  }

  #addEventListeners = () => {
    this.#burgerButton.node.addEventListener('click', this.#hamburgerSidebar.openSidebar);
  };

  #appendContent = () => {
    this.node.append(
      this.#hamburgerSidebar.node,
      this.#createLogoNavigationWrapper().node,
      this.#createUserActionsWrapper().node,
      this.#burgerButton.node,
    );
  };

  #createLogoNavigationWrapper = () =>
    new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.logoNavigationWrapper },
      new Link({
        class: classes.logoIcon,
        innerHTML: logoSvg,
        href: AppRoutes.MAIN,
      }),
      new BaseElement<HTMLElement>(
        {
          tag: 'nav',
          class: '',
        },
        new BaseElement<HTMLUListElement>(
          { tag: 'ul', class: classes.navigationList },
          ...this.#mainNavItems.map(Header.#createListItem),
        ),
      ),
    );

  #createBurgerMenu = () =>
    new HamburgerSidebar(
      { class: classes.mobileMenu },
      new BaseElement<HTMLUListElement>(
        { tag: 'ul', class: classes.navigationList },
        ...[...this.#mainNavItems, ...this.#sidebarNavItems]
          .filter(Header.#filterListItem)
          .map(Header.#createListItem),
      ),
    );

  static #createBurgerButton = () =>
    new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.burgerButton,
      },
      ...Array(3)
        .fill(1)
        .map(
          () =>
            new BaseElement<HTMLDivElement>({
              tag: 'div',
              class: classes.burgerBtnLine,
            }),
        ),
    );

  #createUserActionsWrapper = () => {
    const userActionsWrapper = new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.userActionsWrapper,
      },
      // cart element
      new Link(
        { href: AppRoutes.CART, class: classes.basket },
        new BaseElement<HTMLDivElement>(
          {
            tag: 'div',
            class: classes.basket,
          },
          new BaseElement<HTMLElement>({
            tag: 'div',
            class: classes.basketIcon,
            innerHTML: basketSvg,
          }),
          (this.#countInCartElement = new BaseElement<HTMLDivElement>({
            tag: 'div',
            class: [classes.basketCount, classes.basketCountHidden],
          })),
        ),
      ),
      Header.#createButtonContainer(),
    );
    return userActionsWrapper;
  };

  static #createButtonContainer = () =>
    new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.buttonContainer,
      },

      new Button(
        { text: 'Log in', class: State.getInstance().isLoggedIn ? classes.hidden : '' },
        ButtonClasses.NORMAL,
        routeToLogin,
      ),
      new Button(
        { text: 'Sign up', class: State.getInstance().isLoggedIn ? classes.hidden : '' },
        ButtonClasses.NORMAL,
        routeToSignup,
      ),
      new Link(
        {
          href: AppRoutes.PROFILE,
          class: classes.linkUserIcon,
        },
        new BaseElement<HTMLElement>({
          tag: 'div',
          class: classes.userIcon,
          innerHTML: userSvg,
          hidden: !State.getInstance().isLoggedIn,
        }),
      ),

      new Button(
        { text: 'Log out', class: [...(!State.getInstance().isLoggedIn ? [classes.hidden] : [])] },
        ButtonClasses.NORMAL,
        auth.signOut,
      ),
    );

  // create list item for route
  static #createListItem = (route: AppRoutes) =>
    new BaseElement<HTMLLIElement>(
      {
        tag: 'li',
        class: Router.isCurrentPath(route) ? classes.current : '',
      },
      new Link({
        href: route,
        text: ROUTES[route].name,
        class: classes.navLink,
      }),
    );

  // filter routes which should be shown
  static #filterListItem = (route: AppRoutes) => {
    if (ROUTES[route].visibility === RouteVisibility.onlyAuth && !State.getInstance().isLoggedIn) {
      return false;
    }
    if (
      ROUTES[route].visibility === RouteVisibility.onlyNotAuth &&
      State.getInstance().isLoggedIn
    ) {
      return false;
    }
    return true;
  };
}
