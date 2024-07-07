import React from 'react';
import { addToCart, initStore } from '../../src/client/store';
import { Application } from '../../src/client/Application';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ExampleApi, CartApi } from '../../src/client/api';
import { act, render,screen } from '@testing-library/react';
import events  from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Cart } from '../../src/client/pages/Cart';
import { checkoutComplete }  from '../../src/client/store';
import { mock_cart, mock_first_product, mock_second_product } from './mock';

describe('Cart', () => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    jest.mock('axios');

    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async() =>{
        cart.setState(mock_cart);
        const store = initStore(api, cart);
        const {container } = render(  
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </MemoryRouter>
        );
        let clear_button = container.getElementsByClassName('Cart-Clear')[0];
        await events.click(clear_button);
        let new_text = container.outerHTML;
        expect(new_text.includes('Cart is empty.')).toBe(true);
    });

    it('если корзина пустая, должна отображаться ссылка на каталог товаров', () =>{
        cart.setState([]);
        const store = initStore(api, cart);
        const {container } = render(  
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </MemoryRouter>
        );
        let new_text = container.outerHTML;
        expect(new_text.includes('Cart is empty.')).toBe(true);
        expect(screen.getByRole('link', { name: /catalog/i }).getAttribute("href")).toBe('/catalog');
        expect(screen.getByRole('link',{ name: /catalog/i })).toBeVisible();
    });

    it('в корзине должна отображаться таблица с добавленными в нее товарами', () => {

        cart.setState(mock_cart);
        const store = initStore(api, cart);
        const {container } = render(  
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </MemoryRouter>
        );
        expect(container.getElementsByClassName('Cart-Table')[0]).not.toBeUndefined;
        expect(screen.getByTestId('0').getElementsByClassName('Cart-Name')[0].innerHTML).toBe(mock_cart[0].name);
        expect(screen.getByTestId('1').getElementsByClassName('Cart-Name')[0].innerHTML).toBe(mock_cart[1].name);
    });

    it('для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', () => {
        const total_1 = mock_cart[0].price * mock_cart[0].count; 
        const total_2 = mock_cart[1].price * mock_cart[1].count;
        const total = total_1 + total_2;
        cart.setState(mock_cart);
        const store = initStore(api, cart);
        const {container } = render(  
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </MemoryRouter>
        );
        expect(container.getElementsByClassName('Cart-Table')[0]).not.toBeUndefined;
        expect(screen.getByTestId('0').getElementsByClassName('Cart-Price')[0].innerHTML).toBe('$' + mock_cart[0].price);
        expect(screen.getByTestId('0').getElementsByClassName('Cart-Count')[0].innerHTML).toBe(mock_cart[0].count.toString());
        expect(screen.getByTestId('0').getElementsByClassName('Cart-Total')[0].innerHTML).toBe('$' + total_1);
        expect(screen.getByTestId('1').getElementsByClassName('Cart-Price')[0].innerHTML).toBe('$' + mock_cart[1].price);
        expect(screen.getByTestId('1').getElementsByClassName('Cart-Count')[0].innerHTML).toBe(mock_cart[1].count.toString());
        expect(screen.getByTestId('1').getElementsByClassName('Cart-Total')[0].innerHTML).toBe('$' + total_2);
        expect(container.getElementsByClassName('Cart-OrderPrice')[0].innerHTML).toBe('$' + total);
    });

    it('форма заказа принимает значения, если они заданы в нужных форматах', async() => {
        cart.setState(mock_cart);
        const store = initStore(api, cart);
        const {container } = render(  
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </MemoryRouter>
        );
        let name = container.getElementsByClassName('Form-Field_type_name')[0];
        let phone = container.getElementsByClassName('Form-Field_type_phone')[0];
        let address = container.getElementsByClassName('Form-Field_type_address')[0];
        let checkout_submit = container.getElementsByClassName('Form-Submit')[0];
        await events.type(name, 'my name');
        await events.type(phone, '9099999999');
        await events.type(address, 'address');
        events.click(checkout_submit);
        expect(container.getElementsByClassName('is-invalid').length).toBe(0);
    });

    it('форма заказа не принимает значения, если они заданы в неверных форматах', async() => {
        cart.setState(mock_cart);
        const store = initStore(api, cart);
        const {container } = render(  
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        );
        let name = container.getElementsByClassName('Form-Field_type_name')[0];
        let phone = container.getElementsByClassName('Form-Field_type_phone')[0];
        let address = container.getElementsByClassName('Form-Field_type_address')[0];
        let checkout_submit = container.getElementsByClassName('Form-Submit')[0];
        await events.type(name, ' ');
        await events.type(phone, '90999');
        await events.type(address, ' ');
        await events.click(checkout_submit);
        expect(container.getElementsByClassName('is-invalid').length).toBe(3);
    });

    it('при отправке заказа отображается информация с верным номером заказа', async() => {
        cart.setState(mock_cart);
        const store = initStore(api, cart);
        const {container } = render(  
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </MemoryRouter>
        );
        const num_order = 1;
        act(() => store.dispatch(checkoutComplete(num_order)));
        expect(screen.getByText('Well done!').innerHTML).toBe('Well done!');
        expect(container.getElementsByClassName('alert-success')[0]).not.toBeUndefined();
        expect(container.getElementsByClassName('Cart-Number')[0].innerHTML).toBe(num_order.toString());
    });
    
    it('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async() => {
        cart.setState([]);
        const store = initStore(api, cart);
        const {container } = render(  
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        );
        await act(() => store.dispatch(addToCart(mock_first_product)));
        await act(() => store.dispatch(addToCart(mock_first_product)));
        await act(() => store.dispatch(addToCart(mock_second_product)));

        expect(container.getElementsByClassName('navbar-nav')[0].getElementsByClassName('nav-link')[3]).not.toBeUndefined();
        const link_to_card = container.getElementsByClassName('navbar-nav')[0].getElementsByClassName('nav-link')[3];
        expect(link_to_card.innerHTML).toBe('Cart (2)');
    });
    
});

