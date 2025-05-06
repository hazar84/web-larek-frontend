import { IBasket, IOrder, IProduct, OrderForm, PaymentMethod } from '../types';
import { IEvents } from './base/events';

type CatalogChangeEvent = {
    catalog: IProduct[];
};

interface IAppState {
    selectedProduct: IProduct;
    basket: IBasket;
    productList: IProduct[];
    currentOrder: IOrder;
}

class AppData implements IAppState {
    productList: IProduct[] = []; 
    basket: IBasket = { items: [], total: 0 };
    selectedProduct: IProduct; 
    currentOrder: IOrder = this.createEmptyOrder(); 
    private validationErrors: Partial<Record<keyof OrderForm, string>> = {};

    constructor(private eventManager: IEvents) {}

    // методы работы с каталогом товаров
    previewProduct(item: IProduct): void {
        this.selectedProduct = item;
        this.eventManager.emit('preview:changed', item);
    }

    updateProductList(products: IProduct[]): void {
        this.productList = products;
        this.eventManager.emit('items:changed', { catalog: products });
    }

    // методы работы с корзиной товаров
    isProductInBasket(product: IProduct): boolean {
        return this.basket.items.includes(product.id);
    }

    addToBasket(product: IProduct): void {
        this.basket.items.push(product.id);
        this.basket.total += product.price;
        this.notifyBasketUpdated();
    }

    removeFromBasket(product: IProduct): void {
        this.basket.items = this.basket.items.filter((id) => id !== product.id);
        this.basket.total = Math.max(0, this.basket.total - product.price);
        this.notifyBasketUpdated();
    }

    clearBasket(): void {
        this.basket = { items: [], total: 0 };
        this.notifyBasketUpdated();
    }

    // остальные методы
    setPaymentType(paymentType: PaymentMethod): void {
        this.currentOrder.payment = paymentType;
        this.validateOrder();
    }

    updateOrderField(field: keyof OrderForm, value: string): void {
        if (field === 'payment') {
            this.setPaymentType(value as PaymentMethod);
        } else {
            this.currentOrder[field] = value;
            this.validateOrder();
        }
    }

    // методы для валидации
    validate(): boolean {
        this.validateOrder();
        const isValid = this.isOrderValid();

        if (isValid) {
            this.currentOrder.total = this.basket.total;
            this.currentOrder.items = this.basket.items;
        }

        return isValid;
    }

    private isOrderValid(): boolean {
        return Object.keys(this.validationErrors).length === 0;
    }

    private validateOrder(): void {
        this.validationErrors = {
            ...this.validationErrors,
            email: '',
            phone: '',
            address: ''
        };

        if (!this.isValidEmail(this.currentOrder.email)) {
            this.validationErrors.email = 'Укажите корректный email';
        }

        if (!this.isValidPhone(this.currentOrder.phone)) {
            this.validationErrors.phone = 'Укажите номер телефона';
        }

        if (!this.currentOrder.address || this.currentOrder.address.trim().length < 5) {
            this.validationErrors.address = 'Укажите адрес доставки минимум 5 символов';
        }

        this.eventManager.emit('formErrors:change', this.validationErrors);
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const sanitizedPhone = phone.replace(/[\s\(\)-]+/g, '');
        const phoneRegex = /^(?:\+7|8)\d{10}$/;
        return phoneRegex.test(sanitizedPhone);
    }

    // утилиты
    private createEmptyOrder(): IOrder {
        return {
            email: '',
            phone: '',
            address: '',
            payment: 'card',
            total: 0,
            items: [],
        };
    }

    private notifyBasketUpdated(): void {
        this.eventManager.emit('basket:updated', this.basket);
    }
}

export { CatalogChangeEvent, AppData }