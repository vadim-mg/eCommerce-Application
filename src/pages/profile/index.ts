import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import userProfileLogo from '@Assets/icons/profile-icon-dark.svg';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import classes from './style.module.scss';
// import SignupPage from '../signup';

export default class ProfilePage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  titleWrapper!: BaseElement<HTMLDivElement>;

  userDataWrapper!: BaseElement<HTMLDivElement>;

  userDataDetailsWrapper!: BaseElement<HTMLDivElement>;

  userPasswordWrapper!: BaseElement<HTMLDivElement>;

  editDeleteBtnWrapper!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'profile page' });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.profile,
      },
      this.createTitleComponent(),
      this.createUserDataComponent(),
      this.createEditDeleteBtnComponent(),
    );
  };

  createTitleComponent = () => {
    this.titleWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.titleWrapper },
      new BaseElement<HTMLImageElement>({
        tag: 'img',
        src: userProfileLogo,
        alt: 'User profile logo',
      }),
      new BaseElement<HTMLHeadingElement>({
        tag: 'h1',
        class: classes.title,
        text: 'Your profile',
      }),
    );
    return this.titleWrapper;
  };

  createEditDeleteBtnComponent = () => {
    this.editDeleteBtnWrapper = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.editDeleteBtnWrapper },
      new Button({ text: 'Edit', class: classes.button }, ButtonClasses.NORMAL, () => console.log('Edit')),
      new Button({ text: 'Delete', class: classes.button }, ButtonClasses.NORMAL, () => console.log('Delete')),
    );
    return this.editDeleteBtnWrapper;
  }

  createUserDataComponent = () => {
    const userDataDetailsTitle = new BaseElement<HTMLHeadingElement>({
      tag: 'h2',
      text: 'Personal details',
    });
    // const userDataDetailsForm = new SignupPage().createFormUserDetails();
    this.userDataDetailsWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.userDataDetailsWrapper },
      userDataDetailsTitle,
    );

    this.userPasswordWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.userPasswordWrapper,
    });

    this.userDataWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.userDataWrapper,
    });
    this.userDataWrapper.node.append(this.userDataDetailsWrapper.node);
    this.userDataWrapper.node.append(this.userPasswordWrapper.node);
    return this.userDataWrapper;
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
