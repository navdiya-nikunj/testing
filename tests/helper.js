import { expect } from "@playwright/test";

const loginwith = async (page, username, password) => {
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(password);

    await page.getByRole('button', { name: 'Submit' }).click();
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'Add Blog' }).click();
    await page.getByTestId('blogTitle').fill(title);
    await page.getByTestId('blogAuthor').fill(author);
    await page.getByTestId('blogURL').fill(url);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();
}

const likeBlog = async (page, blogTitle) => {
    await page.getByText(`${blogTitle}View`).waitFor();
    const blogDiv = page.getByText(`${blogTitle}View`);
    await blogDiv.getByRole('button', { name: 'View' }).click();

    await page.getByRole('button', { name: 'Like', exact: 'true' }).click();

}
export { loginwith, createBlog, likeBlog };