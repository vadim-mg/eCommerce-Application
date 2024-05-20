import BaseElement from '@Src/components/common/base-element';
import BaseForm from '@Src/components/common/base-form';
import FormPage from '@Src/components/common/form-page';
import Accordion, { AccordionState } from '@Src/components/ui/accordion';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import CheckBox from '@Src/components/ui/checkbox';
import InputText from '@Src/components/ui/input-text';
import Select from '@Src/components/ui/select';
import {
  validateCity,
  validateDateOfBirth,
  validatePostalCode,
  validateRegistrationEmail,
  validateRegistrationPassword,
  validateStreet,
  validateUserData,
} from '@Src/utils/helpers';

import auth from '@Src/controllers/auth';
import classes from './style.module.scss';

enum Placehorders {
  EMAIL = 'test5@example.com',
  FIRST_NAME = 'John',
  LAST_NAME = 'Smith',
  DATE_OF_BIRTHDAY = '2005-05-05',
  STREET = 'Street 1',
  CITY = 'City',
  POSTAL_CODE = 'Postal code',
  PASSWORD = '********',
}

enum FormTitle {
  USER = 'User details',
  ADDRESS = 'Set address',
  PASSWORD = 'Create password',
}

const country = ['Belarus', 'Poland', 'Russia'];

interface UserData {
  mail?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
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
  password?: string;
}

interface InputsAddress {
  street: InputText;
  city: InputText;
  postalCode: InputText;
  country: Select;
  checkboxDefault: CheckBox;
}

interface InputsUserDetail {
  mail: InputText;
  firstName: InputText;
  lastName: InputText;
  dateOfBirth: InputText;
}

