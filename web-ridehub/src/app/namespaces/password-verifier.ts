// Minimum eight characters, at least one letter and one number

export namespace verifyPassword {
    const passwordRegex : RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    export class passwordValidator {
        static isValid(password: string) {
            return passwordRegex.test(password);
        }
    }
}