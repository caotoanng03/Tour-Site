
export const isValidPassword = (passwrd) => {
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return passwrd.match(passRegex);
}

