const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = page.getByText("Submit");
        expect(locator).toBeVisible();
    })

    describe('login', () => {

        beforeEach(async ({ page, request }) => {
            await request.post('http://localhost:3003/api/testing/reset');
            await request.post('http://localhost:3003/api/users', {
                data: {
                    name: "Testt",
                    username: 'root',
                    password: 'root'
                }
            })
        })


        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username').fill("root");
            await page.getByTestId('password').fill("root");

            const button = await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.getByText("test is logged in")).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username').fill("test");
            await page.getByTestId('password').fill("root");

            const button = await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.getByText("Wrong username or password")).toBeVisible()
        })
    })


})