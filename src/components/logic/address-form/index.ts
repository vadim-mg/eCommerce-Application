import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import {
  Address,
  MyCustomerAddAddressAction,
  MyCustomerChangeAddressAction,
} from '@commercetools/platform-sdk';
import InputText from '@Src/components/ui/input-text';
import CheckBox from '@Src/components/ui/checkbox';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import Select from '@Src/components/ui/select';
import { validateCity, validatePostalCode, validateStreet } from '@Src/utils/helpers';
import Customer from '@Src/controllers/customers';
import classes from './style.module.scss';

type FormProps = Omit<ElementProps<HTMLButtonElement>, 'tag'>;

const countriesList = ['Belarus', 'Poland', 'Russia'];
const COUNTRY_CODES = ['BE', 'PL', 'RU'];

export default class AddressForm extends BaseElement<HTMLFormElement> {
  #countryInput!: InputText;

  #countrySelect!: Select;

  #cityInput!: InputText;

  #postalCodeInput!: InputText;

  #streetInput!: InputText;

  #editDeleteBtnWrapper!: BaseElement<HTMLDivElement>;

  #cancelAddressButton!: Button;

  #editAddressButton!: Button;

  #saveAddressButton!: Button;

  #deleteAddressButton!: Button;

  #addressId: string | null;

  #addressType: string;

  #customer: Customer;

  constructor(
    props: FormProps,
    addressType: string,
    address: Address,
    isDefaultAddress: boolean,
    addressId: string | null,
  ) {
    super({ tag: 'form', ...props });
    this.node.classList.add(classes.baseForm);
    this.createAddressFormComponent(addressType, address, isDefaultAddress);
    this.#addressId = addressId;
    this.#addressType = addressType;
    this.#customer = new Customer();
  }

  createAddressFormComponent = (
    addressType: string,
    address: Address,
    isDefaultAddress: boolean,
  ) => {
    const addressComponent = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.addressWrapper },
      (this.#countrySelect = new Select('Country', countriesList, () => console.log('country'))),
      (this.#countryInput = new InputText({ name: 'country' }, 'Country')),
      (this.#cityInput = new InputText({ name: 'city' }, 'City', () =>
        validateCity(this.#cityInput.value),
      )),
      (this.#postalCodeInput = new InputText({ name: 'postal code' }, 'Postal code', () =>
        validatePostalCode(this.#postalCodeInput.value, this.#countrySelect.selectedValue),
      )),
      (this.#streetInput = new InputText({ name: 'street' }, 'Street', () =>
        validateStreet(this.#streetInput.value),
      )),
      new CheckBox(
        { class: classes.checkbox },
        `Use us default ${addressType} address`,
        isDefaultAddress,
      ),
      this.#createEditDeleteBtnComponent(),
    );
    this.#countrySelect.node.classList.add(classes.selectCountry);
    this.#countrySelect.node.classList.add(classes.hidden);

    const country = countriesList[COUNTRY_CODES.indexOf(address.country)];
    this.#countrySelect.selectedValue = country;
    this.#countryInput.value = country;
    this.#cityInput.value = address.city ?? '';
    this.#postalCodeInput.value = address.postalCode ?? '';
    this.#streetInput.value = address.streetName ?? '';

    this.setUserAddressInputsState(true);

    this.node.append(addressComponent.node);
    return addressComponent;
  };

