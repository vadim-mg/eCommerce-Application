import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import classes from './style.module.scss';

type AppHref = {
  href: string | AppRoutes;
};

type LinkProps = Omit<Omit<ElementProps<HTMLLinkElement>, 'tag'>, 'href'> & AppHref;
export default class Link extends BaseElement<HTMLElement> {
  constructor(props: LinkProps, ...children: BaseElement<HTMLElement>[]) {
    super({ tag: 'a', ...props }, ...children);
    this.node.classList.add(classes.link);

    const href = props.href ?? '';
    // if href is app route, it will use as SPA route, else it is usual link to anywhere
    if (Router.isOwnUrl(href)) {
      this.node.addEventListener('click', (event) => {
        event.preventDefault();
        Router.getInstance().route(`${href}` as AppRoutes);
      });
    }
  }
}
