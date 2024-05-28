import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import { Address } from '@commercetools/platform-sdk';
import InputText from '@Src/components/ui/input-text';
import CheckBox from '@Src/components/ui/checkbox';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import classes from './style.module.scss';

type FormProps = Omit<ElementProps<HTMLButtonElement>, 'tag'>;

export default class AddressForm extends BaseElement<HTMLFormElement> {
  #countryInput!: InputText;

  #cityInput!: InputText;

  #postalCodeInput!: InputText;

  #streetInput!: InputText;

  #editDeleteBtnWrapper!: BaseElement<HTMLDivElement>;

  #deleteAddressButton!: Button;

  #editAddressButton!: Button;

  constructor(props: FormProps, addressType: string, address: Address, isDefaultAddress: boolean) {
    super({ tag: 'form', ...props });
    this.node.classList.add(classes.baseForm);
    this.createAddressFormComponent(addressType, address, isDefaultAddress);
  }

  createAddressFormComponent = (
    addressType: string,
    address: Address,
    isDefaultAddress: boolean,
  ) => {
    const addressComponent = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.addressWrapper },
      (this.#countryInput = new InputText({ name: 'country' }, 'Country')),
      (this.#cityInput = new InputText({ name: 'city' }, 'City')),
      (this.#postalCodeInput = new InputText({ name: 'postal code' }, 'Postal code')),
      (this.#streetInput = new InputText({ name: 'street' }, 'Street')),
      new CheckBox(
        { class: classes.checkbox },
        `Use us default ${addressType} address`,
        isDefaultAddress,
      ),
      this.createEditDeleteBtnComponent(),
    );

    this.#countryInput.value = address.country;
    this.#cityInput.value = address.city ?? '';
    this.#postalCodeInput.value = address.postalCode ?? '';
    this.#streetInput.value = address.streetName ?? '';

    this.toggleUserAddressInputsState(true);

    this.node.append(addressComponent.node);
    return addressComponent;
  };

  createEditDeleteBtnComponent = () => {
    this.#editDeleteBtnWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.editDeleteBtnWrapper },
      (this.#editAddressButton = new Button(
        { text: 'Edit', class: classes.button },
        ButtonClasses.NORMAL,
        () => console.log('Edit'),
      )),
      (this.#deleteAddressButton = new Button(
        { text: 'Delete', class: classes.button },
        ButtonClasses.NORMAL,
        () => console.log('Delete'),
      )),
    );
    this.#editAddressButton.node.classList.add(classes.btnLineHeight);
    this.#deleteAddressButton.node.classList.add(classes.btnLineHeight);
    return this.#editDeleteBtnWrapper;
  };

  toggleUserAddressInputsState = (state: boolean) => {
    this.#countryInput.setDisabled(state);
    this.#cityInput.setDisabled(state);
    this.#postalCodeInput.setDisabled(state);
    this.#streetInput.setDisabled(state);
  };
}
