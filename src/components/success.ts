import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IOrderResult } from '../types';

interface ISuccessActions {
	onClick: () => void;
}

class Success extends Component<IOrderResult> {
	protected successClose: HTMLElement;
	protected successTotal: HTMLElement;

	constructor(container: HTMLElement, actions?: ISuccessActions) {
		super(container);

		this.successTotal = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this.successClose = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this.successClose.addEventListener('click', actions.onClick);
		}
	}
	set total(value: number) {
		this.setText(this.successTotal, `Списано ${value} синапсов`);
	}
}

export { ISuccessActions, Success }