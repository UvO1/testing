describe("Adaptive", () => {
    it('При ширине браузера 576px "гамбургер" не показывается', async ({ browser }) => {
        await browser.url('http://localhost:3000/hw/store');
        await browser.setWindowSize(576, 600);
        const elem = await Promise.all(
            await browser.$$('.navbar-toggler').map((el) => el.getCSSProperty("display"))); 
        expect(elem[0].value).toBe('none');
    });
    it('При ширине браузера 575px "гамбургер" показывается', async ({ browser }) => {
        await browser.url('http://localhost:3000/hw/store');
        await browser.setWindowSize(575, 600);
        await browser.assertView("hamburg", ".navbar-toggler");
        const elem = await Promise.all(
            await browser.$$('.navbar-toggler').map((el) => el.getCSSProperty("display"))); 
        expect(elem[0].value).toBe('block');
    });
    it('При ширине браузера 575px навигация скрывается', async ({ browser }) => {
        await browser.url('http://localhost:3000/hw/store');
        await browser.setWindowSize(575, 600);
        await browser.$('.navbar').assertView("Меню скрылось и появился гамбургер");

    });
    it('При ширине браузера 576px меню показывается полностью', async ({ browser }) => {
        await browser.url('http://localhost:3000/hw/store');
        await browser.setWindowSize(576, 600);
        await browser.$('.navbar').assertView("Меню показывается полностью");

    });
});
