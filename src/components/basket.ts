import { Component } from './base/component';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';
import { settings } from '../utils/constants';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

class Basket extends Component<IBasketView> {
	protected basketList: HTMLElement;
	protected basketTotal: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this.basketList = ensureElement<HTMLElement>(
			`.${settings.basket.list}`,
			this.container
		);
		this.basketTotal = this.container.querySelector(
			`.${settings.basket.totalPrice}`
		);
		this.basketButton = this.container.querySelector(
			`${settings.basket.actionButton}`
		) as HTMLButtonElement;

		if (this.basketButton) {
			this.basketButton.addEventListener('click', () => {
				this.events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length > 0) {
			this.renderItems(items);
			this.setDisabled(this.basketButton, false);
		} else {
			this.renderEmptyState();
			this.setDisabled(this.basketButton, true);
		}
	}

	private renderItems(items: HTMLElement[]) {
		this.basketList.replaceChildren(...items);
	}

	private renderEmptyState() {
		const emptyMessage = createElement<HTMLParagraphElement>('p', {
			textContent: 'Пока здесь ничего нет...',
		});
		this.basketList.replaceChildren(emptyMessage);
	}

	set total(total: number) {
		this.setText(this.basketTotal, total + ' синапсов');
	}
}

export { IBasketView, Basket }
