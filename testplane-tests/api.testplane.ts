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

    it('Проверка сценария заказа товара и получения сообщения об успешности и номера заказа из не более 6 цифр', async({browser}) => {
        const regex = new RegExp(/^(\d){1,6}$/g);
        await browser.url('http://localhost:3000/hw/store/catalog/0');
        const button_for_add = await Promise.all(
            await browser.$$('.ProductDetails').map((card) => 
                card.$('.ProductDetails-AddToCart')
        ));
        await button_for_add[0].click();
        await browser.url('http://localhost:3000/hw/store/cart');
        const button_for_checkout = await Promise.all(
            await browser.$$('.Form').map((button) => 
                button.$('.Form-Submit')
        ));
        console.log(button_for_checkout[0]);
        await browser.$('.Form-Field_type_name').setValue('my name');
        await browser.$('.Form-Field_type_phone').setValue('9099999999');
        await browser.$('.Form-Field_type_address').setValue('address');

        await button_for_checkout[0].click();
        let temp_message = await Promise.all(
            await browser.$$('.Cart').map((button) => 
                button.$('.alert-heading').getText()
        ));
        let temp_order = await Promise.all(
            await browser.$$('.Cart').map((button) => 
                button.$('.Cart-Number').getText()
        ));

        console.log('order:',temp_order[0]);
        await expect(temp_message[0]).toBe('Well done!');
        await expect(regex.test(temp_order[0])).toBe(true);

    });
});
