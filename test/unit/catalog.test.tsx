import React from 'react';
import { initStore, productDetailsLoaded, productDetailsLoad, productsLoad, productsLoaded } from '../../src/client/store';
import { Application } from '../../src/client/Application';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ExampleApi, CartApi } from '../../src/client/api';
import { render,screen,act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Catalog } from '../../src/client/pages/Catalog';
import { mock_cart, mock_first_product, mock_second_product } from './mock';
import renderer from "react-test-renderer";


describe('Catalog', () => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();

    const store = initStore(api, cart);
    jest.mock('axios');
    it('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async() => {
        render(  
            <MemoryRouter initialEntries={['/catalog']}>
                <Provider store={store}>
                    <Catalog/>
                </Provider>
            </MemoryRouter>
        );
        await act(() => store.dispatch(productsLoaded([mock_first_product, mock_second_product] )));
        const first_product = screen.getAllByTestId('1')[0];
        const second_product = screen.getAllByTestId('2')[0];
        expect(first_product.getElementsByClassName('ProductItem-Name')[0].innerHTML).toBe(mock_first_product.name);
        expect(first_product.getElementsByClassName('ProductItem-Price')[0].innerHTML).toBe('$' + mock_first_product.price);
        expect(first_product.getElementsByClassName('ProductItem-DetailsLink')[0].getAttribute("href")).toBe('/catalog/1');
        expect(second_product.getElementsByClassName('ProductItem-Name')[0].innerHTML).toBe(mock_second_product.name);
        expect(second_product.getElementsByClassName('ProductItem-Price')[0].innerHTML).toBe('$' + mock_second_product.price);
        expect(second_product.getElementsByClassName('ProductItem-DetailsLink')[0].getAttribute("href")).toBe('/catalog/2');
    });

    it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', async() => {
        const domTree = renderer.create(  
            <MemoryRouter initialEntries={['/catalog/1']}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        );
        await act(() => store.dispatch(productDetailsLoad(1)));
        await act(() => store.dispatch(productDetailsLoaded(mock_first_product)));
        expect(domTree).toMatchSnapshot();
    });

    it('если товар уже добавлен в корзину, на странице товара должно отображаться сообщение об этом', () => {
        cart.setState(mock_cart); //товар под id=1 добавлен в корзину
        const store = initStore(api, cart);

        //будем наблюдать за страницей товара под id=1 
        render(  
            <MemoryRouter initialEntries={['/catalog/1']}> 
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        );

        act(() => store.dispatch(productDetailsLoad(1)));
        act(() => store.dispatch(productDetailsLoaded(mock_first_product))); //имитируем подгрузку информации о товаре на страницу
        expect(screen.getByText('Item in cart')).not.toBeUndefined(); //находясь на странице товара под id=1 есть информация, что он добавлен в корзину
    });
    

});

