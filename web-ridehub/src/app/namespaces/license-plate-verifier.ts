export namespace verifyLicense {
    const licenseRegex : RegExp = /(^(?:[A-Z]{2}-\d{2}-\d{2})|(?:\d{2}-[A-Z]{2}-\d{2})|(?:\d{2}-\d{2}-[A-Z]{2})$)/gm;

    export class licenseValidator {
        static isValid(lincese: string) {
            return licenseRegex.test(lincese);
        }
    }
}