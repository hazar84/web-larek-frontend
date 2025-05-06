import { Form } from './form';
import { OrderForm, PaymentMethod } from '../types';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<OrderForm> {
	protected paymentButtons: Record<PaymentMethod, HTMLButtonElement>;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);
		this.paymentButtons = {
			card: ensureElement<HTMLButtonElement>(
				'.button_alt[name=card]',
				this.container
			),
			cash: ensureElement<HTMLButtonElement>(
				'.button_alt[name=cash]',
				this.container
			),
		};
		this.setupPaymentButtons();
	}

	private setupPaymentButtons(): void {
		Object.entries(this.paymentButtons).forEach(([method, button]) => {
			button.addEventListener('click', () => {
				this.payment = method as PaymentMethod;
				this.onInputChange('payment', method as PaymentMethod);
			});
		});
	}

	set address(value: string) {
		(
			this.container.querySelector('input[name=address]') as HTMLInputElement
		).value = value;
	}

	set payment(value: PaymentMethod) {
		Object.entries(this.paymentButtons).forEach(([method, button]) => {
			button.classList.toggle('button_alt-active', value === method);
		});
	}
}