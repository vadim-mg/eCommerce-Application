import Container from '@Src/components/ui/container';
import Header from '@Src/components/ui/header';
import BasePage from '../base-page';
import classes from './style.module.scss';
import BaseElement from '../base-element';

type ContentPageProps = {
  title: string;
  containerTag: keyof HTMLElementTagNameMap;
};

export default class ContentPage extends BasePage {
  protected container: Container;

  header: Header;

  footer: BaseElement<HTMLDivElement>;

  constructor(props: ContentPageProps) {
    console.log(2);
    super({ title: props.title });
    this.header = new Header({});
    this.container = new Container({ tag: props.containerTag, class: classes.content });
    this.footer = new BaseElement({ tag: 'footer', text: 'footer', class: classes.footer });
  }

  render = () => {
    super.render();
    document.body.classList.add(classes.contentPage);
    document.body.append(this.header.node, this.container.node, this.footer.node);
  };
}
