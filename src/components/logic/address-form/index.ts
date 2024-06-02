import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import CheckBox from '@Src/components/ui/checkbox';
import InputText from '@Src/components/ui/input-text';
import ModalWindow from '@Src/components/ui/modal';
import Select from '@Src/components/ui/select';
import CustomerController from '@Src/controllers/customers';
import { validateCity, validatePostalCode, validateStreet } from '@Src/utils/helpers';
import {
  Address,
  Customer,
  MyCustomerAddAddressAction,
  MyCustomerChangeAddressAction,
  MyCustomerRemoveAddressAction,
} from '@commercetools/platform-sdk';
import classes from './style.module.scss';

type FormProps = Omit<ElementProps<HTMLButtonElement>, 'tag'>;

const countriesList = ['Belarus', 'Poland', 'Russia'];
const COUNTRY_CODES = ['BE', 'PL', 'RU'];

export default class AddressForm extends BaseElement<HTMLFormElement> {
  #addressComponent!: BaseElement<HTMLDivElement>;

  #formModal!: ModalWindow;

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

  #checkBox!: CheckBox;

  #addressId: string | null;

  #addressType: string;

  #address: Address;

  #customerController: CustomerController;

  #isDefaultAddress: boolean;

  #initializeAddresses: (customer: Customer) => void;

  constructor(
    props: FormProps,
    addressType: string,
    address: Address,
    isDefaultAddress: boolean,
    addressId: string | null,
    initializeAddresses: (customer: Customer) => void,
    openInEditMode: boolean = false,
  ) {
    super({ tag: 'form', ...props });
    this.node.classList.add(classes.baseForm);
    this.createAddressFormComponent(addressType, address, isDefaultAddress);
    this.#addressId = addressId;
    this.#addressType = addressType;
    this.#address = address;
    this.#isDefaultAddress = isDefaultAddress;

    this.#customerController = new CustomerController();
    this.#initializeAddresses = initializeAddresses;

    if (openInEditMode) {
      this.setEditMode();
      this.#deleteAddressButton.node.classList.add(classes.hidden);
    } else {
      this.#deleteAddressButton.node.classList.remove(classes.hidden);
    }
  }

  createAddressFormComponent = (
    addressType: string,
    address: Address,
    isDefaultAddress: boolean,
  ) => {
    this.#addressComponent = new BaseElement<HTMLDivElement>(
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
      (this.#checkBox = new CheckBox(
        { class: classes.checkbox },
        `Use us default ${addressType} address`,
        isDefaultAddress,
      )),
      this.#createEditDeleteBtnComponent(),
    );
    this.#checkBox.inputElement.node.addEventListener('change', this.setDefaultAddress);

    this.#countrySelect.node.classList.add(classes.selectCountry);
    this.#countrySelect.node.classList.add(classes.hidden);

    const country = countriesList[COUNTRY_CODES.indexOf(address.country)];
    this.#countrySelect.selectedValue = country;
    this.#countryInput.value = country;
    this.#cityInput.value = address.city ?? '';
    this.#postalCodeInput.value = address.postalCode ?? '';
    this.#streetInput.value = address.streetName ?? '';

    this.setUserAddressInputsState(true);

    this.node.append(this.#addressComponent.node);
    return this.#addressComponent;
  };

  methodForEditBtn = () => {
    const newAddress = new AddressForm(
      {},
      this.#addressType,
      this.#address,
      this.#isDefaultAddress,
      this.#addressId,
      this.#initializeAddresses,
      true,
    );
    console.log(newAddress);
  };

  #createEditDeleteBtnComponent = () => {
    this.#editDeleteBtnWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.editDeleteBtnWrapper },
      (this.#editAddressButton = new Button(
        { text: 'Edit', class: classes.button },
        ButtonClasses.NORMAL,
        this.methodForEditBtn,
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
        this.setDeletedMode,
      )),
    );
    this.#saveAddressButton.node.classList.add(classes.hidden);
    this.#cancelAddressButton.node.classList.add(classes.hidden);

    this.#editAddressButton.node.classList.add(classes.btnLineHeight);
    this.#saveAddressButton.node.classList.add(classes.btnLineHeight);
    this.#cancelAddressButton.node.classList.add(classes.btnLineHeight);
    return this.#editDeleteBtnWrapper;
  };

  setDefaultAddress = async () => {
    const action =
      this.#addressType === 'billing' ? 'setDefaultBillingAddress' : 'setDefaultShippingAddress';
    await this.#customerController.updateSingleCustomerData({
      action,
      addressId: this.#addressId ?? '',
    });
  };

  setDeletedMode = async () => {
    const customerData: MyCustomerRemoveAddressAction = {
      action: 'removeAddress',
      addressId: this.#addressId ?? '',
    };
    const customer = await this.#customerController.updateSingleCustomerData(customerData);
    this.#initializeAddresses(customer);
  };

  setUserAddressInputsState = (state: boolean) => {
    this.#countryInput.setDisabled(state);
    this.#cityInput.setDisabled(state);
    this.#postalCodeInput.setDisabled(state);
    this.#streetInput.setDisabled(state);
  };

  setEditMode = () => {
    // create modal window
    this.#formModal = new ModalWindow([classes.modal], this.#addressComponent);
    this.#formModal.show();

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
      const result = await this.#customerController.updateSingleCustomerData(customerData);
      const match = result.addresses.find(
        (address) =>
          address.city === this.#cityInput.value &&
          address.postalCode === this.#postalCodeInput.value &&
          address.streetName === this.#streetInput.value,
      );
      const action =
        this.#addressType === 'billing' ? 'addBillingAddressId' : 'addShippingAddressId';
      const customer = await this.#customerController.updateSingleCustomerData({
        action,
        addressId: match?.id,
      });
      this.closeModal(customer);
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
      const customer = await this.#customerController.updateSingleCustomerData(customerData);
      this.closeModal(customer);
    }
    this.#countryInput.value = countriesList[COUNTRY_CODES.indexOf(countryValue)];
    this.setSavedMode();
  };

  closeModal = (customer: Customer) => {
    this.#formModal.node.remove();
    this.#initializeAddresses(customer);
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
