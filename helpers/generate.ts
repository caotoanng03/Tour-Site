// Generate order code
export const generateOrderCode = (number: number): string => {
    const code = `OD${String(number).padStart(8, "0")}`;
    // ${String(n)}: Chuyển đổi giá trị của biến n thành một chuỗi.
    // .padStart(8, '0'): Phương thức padStart được sử dụng để thêm ký tự '0' vào đầu chuỗi sao cho chuỗi có chiều dài là 8. Trong trường hợp này, nếu chuỗi ký tự số có chiều dài ít hơn 8, thì các ký tự '0' sẽ được thêm vào đầu chuỗi để đảm bảo chuỗi có độ dài là 8.
    // Ví dụ:
    // Nếu number = 1, kết quả sẽ là 'OD00000001'.
    // Nếu number = 20, kết quả sẽ là 'OD00000020'.
    // Nếu number = 234, kết quả sẽ là 'OD00000234'.
    return code;
};

// Generate tour code
export const generateTourCode = (number: number): string => {

    const code = `TOUR${String(number).padStart(6, '0')}`;

    return code
}

export const generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; ++i) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }

    return result;
}

export const generateRandomNumber = (length) => {
    const characters = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const generateTempPassword = (length) => {
    if (length < 3) {
        throw new Error("Password length must be at least 3 to include required characters.");
    }

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const allCharacters = uppercase + lowercase + numbers;

    let password = [
        uppercase[Math.floor(Math.random() * uppercase.length)],
        lowercase[Math.floor(Math.random() * lowercase.length)],
        numbers[Math.floor(Math.random() * numbers.length)]
    ];

    for (let i = 3; i < length; i++) {
        password.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }

    password = password.sort(() => Math.random() - 0.5);

    return password.join('');
}
