import Container from '@Src/components/ui/container';
import classes from './style.module.scss';

type PageProps = {
  containerTag: keyof HTMLElementTagNameMap;
  title: string;
};

export default class BasePage {
  protected container: Container;

  constructor(props: PageProps) {
    this.container = new Container({ tag: props.containerTag });
  }

  // this method render page (clear document.body and append container created by constructor)
  render() {
    document.body.innerHTML = '';
    document.body.classList.remove(...document.body.classList);
    document.body.classList.add(classes.page);
    document.body.append(this.container.node);
  }
}
