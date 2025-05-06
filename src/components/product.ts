import { IProduct } from '../types';
import { Component } from './base/component';
import { settings } from '../utils/constants';
import { ensureElement } from '../utils/utils';

interface IProductActions {
	onClick: (e: MouseEvent) => void;
}

class Product extends Component<IProduct> {
	protected productDescription?: HTMLParagraphElement;
	protected productPrice: HTMLSpanElement;
	protected productTitle: HTMLElement;
	protected productImage?: HTMLImageElement;
	protected productCategory?: HTMLSpanElement;
	protected productButton?: HTMLButtonElement;
	protected productIndex?: HTMLSpanElement;

	protected productCategoryColor: { [key: string]: string } = {
		'софт-скил': '_soft',
		'хард-скил': '_hard',
		другое: '_other',
		дополнительное: '_additional',
		кнопка: '_button',
	};

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container);
		this.productTitle = ensureElement<HTMLElement>(
			`.${settings.card.title}`,
			container
		);
		this.productPrice = ensureElement<HTMLSpanElement>(
			`.${settings.card.price}`,
			container
		);

		this.productDescription = container.querySelector(
			`.${settings.card.text}`
		) as HTMLParagraphElement;
		this.productCategory = container.querySelector(
			`.${settings.card.category}`
		) as HTMLSpanElement;
		this.productButton = container.querySelector(
			`.${settings.card.button}`
		) as HTMLButtonElement;
		this.productImage = container.querySelector(
			`.${settings.card.image}`
		) as HTMLImageElement;

		this.productIndex = container.querySelector(
			`.${settings.basket.itemIndex}`
		) as HTMLSpanElement;

		if (typeof actions?.onClick === 'function') {
			const target = this.productButton || container;

			target.addEventListener('click', actions.onClick);
		}
	}
	get id(): string {
		return this.container.dataset.id || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get title() {
		return this.productTitle.textContent || '';
	}

	set title(value: string) {
		this.setText(this.productTitle, value);
	}

	get description() {
		return this.container.textContent || '';
	}

	set description(value: string) {
		this.setText(this.productDescription, value);
	}

	set category(value: string) {
		this.setText(this.productCategory, value);

		this.productCategory?.classList?.forEach((className) => {
			if (className.startsWith('card__category_')) {
				this.productCategory?.classList?.remove(className);
			}
		});

		const categoryClass = this.productCategoryColor[value].toLowerCase();
		if (categoryClass) {
			this.productCategory?.classList?.add(`card__category${categoryClass}`);
		}
	}
	set image(value: string) {
		this.setImage(this.productImage, value, this.title);
	}

	set index(value: string) {
		this.setText(this.productIndex, value);
	}

	get price() {
		return this.productPrice.textContent || '';
	}

	set price(value: string) {
		this.setText(this.productPrice, value ? `${value} синапсов` : 'Бесценно');

		if (this.productButton) {
			this.productButton.disabled = !value;
		}
	}

	updateButtonText(isProductInBasket: boolean): void {
		this.productButton.textContent = isProductInBasket
			? 'Удалить из корзины'
			: 'Добавить в корзину';
	}
}

export { IProductActions, Product }