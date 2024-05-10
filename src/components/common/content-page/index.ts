import Container from '@Src/components/ui/container';
import BasePage from '../base-page';
import classes from './style.module.scss';

type ContentPageProps = {
  title: string;
  containerTag: keyof HTMLElementTagNameMap;
};

export default class ContentPage extends BasePage {
  protected container: Container;

  constructor(props: ContentPageProps) {
    console.log(2);
    super({ title: props.title });
    this.container = new Container({ tag: props.containerTag });
  }

  render = () => {
    super.render();
    document.body.classList.add(classes.contentPage);
    document.body.append(this.container.node);
  };
}
