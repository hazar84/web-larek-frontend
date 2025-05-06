import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { settings } from '../utils/constants';

interface IModalData {
	content: HTMLElement;
}

class Modal extends Component<IModalData> {
	protected closeButton: HTMLButtonElement;
	protected content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>(
			`.${settings.modal.closeButton}`,
			container
		);
		this.content = ensureElement<HTMLElement>(
			`.${settings.modal.content}`,
			container
		);

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this.content.addEventListener('click', (event) => event.stopPropagation());
	}

	set setModalContent(value: HTMLElement) {
		this.content.replaceChildren(value);
	}

	open() {
		this.container.classList.add(`${settings.modal.active}`);
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove(`${settings.modal.active}`);
		this.setModalContent = null;
		this.events.emit('modal:close');
	}
}

export { IModalData, Modal }