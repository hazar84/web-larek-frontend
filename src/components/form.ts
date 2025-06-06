import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IFormState {
	valid: boolean;
	errors: string[];
}

class Form<T> extends Component<IFormState> {
	protected submit: HTMLButtonElement;
	protected error: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this.error = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this.submit, !value);
	}

	set setError(value: string) {
		this.setText(this.error, value);
	}
}

export { IFormState, Form }