import Container from '@Src/components/ui/container';
import Wrapper from '@Src/components/ui/wrapper';
import logoSvgLight from '@Assets/icons/logo-light.svg';
import errorSvg from '@Assets/icons/error.svg';
import BasePage from '../base-page';
import classes from './style.module.scss';
import BaseElement from '../base-element';

type FormProps = {
  title: string;
};

export default class FormPage extends BasePage {
  protected container: Container;

  modalContainer!: BaseElement<HTMLDivElement>;

  logoComponent!: BaseElement<HTMLImageElement>;

  errorComponent!: BaseElement<HTMLDivElement>;

  formWrapper!: BaseElement<HTMLDivElement>;

  constructor(props: FormProps) {
    console.log(2);
    super({ title: props.title });
    this.container = new Wrapper(
      { tag: 'div', class: classes.formPage },
      // new BaseElement({ tag: 'h1', text: props.title }),
      // this.createBasicContent('Sorry! This is an invalid email address or password'),
    );
  }

  createBasicContent = (errorText: string) => {
    this.logoComponent = new BaseElement<HTMLImageElement>({ tag: 'img', src: logoSvgLight });
    this.createErrorComponent(errorText);
    this.formWrapper = new BaseElement<HTMLDivElement>({ tag: 'div' });
    this.modalContainer = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.modalContainer });

    this.modalContainer.node.append(this.logoComponent.node);
    this.modalContainer.node.append(this.errorComponent.node);
    this.modalContainer.node.append(this.formWrapper.node);
    return this.modalContainer;
  };

  createErrorComponent = (errorText: string) => {
    const errorIcon = new BaseElement<HTMLImageElement>({ tag: 'img', class: classes.errorIcon, src: errorSvg });
    const errorTextElement = new BaseElement<HTMLParagraphElement>({ tag: 'p', text: errorText });
    this.errorComponent = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.errorComponent });
    this.errorComponent.node.append(errorIcon.node);
    this.errorComponent.node.append(errorTextElement.node);
  }

  render = () => {
    super.render();
    document.body.append(this.container.node);
  };
}
