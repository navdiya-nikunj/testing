const loginwith = async (page, username, password) => {
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(password);

    const button = await page.getByRole('button', { name: 'Submit' }).click();
}

export { loginwith };