  #createEditDeleteBtnComponent = () => {
    this.#editDeleteBtnWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.editDeleteBtnWrapper },
      (this.#editAddressButton = new Button(
        { text: 'Edit', class: classes.button },
        ButtonClasses.NORMAL,
        this.setEditMode,
      )),
      (this.#saveAddressButton = new Button(
        { text: 'Save', class: classes.button },
        ButtonClasses.NORMAL,
        this.checkAndSendAddressData,
      )),
      (this.#cancelAddressButton = new Button(
        { text: 'Cancel', class: classes.button },
        ButtonClasses.NORMAL,
        this.setCanceledMode,
      )),
      (this.#deleteAddressButton = new Button(
        { text: 'Delete', class: classes.button },
        ButtonClasses.NORMAL,
        () => console.log('delete'),
      )),
    );
    this.#saveAddressButton.node.classList.add(classes.hidden);
    this.#cancelAddressButton.node.classList.add(classes.hidden);

    this.#editAddressButton.node.classList.add(classes.btnLineHeight);
    this.#saveAddressButton.node.classList.add(classes.btnLineHeight);
    this.#cancelAddressButton.node.classList.add(classes.btnLineHeight);
    return this.#editDeleteBtnWrapper;
  };

  setUserAddressInputsState = (state: boolean) => {
    this.#countryInput.setDisabled(state);
    this.#cityInput.setDisabled(state);
    this.#postalCodeInput.setDisabled(state);
    this.#streetInput.setDisabled(state);
  };

  setEditMode = () => {
    this.setUserAddressInputsState(false);
    this.#countrySelect.node.classList.remove(classes.hidden);
    this.#countryInput.node.classList.add(classes.hidden);

    this.#saveAddressButton.node.classList.remove(classes.hidden);
    this.#editAddressButton.node.classList.add(classes.hidden);
  };

  checkAndSendAddressData = async () => {
    this.#cityInput.validate();
    this.#streetInput.validate();
    this.#postalCodeInput.validate();

    if (!this.#cityInput.isValid && !this.#streetInput.isValid && !this.#postalCodeInput.isValid) {
      return;
    }
    const countryValue = COUNTRY_CODES[countriesList.indexOf(this.#countrySelect.selectedValue)];

    if (this.#addressId === null) {
      const customerData: MyCustomerAddAddressAction = {
        action: 'addAddress',
        address: {
          city: this.#cityInput.value,
          country: countryValue,
          postalCode: this.#postalCodeInput.value,
          streetName: this.#streetInput.value,
        },
      };
      const result = await this.#customer.updateSingleCustomerData(customerData);
      const match = result.addresses.find(
        (address) =>
          address.city === this.#cityInput.value &&
          address.postalCode === this.#postalCodeInput.value &&
          address.streetName === this.#streetInput.value,
      );

      if (this.#addressType === 'billing') {
        await this.#customer.updateSingleCustomerData({
          action: 'addBillingAddressId',
          addressId: match?.id,
        });
      } else {
        await this.#customer.updateSingleCustomerData({
          action: 'addShippingAddressId',
          addressId: match?.id,
        });
      }
      this.#countryInput.value = countriesList[COUNTRY_CODES.indexOf(countryValue)];
      this.setSavedMode();
    } else {
      const customerData: MyCustomerChangeAddressAction = {
        action: 'changeAddress',
        addressId: this.#addressId,
        address: {
          city: this.#cityInput.value,
          country: countryValue,
          postalCode: this.#postalCodeInput.value,
          streetName: this.#streetInput.value,
        },
      };
      await this.#customer.updateSingleCustomerData(customerData);
      this.#countryInput.value = countriesList[COUNTRY_CODES.indexOf(countryValue)];
      this.setSavedMode();
    }
  };

  setSavedMode = () => {
    this.setUserAddressInputsState(true);

    this.#countrySelect.node.classList.add(classes.hidden);
    this.#countryInput.node.classList.remove(classes.hidden);

    this.#saveAddressButton.node.classList.add(classes.hidden);
    this.#editAddressButton.node.classList.remove(classes.hidden);
    this.#deleteAddressButton.node.classList.remove(classes.hidden);
    this.#cancelAddressButton.node.classList.add(classes.hidden);
  };

  setCanceledMode = () => {
    this.node.remove();
    this.setUserAddressInputsState(true);

    this.#saveAddressButton.node.classList.add(classes.hidden);
    this.#cancelAddressButton.node.classList.add(classes.hidden);
    this.#editAddressButton.node.classList.remove(classes.hidden);
    this.#deleteAddressButton.node.classList.remove(classes.hidden);
  };

  setAddedNewAddressMode = () => {
    this.setUserAddressInputsState(false);
    this.#countrySelect.node.classList.remove(classes.hidden);
    this.#countryInput.node.classList.add(classes.hidden);

    this.#saveAddressButton.node.classList.remove(classes.hidden);
    this.#cancelAddressButton.node.classList.remove(classes.hidden);
    this.#editAddressButton.node.classList.add(classes.hidden);
    this.#deleteAddressButton.node.classList.add(classes.hidden);
  };
}
