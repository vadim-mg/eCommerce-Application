import BaseElement from '@Src/components/common/base-element';
import BaseForm from '@Src/components/common/base-form';
import FormPage from '@Src/components/common/form-page';
import Accordion, { AccordionState } from '@Src/components/ui/accordion';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import CheckBox from '@Src/components/ui/checkbox';
import InputText from '@Src/components/ui/input-text';
import Select from '@Src/components/ui/select';
import { validateEmail, validatePassword } from '@Src/utils/helpers';
import { ValidationError } from '../login';
import classes from './style.module.scss';

enum Placehorders {
  EMAIL = 'test5@example.com',
  FIRST_NAME = 'John',
  LAST_NAME = 'Smith',
  DATE_OF_BIRTHDAY = '2005-05-05',
  STREET = 'Street 1',
  CITY = 'City',
  POSTAL_CODE = '12345',
};

enum FormTitle {
  USER = 'User details',
  ADDRESS = 'Set address',
  PASSWORD = 'Create password',
}

const country = ['Belarus', 'Poland', 'Russia'];

interface UserData {
  emeil?: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
}

function createAddress(title: string, state: AccordionState, type: string): Accordion {
  const accordion = new Accordion(title, state,
    (new InputText(
      {
        name: 'Street',
        placeholder: Placehorders.STREET,
        minLength: 1,
        type: 'text',
      },
      'Street',
      () => ({
        status: false,
        errorText: 'Error',
      }),
    )),
    (new InputText(
      {
        name: 'City',
        placeholder: Placehorders.CITY,
        minLength: 1,
        type: 'text',
      },
      'City',
      () => ({
        status: false,
        errorText: 'Error',
      }),
    )),
    (new InputText(
      {
        name: 'Postal code',
        placeholder: Placehorders.POSTAL_CODE,
        minLength: 1,
        type: 'text',
      },
      'Postal code',
      () => ({
        status: false,
        errorText: 'Error',
      }),
    )),
    (new Select('Country', country,
      () => ({
        status: false,
        errorText: 'Error',
      }),)),
    (new CheckBox({ class: classes.checkbox }, `Use us default ${type} addres`, false)),
  );
  return accordion;
};



export default class SignupPage extends FormPage {
  form!: BaseForm;

  #formTitle!: BaseElement<HTMLElement>;

  #formUserDetails!: BaseForm;

  #formAddress!: BaseForm;

  #formPassword!: BaseForm;

  #email!: InputText;

  #password!: InputText;

  #firstName!: InputText;

  #lastName!: InputText;

  #dateOfBirth!: InputText;

  #deliveryAddress!: Accordion;

  #billingAddress!: Accordion;

  #isValidEmail!: boolean;

  #isValidPassword!: boolean;

  #nextButton!: Button;

  #singupButton!: Button;

  #userData: UserData;


  constructor() {
    super({ title: 'Registration page' });
    this.addForm(this.renderForm());
    this.addAdditionalLink("if you already have an account", 'login', 'Log in');
    this.#userData = {} as UserData;
  }

  renderForm(): BaseForm {
    this.form = this.#createFormUserDetails();
    return this.form;
  }

  #createFormUserDetails = (): BaseForm => {
    this.#formUserDetails = new BaseForm(
      { class: classes.form },
      (this.#formTitle = new BaseElement({ tag: 'div', class: classes.formTitle, text: FormTitle.USER })),
      (this.#email = new InputText(
        {
          name: 'email',
          placeholder: Placehorders.EMAIL,
          minLength: 2,
          type: 'email',
        },
        'E-mail',
        this.checkEmailValidation,
      )),
      (this.#firstName = new InputText(
        {
          name: 'firstName',
          placeholder: Placehorders.FIRST_NAME,
          maxLength: 20,
          minLength: 2,
        },
        'First Name',
        () => ({
          status: false,
          errorText: 'Error',
        }),
      )),
      (this.#lastName = new InputText(
        {
          name: 'lastName',
          placeholder: Placehorders.LAST_NAME,
          maxLength: 20,
          minLength: 2,
        },
        'Last Name',
        () => ({
          status: false,
          errorText: 'Error',
        }),
      )),
      (this.#dateOfBirth = new InputText(
        {
          name: 'date-of-birth',
          placeholder: Placehorders.DATE_OF_BIRTHDAY,
          type: 'date',
          min: '1900-01-01',
          max: '2020-01-01',
        },
        'Date of birth',
        () => ({
          status: false,
          errorText: 'Error',
        }),
      )),
      (this.#nextButton = new Button(
        { text: 'Next', class: classes.buttonNext },
        [ButtonClasses.BIG],
        () => {
          this.#changeForm(this.#createFormAddresses());
        }
      )),
    );
    return this.#formUserDetails;
  };

  #createFormAddresses = (): BaseForm => {
    this.#formAddress = new BaseForm(
      { class: classes.form },
      (this.#formTitle = new BaseElement({ tag: 'div', class: classes.formTitle, text: FormTitle.ADDRESS })),
      (this.#deliveryAddress = createAddress('1. Delivery address', AccordionState.OPEN, 'shipping')),
      (new CheckBox({ class: classes.checkbox }, `Use the shipping address for billing purposes`, false)),
      (this.#billingAddress = createAddress('2. Billing address', AccordionState.CLOSED, 'billing')),
      (this.#nextButton = new Button(
        { text: 'Next', class: classes.buttonNext },
        [ButtonClasses.BIG],
        this.#createPasswordForm,
      )),
    );

    return this.#formAddress;
  };

  #changeForm = (form: BaseForm) => {
    this.form.node.replaceWith(form.node);

    this.form = form;

  };

  #createPasswordForm = () => {
    this.#formPassword = new BaseForm(
      { class: classes.form },
      (this.#formTitle = new BaseElement({ tag: 'div', class: classes.formTitle, text: FormTitle.ADDRESS })),
    );
  };

  checkEmailValidation = (input: string): ValidationError => {
    this.#isValidEmail = validateEmail(input).status;
    return validateEmail(this.#email.value);
  };

  checkPasswordValidation = (input: string): ValidationError => {
    this.#isValidPassword = validatePassword(input).status;
    this.changeBtnState(this.#singupButton, this.#password);
    return validatePassword(this.#password.value);
  };

  changeBtnState = (button: Button, ...inputs: InputText[]): void => {
    const result = inputs.every((input) => input.isValid);
    if (result) {
      this.#singupButton.enable();
    } else {
      this.#singupButton.disable();
    }
  };

}
