import BaseElement from '@Src/components/common/base-element';
import BaseForm from '@Src/components/common/base-form';
import FormPage from '@Src/components/common/form-page';
import Accordion, { AccordionState } from '@Src/components/ui/accordion';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import CheckBox from '@Src/components/ui/checkbox';
import InputText from '@Src/components/ui/input-text';
import Select from '@Src/components/ui/select';
import {
  validateDateOfBirth,
  validatePostalCode,
  validateRegistrationEmail,
  validateRegistrationPassword,
  validateUserData,
} from '@Src/utils/helpers';
import classes from './style.module.scss';

enum Placehorders {
  EMAIL = 'test5@example.com',
  FIRST_NAME = 'John',
  LAST_NAME = 'Smith',
  DATE_OF_BIRTHDAY = '2005-05-05',
  STREET = 'Street 1',
  CITY = 'City',
  POSTAL_CODE = '12345',
  PASSWORD = '********',
}

enum FormTitle {
  USER = 'User details',
  ADDRESS = 'Set address',
  PASSWORD = 'Create password',
}

const country = ['Belarus', 'Poland', 'Russia'];

interface UserData {
  emil?: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
}

function isFormFull(...inputs: InputText[]): boolean {
  return inputs.every((input) => input.isValid);
}

export default class SignupPage extends FormPage {
  form!: BaseForm;

  #formTitle!: BaseElement<HTMLElement>;

  #formUserDetails!: BaseForm;

  #formAddress!: BaseForm;

  #formPassword!: BaseForm;

  #deliveryAddress!: Accordion;

  #billingAddress!: Accordion;

  #inputsBilling!: BaseElement<HTMLElement>[];

  #inputsDelivery!: BaseElement<HTMLElement>[];

  #nextButton!: Button;

  #signupButton!: Button;

  #userData: UserData;

  constructor() {
    super({ title: 'Registration page' });
    this.addForm(this.renderForm());
    this.addAdditionalLink('if you already have an account', 'login', 'Log in');
    this.#userData = {} as UserData;
  }

  renderForm(): BaseForm {
    this.form = this.#createFormUserDetails();
    return this.form;
  }

  #createFormUserDetails = (): BaseForm => {
    let mail: InputText;
    let firstName: InputText;
    let lastName: InputText;
    let dateOfBirth: InputText;

