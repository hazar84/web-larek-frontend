import './scss/styles.scss';
import { AppData, CatalogChangeEvent } from './components/appData';

import { EventEmitter } from './components/base/events';
import { Product } from './components/product';
import { LarekApi } from './components/larekApi';

import { ContactForm, IProduct, OrderForm } from './types';
import { API_URL, CDN_URL, } from './utils/constants';
import { Page } from './components/page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/modal';
import { Basket } from './components/basket';
import { Order } from './components/order';
import { IFormState } from './components/form';
import { Contacts } from './components/contacts';
import { Success } from './components/success';

const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppData(events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const templates = document.querySelectorAll('template');

interface ITemplates {
    [key: string]: HTMLTemplateElement;
}

const TEMPLATES: ITemplates = {};

templates.forEach((template: HTMLTemplateElement) => {
    const templateId = template.id;
    if (templateId) {
        TEMPLATES[templateId] = template;
    }
});

const basket = new Basket(cloneTemplate(TEMPLATES['basket']), events);
const order = new Order(cloneTemplate(TEMPLATES['order']), events);
const contact = new Contacts(cloneTemplate(TEMPLATES['contacts']), events);
const success = new Success(cloneTemplate(TEMPLATES['success']), {onClick() {
    modal.close();
},})

events.on<CatalogChangeEvent>('items:changed', () => {
    page.setPageCatalog = appData.productList.map((item: IProduct) => {
        const card = new Product(cloneTemplate(TEMPLATES['card-catalog']), {
            onClick: () => events.emit('product:selected', item),
        });
        return card.render(item);
    });
});

events.on('product:selected', (item: IProduct) => {
    appData.previewProduct(item);
});

events.on('preview:changed', (item: IProduct) => {
    const modalCardContent = new Product(
        cloneTemplate(TEMPLATES['card-preview']),
        {
            onClick: () => {
                if (!appData.isProductInBasket(item)) {
                    appData.addToBasket(item);
                } else {
                    appData.removeFromBasket(item);
                }
                modal.close();
            },
        }
    ).render(item);
    const productInstance = new Product(modalCardContent);
    productInstance.updateButtonText(appData.isProductInBasket(item));
    modal.setModalContent = modalCardContent;
    modal.open();
});

events.on('basket:updated', () => {
    page.setPageCounter = appData.basket.items.length;

    basket.items = appData.basket.items.map((id, index) => {
        const item = appData.productList.find((item) => item.id === id);
        const card = new Product(cloneTemplate(TEMPLATES['card-basket']), {
            onClick: () => appData.removeFromBasket(item),
        });
        card.index = (index + 1).toString();
        return card.render(item);
    });

    basket.total = appData.basket.total;
});

events.on('basket:open', () => {
    const basketContent = basket.render();
    modal.setModalContent = basketContent;
    modal.open();
});

events.on('order:open', () => {
    const initialState: Partial<OrderForm> & IFormState = {
        valid: false,
        errors: [],
        address: '',
        payment: 'card',
    };
    const orderContent = order.render(initialState);
    modal.setModalContent = orderContent;
});

events.on('order:submit', () => {
    const initialState: Partial<ContactForm> & IFormState = {
        phone: '',
        email: '',
        valid: false,
        errors: [],
    };
    const contactsContent = contact.render(initialState);
    modal.setModalContent = contactsContent;
});

events.on('contacts:submit', () => {
    const order = {
        ...appData.currentOrder,
        ...appData.basket
    }
    api
        .orderItems(order)
        .then((data) => {
            const successContent = success.render({ total: data.total });
            modal.setModalContent = successContent;
            appData.clearBasket();
        })
        .catch((error) => {
            console.error(`Не удалось обработать заказ: ${error.message}`);
        });
});

events.on('formErrors:change', (error: Partial<OrderForm>) => {
    const { payment, address, email, phone } = error;

    order.valid = !payment && !address;
    order.setError = Object.values({ payment, address })
        .filter((i) => !!i)
        .join('; ');

    contact.valid = !email && !phone;
    contact.setError = Object.values({ phone, email })
        .filter((i) => !!i)
        .join('; ');
});

events.on(
    /^order\..*:change/,
    (data: { field: keyof OrderForm; value: string }) => {
        appData.updateOrderField(data.field, data.value);
    }
);

events.on(
    /^contacts\..*:change/,
    (data: { field: keyof OrderForm; value: string }) => {
        appData.updateOrderField(data.field, data.value);
    }
);

events.on('modal:open', () => {
    page.setPageLocked = true;
});

events.on('modal:close', () => {
    page.setPageLocked = false;
});

api
    .getList()
    .then(appData.updateProductList.bind(appData))
    .catch((err) => {
        console.error(err);
    });