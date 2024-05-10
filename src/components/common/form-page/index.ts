import Container from '@Src/components/ui/container';
import Wrapper from '@Src/components/ui/wrapper';
import BasePage from '../base-page';
import classes from './style.module.scss';

type FormProps = {
  title: string;
};

export default class FormPage extends BasePage {
  protected container: Container;

  constructor(props: FormProps) {
    console.log(2);
    super({ title: props.title });
    this.container = new Wrapper(
      { tag: 'div', class: classes.formPage },
      // new BaseElement({ tag: 'h1', text: props.title }),
    );
  }

  render = () => {
    super.render();
    document.body.append(this.container.node);
  };
}
