const { test, expect, beforeEach, describe } = require('@playwright/test')
import { createBlog, loginwith } from './helper'

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await page.goto('http://localhost:5173')
        const ress = await request.post('http://localhost:3003/api/testing/reset');
        console.log("resss", ress);
        const res = await request.post('http://localhost:3003/api/users', {
            data: {
                name: "Testt",
                username: 'root',
                password: 'root'
            }
        })
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: "Testt",
                username: 'test',
                password: 'test'
            }
        })
        console.log(res);
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
            await createBlog(page, "Title of blog", 'Nikunj', 'www.google.com');
            await expect(page.getByText('Title of blog by Nikunj is added')).toBeVisible();
        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(page, "blog", 'Nikunj', 'www.google.com');

            await page.getByText('blog byNikunjView').waitFor();
            const blogDiv = page.getByText('blog byNikunjView');
            await blogDiv.getByRole('button', { name: 'View' }).click();

            await page.getByRole('button', { name: 'Like', exact: 'true' }).click();
            await expect(page.getByText('Likes: 1')).toBeVisible();

        })

        test('delete blog', async ({ page }) => {
            await createBlog(page, "blog", 'Nikunj', 'www.google.com');
            await page.getByText('blog byNikunjView').waitFor();
            const blogDiv = page.getByText('blog byNikunjView')
            await blogDiv.getByRole('button', { name: 'View' }).click();
            await page.getByRole('button', { name: 'Delete', exact: 'true' }).click();
            // page.on('dialog', dialog => console.log(dialog.message()));
            // page.on('dialog', dialog => dialog.accept());
            // await page.getByRole('button').click();
            await page.getByText('blog by Nikunj is deleted').waitFor();
            await expect(page.getByText('blog by Nikunj is deleted')).toBeVisible();
        })

        test('authorised can see the delete button', async ({ page }) => {
            await createBlog(page, "blog", 'Nikunj', 'www.google.com');
            await page.getByRole('button', { name: 'Logout' }).click();
            await loginwith(page, 'test', 'test');
            await page.getByText('blog byNikunjView').waitFor();
            const blogDiv = page.getByText('blog byNikunjView')
            await blogDiv.getByRole('button', { name: 'View' }).click();
            await expect(blogDiv.getByText('Delete')).not.toBeVisible();
        })

    })

})