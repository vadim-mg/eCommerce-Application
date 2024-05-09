import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import Router from '@Src/router';
import { PageRouteKey } from '@Src/router/routes';
import classes from './style.module.scss';

export default class Link extends BaseElement<HTMLElement> {
  constructor(props: Omit<ElementProps<HTMLLinkElement>, 'tag'>) {
    super({ tag: 'a', ...props });
    this.node.classList.add(classes.link);

    const href = props.href ?? '';

    // if href is app route, it will use as SPA route, else it is usual link to anywhere
    if (Router.isRouteExist(href)) {
      this.node.addEventListener('click', (event) => {
        event.preventDefault();
        Router.getInstance().route(href as PageRouteKey);
      });
    }
  }
}