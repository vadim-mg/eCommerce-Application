import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import Link from '@Src/components/ui/link';
import { AppRoutes } from '@Src/router/routes';
import Banner from '@Src/components/ui/banner';
import classes from './style.module.scss';

export default class MainPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'div', title: 'Main page' });
    this.banner = new Banner({});
    this.placeForBanner.node.append(this.banner.node);
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.main,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: 'MainPage' }),
      new BaseElement<HTMLDivElement>(
        { tag: 'div', class: classes.linksContainer },
        new Link({ text: 'error404', href: AppRoutes.NOT_FOUND, class: classes.listItem }),
        new Link({ text: 'product', href: AppRoutes.PRODUCT, class: classes.listItem }),
        new Link({
          text: 'rs.school',
          href: 'https://rs.school',
          target: '_blank',
          class: classes.listItem,
        }),

        new Link({ text: 'example', href: AppRoutes.HIDDEN_EXAMPLE, class: classes.listItem }),
        new Link({ text: 'api', href: AppRoutes.HIDDEN_API, class: classes.listItem }),
        new Link({ text: 'profile', href: AppRoutes.PROFILE, class: classes.listItem }),
        new Link({ text: 'logout', href: AppRoutes.LOGOUT, class: classes.listItem }),
      ),
    );
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