function validateForm(form: InputsUserDetail | InputsAddress | InputsAddress[]): boolean {
  const validatedForms = Array.isArray(form) ? form : [form];

  const inputs = validatedForms.reduce(
    (acc: InputText[], validatedForm) => [
      ...acc,
      ...Object.values(validatedForm)
        // validates only InputText data types, so we collect only such elements into the array,
        // excluding Checkbox and Select
        .filter((input) => input instanceof InputText),
    ],
    [],
  );

  inputs.forEach((input) => {
    input.validate();
  });
  console.log(inputs);
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

  #inputsUserDetail!: InputsUserDetail;

  #inputsBillingAddress!: InputsAddress;

  #inputsDeliveryAddress!: InputsAddress;

  #passwordInput!: InputText;

  #checkboxSwitchAddress!: CheckBox;

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
    this.#inputsUserDetail = {
      mail: new InputText(
        {
          name: 'email',
          placeholder: Placehorders.EMAIL,
          minLength: 2,
          type: 'email',
        },
        'E-mail',
        () => validateRegistrationEmail(this.#inputsUserDetail.mail.value),
      ),
      firstName: new InputText(
        {
          name: 'firstName',
          placeholder: Placehorders.FIRST_NAME,
          maxLength: 20,
          minLength: 1,
        },
        'First Name',
        () => validateUserData(this.#inputsUserDetail.firstName.value),
      ),
      lastName: new InputText(
        {
          name: 'lastName',
          placeholder: Placehorders.LAST_NAME,
          maxLength: 20,
          minLength: 1,
        },
        'Last Name',
        () => validateUserData(this.#inputsUserDetail.lastName.value),
      ),
      dateOfBirth: new InputText(
        {
          name: 'date-of-birth',
          placeholder: Placehorders.DATE_OF_BIRTHDAY,
          type: 'date',
          min: '1900-01-01',
          max: '2020-01-01',
        },
        'Date of birth',
        () => validateDateOfBirth(this.#inputsUserDetail.dateOfBirth.value),
      ),
    };

    this.#formUserDetails = new BaseForm(
      { class: classes.form },
      new BaseElement({
        tag: 'div',
        class: classes.formTitle,
        text: FormTitle.USER,
      }),
      this.#inputsUserDetail.mail,
      this.#inputsUserDetail.firstName,
      this.#inputsUserDetail.lastName,
      this.#inputsUserDetail.dateOfBirth,
      new Button({ text: 'Next', class: classes.buttonNext }, [ButtonClasses.BIG], this.#handlerOnClickButtonUserDetail),
    );
    return this.#formUserDetails;
  };

  #createFormAddresses = (): BaseForm => {
    this.#checkboxSwitchAddress = new CheckBox(
      { class: classes.checkbox },
      `Use the shipping address for billing purposes`,
      false,
    );
    this.#checkboxSwitchAddress.inputElement.node.addEventListener(
      'change',
      this.#toggleCopyAddressData,
    );

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
      this.#checkboxSwitchAddress,
      (this.#billingAddress = this.#createBillingAddressAccordion(
        '2. Billing address',
        AccordionState.CLOSED,
      )),
      new Button({ text: 'Next', class: classes.buttonNext }, [ButtonClasses.BIG], () => {
        this.#handlerOnClickButtonFormAddress();
      }),
    );

    return this.#formAddress;
  };

  #handlerOnClickButtonFormAddress = () => {
    if (validateForm([this.#inputsBillingAddress, this.#inputsDeliveryAddress])) {
      this.#saveDataFromFormAddress();
      this.#changeForm(this.#createPasswordForm());
    }
    console.log(this.#userData);
  };

  #handlerOnClickButtonUserDetail = (event: Event) => {
    const button = event.target as HTMLButtonElement;
    button.disabled = true;
    if (validateForm(this.#inputsUserDetail)) {
      SignupPage.isEmailFree(
        this.#inputsUserDetail.mail.value,
        () => {
          this.#saveDataFromUserDetail();
          this.#changeForm(this.#createFormAddresses());
        },
        this.showErrorComponent)
        .finally(() => {
          button.disabled = false;
        });
    }
    console.log(this.#userData);
  };

  static isEmailFree = (
    email: string, onFreeCb: () => void, onErrorCb: (errMessage: string) => void) =>
    auth
      .isEmailExist(email)
      .then((exist) => {
        if (exist) {
          onErrorCb(`Email ${email} is already exist!`);
        } else {
          onFreeCb();
        }
      })
      .catch(onErrorCb)
    ;

  #saveDataFromUserDetail = () => {
    this.#userData.mail = this.#inputsUserDetail.mail.value;
    this.#userData.firstName = this.#inputsUserDetail.firstName.value;
    this.#userData.lastName = this.#inputsUserDetail.lastName.value;
    this.#userData.dateOfBirth = this.#inputsUserDetail.dateOfBirth.value;
  };

  #saveDataFromFormAddress = () => {
    this.#userData.billingStreet = this.#inputsBillingAddress.street.value;
    this.#userData.billingCity = this.#inputsBillingAddress.city.value;
    this.#userData.billingCode = this.#inputsBillingAddress.postalCode.value;
    this.#userData.billingCountry = this.#inputsBillingAddress.country.value;
    this.#userData.billingIsDefault = this.#inputsBillingAddress.checkboxDefault.checked;

    if (this.#checkboxSwitchAddress.checked) {
      this.#userData.deliveryStreet = this.#inputsBillingAddress.street.value;
      this.#userData.deliveryCity = this.#inputsBillingAddress.city.value;
      this.#userData.deliveryCode = this.#inputsBillingAddress.postalCode.value;
      this.#userData.deliveryCountry = this.#inputsBillingAddress.country.value;
      this.#userData.deliveryIsDefault = this.#inputsBillingAddress.checkboxDefault.checked;
    } else {
      this.#userData.deliveryStreet = this.#inputsDeliveryAddress.street.value;
      this.#userData.deliveryCity = this.#inputsDeliveryAddress.city.value;
      this.#userData.deliveryCode = this.#inputsDeliveryAddress.postalCode.value;
      this.#userData.deliveryCountry = this.#inputsDeliveryAddress.country.value;
      this.#userData.deliveryIsDefault = this.#inputsDeliveryAddress.checkboxDefault.checked;
    }
  };

  #changeForm = (form: BaseForm) => {
    this.hideErrorComponent();
    this.form.node.replaceWith(form.node);
    if (this.additionalLinkElement.node) {
      this.additionalLinkElement.node.remove();
    }
    this.form = form;
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
        () => validateStreet(this.#inputsBillingAddress.street.value),
      ),
      city: new InputText(
        {
          name: 'City',
          placeholder: Placehorders.CITY,
          minLength: 1,
          type: 'text',
        },
        'City',
        () => validateCity(this.#inputsBillingAddress.city.value),
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
        () => validateStreet(this.#inputsDeliveryAddress.street.value),
      ),
      city: new InputText(
        {
          name: 'City',
          placeholder: Placehorders.CITY,
          minLength: 1,
          type: 'text',
        },
        'City',
        () => validateCity(this.#inputsDeliveryAddress.city.value),
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

  #toggleCopyAddressData = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.#inputsBillingAddress.street.value = this.#inputsDeliveryAddress.street.value;
      this.#inputsBillingAddress.city.value = this.#inputsDeliveryAddress.city.value;
      this.#inputsBillingAddress.country.value = this.#inputsDeliveryAddress.country.value;
      this.#inputsBillingAddress.postalCode.value = this.#inputsDeliveryAddress.postalCode.value;
      this.#inputsBillingAddress.checkboxDefault.checked =
        this.#inputsDeliveryAddress.checkboxDefault.checked;
    } else {
      this.#inputsBillingAddress.street.value = '';
      this.#inputsBillingAddress.city.value = '';
      this.#inputsBillingAddress.country.value = this.#inputsDeliveryAddress.country.value;
      this.#inputsBillingAddress.postalCode.value = '';
      this.#inputsBillingAddress.checkboxDefault.checked = false;
    }
  };

  #createPasswordForm = () => {
    this.#formPassword = new BaseForm(
      { class: classes.form },
      new BaseElement({
        tag: 'div',
        class: classes.formTitle,
        text: FormTitle.PASSWORD,
      }),
      (this.#passwordInput = new InputText(
        {
          name: 'password',
          minLength: 8,
          type: 'password',
          placeholder: Placehorders.PASSWORD,
        },
        'Password',
        () => validateRegistrationPassword(this.#passwordInput.value),
      )),
      new BaseElement({
        tag: 'div',
        class: classes.passwordInfo,
        text: '! The password must be at least 8 characters long. It must contain at least one digit, one lowercase letter and at least one capital letter.',
      }),
      (this.#signupButton = new Button(
        { text: 'Sign up', class: classes.buttonSignup },
        [ButtonClasses.BIG],
        () => {
          this.#onButtonSignup();
        },
      )),
    );
    return this.#formPassword;
  };

  #onButtonSignup = () => {
    if (validateRegistrationPassword(this.#passwordInput.value)) {
      this.#userData.password = this.#passwordInput.value;
      // TODO:
      // implement server side registration
      // all registration data is stored in the object this.#userData
      // 1.send a user registration request
      // 2. send a request to set up a delivery address
      // 3. send a request to set up a billing address
      // 4. send a request to set up date of birthday
    }
    console.log(this.#userData);
  };
}
