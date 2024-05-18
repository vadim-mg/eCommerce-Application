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
  deliveryStreet?: string;
  deliveryCity?: string;
  deliveryCountry?: string;
  deliveryCode?: string;
  deliveryIsDefault?: boolean;
  billingStreet?: string;
  billingCity?: string;
  billingCountry?: string;
  billingCode?: string;
  billingIsDefault?: boolean;
}

interface InputsMap {
  street: InputText;
  city: InputText;
  postalCode: InputText;
  country: Select;
  checkboxDefault: CheckBox;
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

  #inputsBillingAddress!: InputsMap;

  #inputsDeliveryAddress!: InputsMap;

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
      (this.#deliveryAddress = this.#createDeliveryAddressAccordion(
        '1. Delivery address',
        AccordionState.OPEN,
      )),
      checkboxSwitchAddress,
      (this.#billingAddress = this.#createBillingAddressAccordion(
        '2. Billing address',
        AccordionState.CLOSED,
      )),
      (this.#nextButton = new Button(
        { text: 'Next', class: classes.buttonNext },
        [ButtonClasses.BIG],
        () => {
          this.#onButtonFormAddress();
        },
      )),
    );

    return this.#formAddress;
  };

  #onButtonFormAddress = () => {
    if (this.#validateFormAddress()) {
      this.#saveDataFromFormAddress();
      this.#changeForm(this.#createPasswordForm());
    }
    console.log(this.#userData);
    // вывести просьбу заполнить все инпуты
  };

  #validateFormAddress = (): boolean => {
    const inputs: InputText[] = [];
    // Собираем все инпуты из this.#inputsBillingAddress
    Object.values(this.#inputsBillingAddress).forEach((input) => {
      if (input instanceof InputText) {
        inputs.push(input);
      }
    });

    // Добавляем инпуты из this.#inputsDeliveryAddress
    Object.values(this.#inputsDeliveryAddress).forEach((input) => {
      if (input instanceof InputText) {
        inputs.push(input);
      }
    });
    return isFormFull(...inputs);
  };

  #saveDataFromFormAddress = () => {
    console.log(this.#inputsBillingAddress.street);
    this.#userData.billingStreet = this.#inputsBillingAddress.street.value;
    this.#userData.billingCity = this.#inputsBillingAddress.city.value;
    this.#userData.billingCode = this.#inputsBillingAddress.postalCode.value;
    this.#userData.billingCountry = this.#inputsBillingAddress.country.value;
    this.#userData.billingIsDefault = this.#inputsBillingAddress.checkboxDefault.checked;

    this.#userData.deliveryStreet = this.#inputsDeliveryAddress.street.value;
    this.#userData.deliveryCity = this.#inputsDeliveryAddress.city.value;
    this.#userData.deliveryCode = this.#inputsDeliveryAddress.postalCode.value;
    this.#userData.deliveryCountry = this.#inputsDeliveryAddress.country.value;
    this.#userData.deliveryIsDefault = this.#inputsDeliveryAddress.checkboxDefault.checked;
  };

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

  #createBillingAddressInputs = () => {
    this.#inputsBillingAddress = {
      street: new InputText(
        {
          name: 'Street',
          placeholder: Placehorders.STREET,
          minLength: 1,
          type: 'text',
        },
        'Street',
        () => validateUserData(this.#inputsBillingAddress.street.value),
      ),
      city: new InputText(
        {
          name: 'City',
          placeholder: Placehorders.CITY,
          minLength: 1,
          type: 'text',
        },
        'City',
        () => validateUserData(this.#inputsBillingAddress.city.value),
      ),
      country: new Select('Country', country, () => ({
        status: true,
        errorText: 'Error',
      })),
      postalCode: new InputText(
        {
          name: 'Postal code',
          placeholder: Placehorders.POSTAL_CODE,
          minLength: 1,
          type: 'text',
        },
        'Postal code',
        () =>
          validatePostalCode(
            this.#inputsBillingAddress.postalCode.value,
            this.#inputsBillingAddress.country.value,
          ),
      ),
      checkboxDefault: new CheckBox(
        { class: [classes.checkboxAccordion] },
        `Use us default billing address`,
        false,
      ),
    };
  };

  #createDeliveryAddressInputs = () => {
    this.#inputsDeliveryAddress = {
      street: new InputText(
        {
          name: 'Street',
          placeholder: Placehorders.STREET,
          minLength: 1,
          type: 'text',
        },
        'Street',
        () => validateUserData(this.#inputsDeliveryAddress.street.value),
      ),
      city: new InputText(
        {
          name: 'City',
          placeholder: Placehorders.CITY,
          minLength: 1,
          type: 'text',
        },
        'City',
        () => validateUserData(this.#inputsDeliveryAddress.city.value),
      ),
      country: new Select('Country', country, () => ({
        status: true,
        errorText: 'Error',
      })),
      postalCode: new InputText(
        {
          name: 'Postal code',
          placeholder: Placehorders.POSTAL_CODE,
          minLength: 1,
          type: 'text',
        },
        'Postal code',
        () =>
          validatePostalCode(
            this.#inputsDeliveryAddress.postalCode.value,
            this.#inputsDeliveryAddress.country.value,
          ),
      ),
      checkboxDefault: new CheckBox(
        { class: [classes.checkboxAccordion] },
        `Use us default delivery address`,
        false,
      ),
    };
  };

  #createBillingAddressAccordion(title: string, state: AccordionState): Accordion {
    this.#createBillingAddressInputs();
    const accordion = new Accordion(
      title,
      state,
      classes.accordion,
      this.#inputsBillingAddress.street,
      this.#inputsBillingAddress.city,
      this.#inputsBillingAddress.country,
      this.#inputsBillingAddress.postalCode,
      this.#inputsBillingAddress.checkboxDefault,
    );
    accordion.header.node.addEventListener('click', this.#toggleAddressAccordion);
    return accordion;
  }

  #createDeliveryAddressAccordion(title: string, state: AccordionState): Accordion {
    this.#createDeliveryAddressInputs();
    const accordion = new Accordion(
      title,
      state,
      classes.accordion,
      this.#inputsDeliveryAddress.street,
      this.#inputsDeliveryAddress.city,
      this.#inputsDeliveryAddress.country,
      this.#inputsDeliveryAddress.postalCode,
      this.#inputsDeliveryAddress.checkboxDefault,
    );
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
}
