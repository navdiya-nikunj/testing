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
}

export { loginwith, createBlog };