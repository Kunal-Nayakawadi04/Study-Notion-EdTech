require('dotenv').config();

const password = process.env.MAIL_PASS;
const user = process.env.MAIL_USER;

console.log(`User: '${user}' (Length: ${user.length})`);
console.log(`Password Length: ${password ? password.length : 'undefined'}`);

if (password) {
    console.log(`First char code: ${password.charCodeAt(0)}`);
    console.log(`Last char code: ${password.charCodeAt(password.length - 1)}`);

    // Check for spaces
    if (password.includes(' ')) {
        console.log("WARNING: Password contains spaces!");
    } else {
        console.log("Password contains no spaces.");
    }
} else {
    console.log("Password is not loaded.");
}
