import BreadCrumbs from '@Src/components/logic/bread-crumbs';
import Container from '@Src/components/ui/container';
import Footer from '@Src/components/ui/footer';
import Header from '@Src/components/ui/header';
import BaseElement from '../base-element';
import BasePage from '../base-page';
import classes from './style.module.scss';

type ContentPageProps = {
  title: string;
  containerTag: keyof HTMLElementTagNameMap;
  showBreadCrumbs?: boolean;
};

export default class ContentPage extends BasePage {
  protected container: Container;

  #header: Header;

  protected placeForBanner!: BaseElement<HTMLElement>;

  #footer: Footer;

  #breadCrumbs?: BreadCrumbs;

  constructor(props: ContentPageProps) {
    super({ title: props.title });
    this.#header = new Header({});
    this.#breadCrumbs = props.showBreadCrumbs ? new BreadCrumbs() : undefined;
    this.placeForBanner = new BaseElement<HTMLElement>({
      tag: 'div',
      class: classes.bannerWrapper,
    });
    this.container = new Container(
      {
        tag: props.containerTag,
        class: classes.content,
      },
      ...(this.#breadCrumbs ? [this.#breadCrumbs as BaseElement<HTMLElement>] : []),
    );
    this.#footer = new Footer();
  }

  render = () => {
    super.render();
    document.body.classList.add(classes.contentPage);
    document.body.append(
      this.#header.node,
      this.placeForBanner.node,
      this.container.node,
      this.#footer.node,
    );
  };
}
