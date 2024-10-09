const { test, expect, beforeEach, describe } = require('@playwright/test')
import { loginwith } from './helper'

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await page.goto('http://localhost:5173')
        await request.post('http://localhost:3003/api/testing/reset');
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: "Testt",
                username: 'root',
                password: 'root'
            }
        })
    })

    test('Login form is shown', async ({ page }) => {
        const locator = page.getByText("Submit");
        expect(locator).toBeVisible();
    })

    describe('login', () => {

        test('succeeds with correct credentials', async ({ page }) => {
            await loginwith(page, "root", "root")
            await expect(page.getByText("test is logged in")).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginwith(page, "rotewesd", "wrong");
            const error = page.locator('.error');
            console.log(error);
            await expect(error).toContainText('Wrong username or password');
            await expect(error).toHaveCSS('background-color', 'rgb(128, 128, 128)');
            await expect(error).toHaveCSS('padding', '5px')
        })
    })

    describe("Blog creation", () => {
        beforeEach(async ({ page }) => {
            await loginwith(page, "root", "root");
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'Add Blog' }).click();
            await page.getByTestId('blogTitle').fill("Title of blog");
            await page.getByTestId('blogAuthor').fill('Nikunj');
            await page.getByTestId('blogURL').fill('www.google.com');
            await page.getByRole('button', { name: 'Create' }).click();
            await expect(page.getByText('Title of blog by Nikunj is added')).toBeVisible();
        })
    })

})