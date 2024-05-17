import Container from '@Src/components/ui/container';
import Footer from '@Src/components/ui/footer';
import Header from '@Src/components/ui/header';
import Banner from '@Src/components/ui/banner';
import BasePage from '../base-page';
import classes from './style.module.scss';

type ContentPageProps = {
  title: string;
  containerTag: keyof HTMLElementTagNameMap;
};

export default class ContentPage extends BasePage {
  protected container: Container;

  header: Header;

  banner: Banner;

  footer: Footer;

  constructor(props: ContentPageProps) {
    super({ title: props.title });
    this.header = new Header({});
    this.banner = new Banner({});
    this.container = new Container({ tag: props.containerTag, class: classes.content });
    this.footer = new Footer();
  }

  render = () => {
    super.render();
    document.body.classList.add(classes.contentPage);
    document.body.append(this.header.node, this.banner.node, this.container.node, this.footer.node);
  };
}
