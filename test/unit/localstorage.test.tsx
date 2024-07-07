import React from 'react';
import { addToCart, initStore } from '../../src/client/store';
import { Application } from '../../src/client/Application';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ExampleApi, CartApi } from '../../src/client/api';
import { act, render} from '@testing-library/react';
import '@testing-library/jest-dom';
import { mock_first_product} from './mock';

describe('Cart', () => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    jest.mock('axios');

    it('информация о товаре, добавленном в корзину сохраняется в localstorage', async() => {
        cart.setState([]);
        const store = initStore(api, cart);
        render(  
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        );
        await act(() => store.dispatch(addToCart(mock_first_product)));
        console.log(cart.getState());
        let temp_storage = localStorage.getItem('example-store-cart');
        expect(temp_storage).toBe('[null,{\"name\":\"Practical kogtetochka\",\"count\":1,\"price\":685}]');
        console.log(cart.getState());
    });

    it('информация из localstorage попадает в корзину', async() => {
        cart.setState([]);
        const store = initStore(api, cart);
        render(  
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        );
        let temp_storage = localStorage.setItem('example-store-cart', '[null,{\"name\":\"Practical kogtetochka\",\"count\":1,\"price\":685}]');
        expect(cart.getState()[1].count).toBe(1);
        expect(cart.getState()[1].name).toBe('Practical kogtetochka');
        expect(cart.getState()[1].price).toBe(685);
    });
    
});

