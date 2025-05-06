export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	page: {
		wrapper: 'page__wrapper',
		locked: 'page__wrapper_locked',
	},
	gallery: 'gallery',
	header: {
		container: 'header__container',
		logo: {
			class: 'header__logo',
			imageClass: 'header__logo-image',
		},
		basket: {
			class: 'header__basket',
			counterClass: 'header__basket-counter',
		},
	},
	modal: {
		container: 'modal__container',
		closeButton: 'modal__close',
		content: 'modal__content',
		active: 'modal_active',
	},
	card: {
		base: 'card',
		full: 'card_full',
		compact: 'card_compact',
		image: 'card__image',
		title: 'card__title',
		category: 'card__category',
		text: 'card__text',
		price: 'card__price',
		button: 'card__button',
	},
	basket: {
		container: 'basket',
		title: 'modal__title',
		list: 'basket__list',
		item: 'basket__item',
		itemIndex: 'basket__item-index',
		deleteButton: 'basket__item-delete',
		totalPrice: 'basket__price',
		actionButton: 'button',
	},
	form: {
		base: 'form',
		input: 'form__input',
		label: 'form__label',
		actions: 'modal__actions',
		submitButton: 'button order__button',
		errors: 'form__errors',
	},
	templates: {
		success: '#success',
		cardCatalog: '#card-catalog',
		cardPreview: '#card-preview',
		cardBasket: '#card-basket',
		basket: '#basket',
		order: '#order',
		contacts: '#contacts',
	},
};
