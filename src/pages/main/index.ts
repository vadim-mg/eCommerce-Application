import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import Banner from '@Src/components/ui/banner';
import Link from '@Src/components/ui/link';
import { AppRoutes } from '@Src/router/routes';
import classes from './style.module.scss';

export default class MainPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'div', title: 'Main page' });
    this.banner = new Banner({});
    this.#createContent();
    this.placeForBanner.node.append(this.#content.node, this.banner.node);
    // this.#showContent();
  }

  #createContent = () => {
    const secretLinks =
      process.env.NODE_ENV === 'development'
        ? new BaseElement<HTMLDivElement>(
            {
              tag: 'div',
              class: classes.linksContainer,
            },
            new Link({
              text: 'rs.school',
              href: 'https://rs.school',
              target: '_blank',
              class: classes.listItemSecret,
            }),
            new Link({
              text: 'example',
              href: AppRoutes.HIDDEN_EXAMPLE,
              class: classes.listItemSecret,
            }),
            new Link({ text: 'api', href: AppRoutes.HIDDEN_API, class: classes.listItemSecret }),
          )
        : new BaseElement<HTMLDivElement>({ tag: 'div' });

    this.#content = new BaseElement<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.main,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: 'MainPage' }),
      new BaseElement<HTMLDivElement>(
        { tag: 'div', class: classes.linksContainer },
        new Link({ text: 'main', href: AppRoutes.MAIN, class: classes.listItem }),
        new Link({ text: 'catalogue', href: AppRoutes.CATALOGUE, class: classes.listItem }),
        new Link({ text: 'product', href: AppRoutes.PRODUCT, class: classes.listItem }),
        new Link({
          text: 'product/productId4',
          href: `${AppRoutes.PRODUCT}/productId4`,
          class: classes.listItem,
        }),
        new Link({ text: 'cart', href: AppRoutes.CART, class: classes.listItem }),
        new Link({ text: 'login', href: AppRoutes.LOGIN, class: classes.listItem }),
        new Link({ text: 'signup', href: AppRoutes.SIGNUP, class: classes.listItem }),
        new Link({ text: 'error404', href: AppRoutes.NOT_FOUND, class: classes.listItem }),
        new BaseElement<HTMLSpanElement>({ tag: 'span', text: 'For authorized users: ' }),
        new Link({ text: 'profile', href: AppRoutes.PROFILE, class: classes.listItem }),
        new Link({ text: 'logout', href: AppRoutes.LOGOUT, class: classes.listItem }),
      ),
      secretLinks,
    );
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
