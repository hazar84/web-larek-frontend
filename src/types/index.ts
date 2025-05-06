interface IProduct {
	id: string;
	description: string;
	price: number | undefined;
	title: string;
	image: string;
	category: string;
}

type PaymentMethod = 'cash' | 'card';

interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number | undefined;
	items: string[];
}

interface IOrderResult {
	id: string;
	total: number;
}

interface IBasket {
	items: string[];
	total: number;
}

type OrderForm = Omit<IOrder, 'total' | 'items'>;

type ContactForm = Omit<IOrder, 'total' | 'items' | 'payment' | 'address'>;

export { IProduct, PaymentMethod, IOrder, IOrderResult, IBasket, OrderForm, ContactForm }