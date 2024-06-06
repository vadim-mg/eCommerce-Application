import errorSvg from '@Assets/icons/error.svg';
import logoSvgLight from '@Assets/icons/logo-light.svg';
import Container from '@Src/components/ui/container';
import Link from '@Src/components/ui/link';
import Wrapper from '@Src/components/ui/wrapper';
import { AppRoutes } from '@Src/router/routes';
import BaseElement from '../base-element';
import BaseForm from '../base-form';
import BasePage from '../base-page';
import classes from './style.module.scss';

type FormProps = {
  title: string;
};

export default class FormPage extends BasePage {
  protected container: Container;

  modalContainer!: BaseElement<HTMLDivElement>;

  logoComponent!: BaseElement<HTMLElement>;

  logoComponentLink!: Link;

  errorTextElement!: BaseElement<HTMLParagraphElement>;

  errMessageWrapper!: BaseElement<HTMLDivElement>;

  formWrapper!: BaseElement<HTMLDivElement>;

  additionalLinkElement!: BaseElement<HTMLDivElement>;

  #errorText!: string;

  constructor(props: FormProps) {
    super({ title: props.title });
    this.container = new Wrapper(
      { tag: 'div', class: classes.formPage },
      this.#createBasicContent(),
    );
  }

  addForm = (form: BaseForm) => {
    this.formWrapper.node.append(form.node);
  };

  addAdditionalLink = (promptMessage: string, linkPath: string, linkText: string) => {
    this.additionalLinkElement = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.signupPromptWrapper },
      new BaseElement({ tag: 'p', textContent: 'or' }),
      new BaseElement({ tag: 'p', textContent: promptMessage }),
      new Link({ href: linkPath, text: linkText, class: classes.signupLink }),
    );
    this.formWrapper.node.append(this.additionalLinkElement.node);
  };

  #createBasicContent = () => {
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
    this.logoComponent = new BaseElement<HTMLElement>({
      tag: 'div',
      innerHTML: logoSvgLight,
      class: classes.logoImg,
    });
    this.logoComponentLink = new Link({ href: AppRoutes.MAIN, class: classes.logoLink });
    this.logoComponentLink.node.append(this.logoComponent.node);
  };

  createErrorComponent = () => {
    const errorIcon = new BaseElement<HTMLElement>({
      tag: 'div',
      class: classes.errorIcon,
      innerHTML: errorSvg,
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

  hideErrorComponent = () => {
    this.errorTextElement.node.textContent = '';
    this.errMessageWrapper.node.hidden = true;
  };

  render = () => {
    super.render();
    document.body.append(this.container.node);
  };
}
