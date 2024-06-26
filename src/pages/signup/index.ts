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
  validateEmail,
  validatePassword,
  validatePostalCode,
  validateStreet,
  validateUserData,
} from '@Src/utils/helpers';

import auth from '@Src/controllers/auth';
import { AppRoutes } from '@Src/router/routes';
import { BaseAddress, CustomerDraft, MyCustomerDraft } from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
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

export const country = ['Belarus', 'Poland', 'Russia'];
export const COUNTRY_CODES = ['BY', 'PL', 'RU'];

interface UserData {
  mail?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  deliveryStreet?: string;
  deliveryCity?: string;
  deliveryCountry: string;
  deliveryCode?: string;
  deliveryIsDefault?: boolean;
  billingStreet?: string;
  billingCity?: string;
  billingCountry: string;
  billingCode?: string;
  billingIsDefault?: boolean;
  password?: string;
  billingEqualDelivery: boolean;
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

export function validateForm(form: InputsUserDetail | InputsAddress | InputsAddress[]): boolean {
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

  #hiddenBillingBlock!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ title: 'Registration page' });
    this.addForm(this.renderForm());
    this.#userData = {
      billingEqualDelivery: true,
    } as UserData;
    this.addEventListeners();
    this.addAdditionalLink('if you already have an account', AppRoutes.LOGIN, 'Log in');
    // this.#changeForm(this.#createFormAddresses(), FormTitle.ADDRESS); // todo : clear it after debug
  }

  renderForm(): BaseForm {
    this.form = this.#createFormUserDetails();
    return this.form;
  }

  addEventListeners = () => {
    this.#inputsUserDetail.mail.inputElement.node.addEventListener('change', () => {
      if (this.#inputsUserDetail.mail.isValid) {
        SignupPage.isEmailFree(
          this.#inputsUserDetail.mail.value,
          () => {
            this.#inputsUserDetail.mail.isValid = true;
            this.#inputsUserDetail.mail.errorText = '';
            this.#inputsUserDetail.mail.hiddenError();
          },
          this.#inputsUserDetail.mail.showError,
        );
      }
    });
  };

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
        () => validateEmail(this.#inputsUserDetail.mail.value), // TODO: check the uniqueness of the address on the server side
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
      new Button(
        { text: 'Next', class: classes.buttonNext },
        [ButtonClasses.BIG],
        this.#handlerOnClickButtonUserDetail,
      ),
    );
    return this.#formUserDetails;
  };

  #createFormAddresses = (): BaseForm => {
    this.#checkboxSwitchAddress = new CheckBox(
      { class: classes.checkbox },
      `Use the delivery address for billing purposes`,
      this.#userData.billingEqualDelivery,
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
      // this.#checkboxSwitchAddress,
      (this.#billingAddress = this.#createBillingAddressAccordion(
        '2. Billing address',
        AccordionState.OPEN,
      )),
      (this.#hiddenBillingBlock = new BaseElement({
        tag: 'div',
        text: '2. Billing address:',
        class: [classes.hiddenBillingBlock],
      })),
      new Button({ text: 'Next', class: classes.buttonNext }, [ButtonClasses.BIG], () => {
        this.#handlerOnClickButtonFormAddress();
      }),
    );

    return this.#formAddress;
  };

  #handlerOnClickButtonFormAddress = () => {
    if (
      validateForm(
        this.#checkboxSwitchAddress.checked
          ? [this.#inputsDeliveryAddress]
          : [this.#inputsBillingAddress, this.#inputsDeliveryAddress],
      )
    ) {
      this.#saveDataFromFormAddress();
      this.#changeForm(this.#createPasswordForm());
    }
  };

  #handlerOnClickButtonUserDetail = (event: Event) => {
    const button = event.target as HTMLButtonElement;
    if (validateForm(this.#inputsUserDetail)) {
      button.disabled = true;
      SignupPage.isEmailFree(
        this.#inputsUserDetail.mail.value,
        () => {
          this.#saveDataFromUserDetail();
          this.#changeForm(this.#createFormAddresses(), FormTitle.ADDRESS);
        },
        this.#inputsUserDetail.mail.showError,
      ).finally(() => {
        button.disabled = false;
      });
    }
  };

  static isEmailFree = (
    email: string,
    onFreeCb: () => void,
    onErrorCb: (errMessage: string) => void,
  ) =>
    auth
      .isEmailExist(email)
      .then((exist) => {
        if (exist) {
          onErrorCb(`Email ${email} is already exist!`);
        } else {
          onFreeCb();
        }
      })
      .catch(onErrorCb);

  #saveDataFromUserDetail = () => {
    this.#userData.mail = this.#inputsUserDetail.mail.value;
    this.#userData.firstName = this.#inputsUserDetail.firstName.value;
    this.#userData.lastName = this.#inputsUserDetail.lastName.value;
    this.#userData.dateOfBirth = this.#inputsUserDetail.dateOfBirth.value;
  };

  #saveDataFromFormAddress = () => {
    this.#userData.deliveryStreet = this.#inputsDeliveryAddress.street.value;
    this.#userData.deliveryCity = this.#inputsDeliveryAddress.city.value;
    this.#userData.deliveryCode = this.#inputsDeliveryAddress.postalCode.value;
    this.#userData.deliveryCountry = this.#inputsDeliveryAddress.country.selectedValue;
    this.#userData.deliveryIsDefault = this.#inputsDeliveryAddress.checkboxDefault.checked;
    this.#userData.billingIsDefault = this.#userData.deliveryIsDefault;

    this.#userData.billingEqualDelivery = this.#checkboxSwitchAddress.checked;

    if (!this.#checkboxSwitchAddress.checked) {
      this.#userData.billingStreet = this.#inputsBillingAddress.street.value;
      this.#userData.billingCity = this.#inputsBillingAddress.city.value;
      this.#userData.billingCode = this.#inputsBillingAddress.postalCode.value;
      this.#userData.billingCountry = this.#inputsBillingAddress.country.selectedValue;
      this.#userData.billingIsDefault = this.#inputsBillingAddress.checkboxDefault.checked;
    }
  };

  #changeForm = (form: BaseForm, formTitle?: FormTitle) => {
    this.hideErrorComponent();
    this.form.node.replaceWith(form.node);
    if (this.additionalLinkElement.node) {
      this.additionalLinkElement.node.remove();
    }
    this.form = form;
    if (formTitle === FormTitle.ADDRESS) {
      this.form.node.classList.add(classes.formBig);
    } else {
      this.form.node.classList.remove(classes.formBig);
    }
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
            this.#inputsBillingAddress.country.selectedValue,
          ),
      ),
      checkboxDefault: new CheckBox(
        { class: [classes.checkboxAccordion] },
        `Use as default billing address`,
        false,
      ),
    };
  };

  #createDeliveryAddressInputs = () => {
    this.#inputsDeliveryAddress = {
      country: new Select('Country', country, () => ({
        status: true,
        errorText: 'Error',
      })),
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
            this.#inputsDeliveryAddress.country.selectedValue,
          ),
      ),
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
      checkboxDefault: new CheckBox(
        { class: [classes.checkboxAccordion] },
        `Use as default delivery address`,
        false,
      ),
    };
  };

  #createBillingAddressAccordion(title: string, state: AccordionState): Accordion {
    this.#createBillingAddressInputs();
    const accordion = new Accordion(
      title,
      state,
      [classes.accordion, classes.accordionHidden],
      new BaseElement<HTMLDivElement>(
        { tag: 'div', class: classes.selectField },
        this.#inputsBillingAddress.country,
      ),
      this.#inputsBillingAddress.city,
      this.#inputsBillingAddress.postalCode,
      this.#inputsBillingAddress.street,
      this.#inputsBillingAddress.checkboxDefault,
    );
    return accordion;
  }

  #createDeliveryAddressAccordion(title: string, state: AccordionState): Accordion {
    this.#createDeliveryAddressInputs();
    const accordion = new Accordion(
      title,
      state,
      classes.accordion,
      new BaseElement<HTMLDivElement>(
        { tag: 'div', class: classes.selectField },
        this.#inputsDeliveryAddress.country,
      ),
      this.#inputsDeliveryAddress.city,
      this.#inputsDeliveryAddress.postalCode,
      this.#inputsDeliveryAddress.street,
      this.#inputsDeliveryAddress.checkboxDefault,
      this.#checkboxSwitchAddress,
    );
    // accordion.header.node.addEventListener('click', this.#toggleAddressAccordion);
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
      this.#inputsBillingAddress.city.value = this.#inputsDeliveryAddress.city.value;
      this.#inputsBillingAddress.country.selectedValue =
        this.#inputsDeliveryAddress.country.selectedValue;
      this.#inputsBillingAddress.postalCode.value = this.#inputsDeliveryAddress.postalCode.value;
      this.#inputsBillingAddress.checkboxDefault.checked =
        this.#inputsDeliveryAddress.checkboxDefault.checked;
      this.#billingAddress.node.classList.add(classes.accordionHidden);
      this.#hiddenBillingBlock.node.hidden = false;
    } else {
      this.#inputsBillingAddress.street.value = '';
      this.#inputsBillingAddress.city.value = '';
      this.#inputsBillingAddress.postalCode.value = '';
      this.#inputsBillingAddress.checkboxDefault.checked = false;
      this.#billingAddress.node.classList.remove(classes.accordionHidden);
      this.#hiddenBillingBlock.node.hidden = true;
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
          autocomplete: 'new-password',
        },
        'Password',
        () => validatePassword(this.#passwordInput.value),
      )),
      new BaseElement({
        tag: 'div',
        class: classes.passwordInfo,
        text: '! Password must contain at least one uppercase english letter, one lowercase english letter, one digit, and one special character (!@#$%^&*).',
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
    if (validatePassword(this.#passwordInput.value).status === true) {
      this.#userData.password = this.#passwordInput.value;

      const addresses: BaseAddress[] = [
        {
          id: '0',
          country: COUNTRY_CODES[country.indexOf(this.#userData?.deliveryCountry)],
          city: this.#userData.deliveryCity,
          postalCode: this.#userData.deliveryCode,
          streetName: this.#userData.deliveryStreet,
        },
      ];

      if (!this.#userData.billingEqualDelivery) {
        addresses.push({
          id: '1',
          country: COUNTRY_CODES[country.indexOf(this.#userData?.billingCountry)],
          city: this.#userData.billingCity,
          postalCode: this.#userData.billingCode,
          streetName: this.#userData.billingStreet,
        });
      }

      const sendingObject: CustomerDraft = {
        ...{
          email: this.#userData.mail ?? '',
          password: this.#userData.password,
          firstName: this.#userData.firstName,
          lastName: this.#userData.lastName,
          dateOfBirth: this.#userData.dateOfBirth,
          addresses,
          shippingAddresses: [0],
          billingAddresses: [this.#userData.billingEqualDelivery ? 0 : 1],
        },
        ...(this.#userData.deliveryIsDefault
          ? {
              defaultShippingAddress: 0,
            }
          : {}),
        ...(this.#userData.billingIsDefault
          ? {
              defaultBillingAddress: this.#userData.billingEqualDelivery ? 0 : 1,
            }
          : {}),
      };

      auth.signUp(sendingObject as MyCustomerDraft).catch((error: HttpErrorType) => {
        this.showErrorComponent(error.message);
      });
    } else {
      this.showErrorComponent('Password complexity conditions are not met!');
    }
  };
}
