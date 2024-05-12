import Container from '@Src/components/ui/container';
import Wrapper from '@Src/components/ui/wrapper';
import logoSvgLight from '@Assets/icons/logo-light.svg';
import errorSvg from '@Assets/icons/error.svg';
import Link from '@Src/components/ui/link';
import BasePage from '../base-page';
import classes from './style.module.scss';
import BaseElement from '../base-element';
import BaseForm from '../base-form';

type FormProps = {
  title: string;
};

export default class FormPage extends BasePage {
  protected container: Container;

  modalContainer!: BaseElement<HTMLDivElement>;

  logoComponent!: BaseElement<HTMLImageElement>;

  logoComponentLink!: Link;

  errorTextElement!: BaseElement<HTMLParagraphElement>;

  errMessageWrapper!: BaseElement<HTMLDivElement>;

  formWrapper!: BaseElement<HTMLDivElement>;

  #errorText!: string;

  constructor(props: FormProps) {
    console.log(2);
    super({ title: props.title });
    this.container = new Wrapper(
      { tag: 'div', class: classes.formPage },
      this.#createBasicContent(),
    );
  }

  addForm = (form: BaseForm) => {
    this.formWrapper.node.append(form.node);
  };

  #createBasicContent = () => {
    // this.logoComponent = new BaseElement<HTMLImageElement>({ tag: 'img', src: logoSvgLight });
    this.createLogoComponent();
    this.createErrorComponent();
    this.formWrapper = new BaseElement<HTMLDivElement>({ tag: 'div' });

    this.modalContainer = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.modalContainer,
    });

    this.modalContainer.node.append(this.logoComponentLink.node);
    this.modalContainer.node.append(this.errMessageWrapper.node);
    this.modalContainer.node.append(this.formWrapper.node);
    return this.modalContainer;
  };

  createLogoComponent = () => {
    this.logoComponent = new BaseElement<HTMLImageElement>({ tag: 'img', src: logoSvgLight });
    this.logoComponentLink = new Link({ href: 'main' });
    this.logoComponentLink.node.append(this.logoComponent.node);
  }

  createErrorComponent = () => {
    const errorIcon = new BaseElement<HTMLImageElement>({
      tag: 'img',
      class: classes.errorIcon,
      src: errorSvg,
    });
    this.errorTextElement = new BaseElement<HTMLParagraphElement>({ tag: 'p' });
    this.errMessageWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.errorComponent,
    });
    this.errMessageWrapper.node.append(errorIcon.node);
    this.errMessageWrapper.node.append(this.errorTextElement.node);

    this.errMessageWrapper.node.hidden = true;
  };

  showErrorComponent = (errMessage: string) => {
    this.#errorText = errMessage;
    this.errorTextElement.node.textContent = this.#errorText;
    this.errMessageWrapper.node.hidden = false;
  };

  render = () => {
    super.render();
    document.body.append(this.container.node);
  };
}
