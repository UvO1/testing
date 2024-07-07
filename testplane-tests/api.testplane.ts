describe("Api", () => {
    it('Загрузка товаров в каталоге', async({browser}) => {
        await browser.url('http://localhost:3000/hw/store/catalog');
        const data = await Promise.all(
            await browser.$$('.card-body').map((card) => card.$('.ProductItem-Name'))
        )
        for( let name of data){
            expect(name).not.toBeUndefined();
        }
    });
    it('Информация товаров в каталоге соответствует информации в карточке товара ', async({browser}) => {
        await browser.url('http://localhost:3000/hw/store/catalog');
        const data_name = await Promise.all(
            await browser.$$('.card-body').map((card) =>   card.$('.ProductItem-Name').getText()
        ));
        const data_price = await Promise.all(
            await browser.$$('.card-body').map((card) =>   card.$('.ProductItem-Price').getText()
        ));
        await browser.url('http://localhost:3000/hw/store/catalog/0');
        const data_card_name = await Promise.all(
            await browser.$$('.ProductDetails').map((card) => 
                card.$('.ProductDetails-Name').getText()
        ));
        const data_card_price = await Promise.all(
            await browser.$$('.ProductDetails').map((card) => 
                card.$('.ProductDetails-Price').getText()
        ));

        expect(data_price[0]).toBe(data_card_price[0]);
        expect(data_name[0]).toBe(data_card_name[0]);
    });
});
