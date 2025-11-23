import * as CryptoJS from "crypto-js";

export function encrypt(text: string) {
    return CryptoJS.AES.encrypt(text, process.env.ENCRYPT_SECRET!).toString();

}

export function decrypt(ciphertext: string) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPT_SECRET!);
    return bytes.toString(CryptoJS.enc.Utf8);
}