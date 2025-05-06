import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

class Page extends Component<IPage> {
	protected counter: HTMLElement;
	protected catalog: HTMLElement;
	protected wrapper: HTMLElement;
	protected basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.counter = ensureElement<HTMLElement>(
			`.${settings.header.basket.counterClass}`
		);
		this.catalog = ensureElement<HTMLElement>(`.${settings.gallery}`);
		this.wrapper = ensureElement<HTMLElement>(`.${settings.page.wrapper}`);
		this.basket = ensureElement<HTMLElement>(
			`.${settings.header.basket.class}`
		);

		this.basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set setPageCounter(value: number) {
		this.setText(this.counter, String(value));
	}

	set setPageCatalog(items: HTMLElement[]) {
		this.catalog.replaceChildren(...items);
	}

	set setPageLocked(value: boolean) {
		if (value) {
			this.wrapper.classList.add(`${settings.page.locked}`);
		} else {
			this.wrapper.classList.remove(`${settings.page.locked}`);
		}
	}
}

export { IPage, Page }