    this.#formUserDetails = new BaseForm(
      { class: classes.form },
      new BaseElement({
        tag: 'div',
        class: classes.formTitle,
        text: FormTitle.USER,
      }),
      (mail = new InputText(
        {
          name: 'email',
          placeholder: Placehorders.EMAIL,
          minLength: 2,
          type: 'email',
        },
        'E-mail',
        () => validateRegistrationEmail(mail.value),
      )),
      (firstName = new InputText(
        {
          name: 'firstName',
          placeholder: Placehorders.FIRST_NAME,
          maxLength: 20,
          minLength: 2,
        },
        'First Name',
        () => validateUserData(firstName.value),
      )),
      (lastName = new InputText(
        {
          name: 'lastName',
          placeholder: Placehorders.LAST_NAME,
          maxLength: 20,
          minLength: 2,
        },
        'Last Name',
        () => validateUserData(lastName.value),
      )),
      (dateOfBirth = new InputText(
        {
          name: 'date-of-birth',
          placeholder: Placehorders.DATE_OF_BIRTHDAY,
          type: 'date',
          min: '1900-01-01',
          max: '2020-01-01',
        },
        'Date of birth',
        () => validateDateOfBirth(dateOfBirth.value),
      )),
      (this.#nextButton = new Button(
        { text: 'Next', class: classes.buttonNext },
        [ButtonClasses.BIG],
        () => {
          // проверить все поля
          console.log(isFormFull(mail, firstName, lastName, dateOfBirth));
          // собрать все данные в объект #userData
          console.log(mail.value, firstName.value, lastName.value, dateOfBirth.value);
          this.#changeForm(this.#createFormAddresses());
        },
      )),
    );
    return this.#formUserDetails;
  };

  #createFormAddresses = (): BaseForm => {
    this.#inputsDelivery = [];
    this.#inputsBilling = [];

    const checkboxSwitchAddress: CheckBox = new CheckBox(
      { class: classes.checkbox },
      `Use the shipping address for billing purposes`,
      false,
    );
    checkboxSwitchAddress.node.addEventListener('change', () => {
      console.log('!!');
    });

    this.#formAddress = new BaseForm(
      { class: classes.form },
      new BaseElement({
        tag: 'div',
        class: classes.formTitle,
        text: FormTitle.ADDRESS,
      }),
      (this.#deliveryAddress = this.#createAddressAccordion(
        '1. Delivery address',
        AccordionState.OPEN,
        'shipping',
        this.#inputsDelivery,
      )),
      checkboxSwitchAddress,
      (this.#billingAddress = this.#createAddressAccordion(
        '2. Billing address',
        AccordionState.CLOSED,
        'billing',
        this.#inputsBilling,
      )),
      (this.#nextButton = new Button(
        { text: 'Next', class: classes.buttonNext },
        [ButtonClasses.BIG],
        () => {
          // проверить все поля
          console.log(this.#validateFormAddress());
          // собрать все данные в объект #userData
          // console.log(mail.value, firstName.value, lastName.value, dateOfBirth.value);
          // this.#changeForm(this.#createPasswordForm());
        },
      )),
    );

    return this.#formAddress;
  };

  #validateFormAddress = (): boolean => {
    const inputs: InputText[] = [];
    this.#inputsDelivery.forEach((el) => {
      if (el instanceof InputText) inputs.push(el);
    });
    this.#inputsBilling.forEach((el) => {
      if (el instanceof InputText) inputs.push(el);
    });
    return isFormFull(...inputs);
  };

  /* #saveDataFromFormAddress = () => {

  };
*/
  #changeForm = (form: BaseForm) => {
    this.form.node.replaceWith(form.node);
    if (this.additionalLinkElement.node) {
      this.additionalLinkElement.node.remove();
    }
    this.form = form;
  };

  #createPasswordForm = () => {
    let password: InputText;

    this.#formPassword = new BaseForm(
      { class: classes.form },
      new BaseElement({
        tag: 'div',
        class: classes.formTitle,
        text: FormTitle.PASSWORD,
      }),
      (password = new InputText(
        {
          name: 'password',
          minLength: 8,
          type: 'password',
          placeholder: Placehorders.PASSWORD,
        },
        'Password',
        () => validateRegistrationPassword(password.value),
      )),
      new BaseElement({
        tag: 'div',
        class: classes.passwordInfo,
        text: '! The password must be at least 6 characters long. It must contain Latin letters, at least one digit and at least one capital letter.',
      }),
      (this.#signupButton = new Button(
        { text: 'Sign up', class: classes.buttonSignup },
        [ButtonClasses.BIG],
        () => {
          // проверяем валидность пароля
          // регистрируем пользователя
          // настраиваем данные пользователя по данным из формы
        },
      )),
    );
    return this.#formPassword;
  };

  #createAddressAccordion(
    title: string,
    state: AccordionState,
    type: string,
    arrayForInputs: BaseElement<HTMLElement>[],
  ): Accordion {
    let userStreet: InputText;
    let userCity: InputText;
    let userPostalCode: InputText;
    let userCountry: Select;
    let checkbox: CheckBox;

    const accordion = new Accordion(
      title,
      state,
      classes.accordion,
      (userStreet = new InputText(
        {
          name: 'Street',
          placeholder: Placehorders.STREET,
          minLength: 1,
          type: 'text',
        },
        'Street',
        () => validateUserData(userStreet.value),
      )),
      (userCity = new InputText(
        {
          name: 'City',
          placeholder: Placehorders.CITY,
          minLength: 1,
          type: 'text',
        },
        'City',
        () => validateUserData(userCity.value),
      )),
      (userCountry = new Select('Country', country, () => ({
        status: false,
        errorText: 'Error',
      }))),
      (userPostalCode = new InputText(
        {
          name: 'Postal code',
          placeholder: Placehorders.POSTAL_CODE,
          minLength: 1,
          type: 'text',
        },
        'Postal code',
        () => validatePostalCode(userPostalCode.value, userCountry.value),
      )),
      (checkbox = new CheckBox(
        { class: [classes.checkboxAccordion] },
        `Use us default ${type} address`,
        false,
      )),
    );
    arrayForInputs.push(userStreet);
    arrayForInputs.push(userCity);
    arrayForInputs.push(userPostalCode);
    arrayForInputs.push(userCountry);
    arrayForInputs.push(checkbox);
    accordion.header.node.addEventListener('click', this.#toggleAddressAccordion);
    return accordion;
  }

  #toggleAddressAccordion = (event: Event) => {
    const deliveryHeaderNode = this.#deliveryAddress.header.node;
    const billingHeaderNode = this.#billingAddress.header.node;
    const target = event.target as Node;

    if (deliveryHeaderNode.contains(target)) {
      this.#billingAddress.toggleAccordion();
    } else if (billingHeaderNode.contains(target)) {
      this.#deliveryAddress.toggleAccordion();
    }
  };

  // #checkEmailValidation = (): ValidationError => validateRegistrationEmail(this.#email.value);

  // #checkPasswordValidation = (): ValidationError => validateRegistrationPassword(this.#password.value);

  // #checkUserData = (value: string): ValidationError => validateUserData(value);

  // #checkUserDateOfBirth = (value: string): ValidationError => validateDateOfBirth(value);

  // checkValidatePostalCode = (): ValidationError => validatePostalCode(this.#postalCode.value, this.#country.value);
}
