import React from 'react';
import { initStore } from '../../src/client/store';
import { Application } from '../../src/client/Application';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ExampleApi, CartApi } from '../../src/client/api';
import { render,screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import events  from '@testing-library/user-event';

export function resizeWindow(x: number = 1920, y: number = 1080){
    window.innerHeight = y;
    window.innerWidth = x;
    window.dispatchEvent(new Event('resize'));
}

describe('General testes', () => {
    const store_name = 'Kogtetochka store';
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);
        it('Название магазина в шапке является ссылкой на главную страницу', () => {
            render(  
                <MemoryRouter initialEntries={['/']}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
                );
            let temp_elem = screen.getByText(store_name);
            let temp_link = temp_elem.getAttribute('href');
            expect(temp_link).toBe('/');
        });
        it('В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
            render(  
                <MemoryRouter initialEntries={['/']}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
                );
            const header_links =  [
                {
                    name: 'Catalog',
                    link: '/catalog'
            }, {
                    name: 'Delivery',
                    link: '/delivery'
            },
                {
                    name: 'Contacts',
                    link: '/contacts'
            },  {
                    name: 'Cart',
                    link: '/cart'
            }
            ];
            expect(screen.getByText(header_links[0].name).getAttribute('href')).toBe(header_links[0].link);
            expect(screen.getByText(header_links[1].name).getAttribute('href')).toBe(header_links[1].link);
            expect(screen.getByText(header_links[2].name).getAttribute('href')).toBe(header_links[2].link);
            expect(screen.getByText(header_links[3].name).getAttribute('href')).toBe(header_links[3].link);
        });
        it('В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
            render(  
                <MemoryRouter initialEntries={['/']}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
                );
            const header_links =  [
                {
                    name: 'Catalog',
                    link: '/catalog'
            }, {
                    name: 'Delivery',
                    link: '/delivery'
            },
                {
                    name: 'Contacts',
                    link: '/contacts'
            },  {
                    name: 'Cart',
                    link: '/cart'
            }
            ];
            expect(screen.getByText(header_links[0].name).getAttribute('href')).toBe(header_links[0].link);
            expect(screen.getByText(header_links[1].name).getAttribute('href')).toBe(header_links[1].link);
            expect(screen.getByText(header_links[2].name).getAttribute('href')).toBe(header_links[2].link);
            expect(screen.getByText(header_links[3].name).getAttribute('href')).toBe(header_links[3].link);
        });
        it('При клике на гамбургер раскрываются элементы меню', async() => {
            resizeWindow(575, 600);
            let { container } = render(  
                <MemoryRouter initialEntries={['/delivery']}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
                );
            let navigation = container.getElementsByClassName('Application-Toggler')[0];
            await events.click(navigation);
            expect(container.getElementsByClassName('Application-Menu')[0]).toMatchSnapshot();
        });
        it('При клике на ссылку в раскрывшемся гамбургере меню ссылок сворачиывается', async() => {
            resizeWindow(575, 600);
            let { container } = render(  
                <MemoryRouter initialEntries={['/']}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
                );
            let navigation = container.getElementsByClassName('Application-Toggler')[0];
            await events.click(navigation);
            const menu_area = container.getElementsByClassName('Application-Menu')[0];
            await events.click(screen.getAllByText('Delivery')[0]);
            expect(menu_area).toMatchSnapshot();
        });
});

