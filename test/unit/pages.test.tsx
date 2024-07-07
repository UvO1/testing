import React from 'react';
import { initStore } from '../../src/client/store';
import { Application } from '../../src/client/Application';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ExampleApi, CartApi } from '../../src/client/api';
import { render,screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Contacts } from '../../src/client/pages/Contacts';
import { Delivery } from '../../src/client/pages/Delivery';

describe('Available pages', () => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);
    it('Есть главная страница', () => {
        render(  
            <MemoryRouter initialEntries={['/']}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        let temp_elem = screen.getByText('Welcome to Kogtetochka store!');
        expect(temp_elem).toBeDefined();
    });
    it('Есть каталог', () => {
        render(  
            <MemoryRouter initialEntries={['/catalog']}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        let temp_elem = screen.getAllByText('Catalog');
        expect(temp_elem[1]).not.toBeUndefined();
        expect(temp_elem).toBeDefined();
    });
    it('Есть страница с условиями доставки', () => {
        render(  
            <MemoryRouter initialEntries={['/delivery']}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        let temp_elem = screen.getAllByText('Delivery');
        expect(temp_elem[1]).not.toBeUndefined();
        expect(temp_elem).toBeDefined();
    });
    it('Есть страница c контактами', () => {
        render(  
            <MemoryRouter initialEntries={['/contacts']}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );
        let temp_elem = screen.getAllByText('Contacts');
        expect(temp_elem[1]).not.toBeUndefined();
        expect(temp_elem).toBeDefined();
    });

    it('Главная страница имеет статичное содержимое', () => {
        let temp_render = render(  
            <MemoryRouter initialEntries={['/']}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        );
        let text = temp_render.baseElement["childNodes"][0].textContent; //выводим весь контент страницы в виде текста
        expect(text).not.toBeUndefined();
        expect(text?.includes("LOADING")).toBe(false); //если присутствует текст LOADING, то на странице ожидается загрузка контента, она не статична
    });

    it('Cтраница с условиями доставки имеет статичное содержимое', () => {
        let temp_render = render(  
            <MemoryRouter initialEntries={['/delivery']}>
                <Provider store={store}>
                    <Delivery/>
                </Provider>
            </MemoryRouter>
        );
        let text = temp_render.baseElement["childNodes"][0].textContent; //выводим весь контент страницы в виде текста
        expect(text).not.toBeUndefined();
        expect(text?.includes("LOADING")).toBe(false); //если присутствует текст LOADING, то на странице ожидается загрузка контента, она не статична
    });

    it('Cтраница с контактами имеет статичное содержимое', () => {
        let temp_render = render(  
            <MemoryRouter initialEntries={['/contacts']}>
                <Provider store={store}>
                    <Contacts/>
                </Provider>
            </MemoryRouter>
        );
        let text = temp_render.baseElement["childNodes"][0].textContent; //выводим весь контент страницы в виде текста
        expect(text).not.toBeUndefined();
        expect(text?.includes("LOADING")).toBe(false); //если присутствует текст LOADING, то на странице ожидается загрузка контента, она не статична
    });
});

