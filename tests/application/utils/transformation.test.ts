import { getFirstAndLastName } from '@utils/transformation'; // Atualize o caminho conforme necessário

describe("getFirstAndLastName", () => {
    it("should return the correct first and last name for a full name", () => {
        const name = "John Doe";
        const result = getFirstAndLastName(name);

        expect(result).toEqual({
            firstName: "John",
            lastName: "Doe",
        });
    });

    it("should return only the first name if there is no last name", () => {
        const name = "John";
        const result = getFirstAndLastName(name);

        expect(result).toEqual({
            firstName: "John",
            lastName: "",
        });
    });

    it("should handle names with multiple spaces between words", () => {
        const name = "  John    Doe   ";
        const result = getFirstAndLastName(name);

        expect(result).toEqual({
            firstName: "John",
            lastName: "Doe",
        });
    });

    it("should return empty strings if the input is an empty string", () => {
        const name = "  ";
        const result = getFirstAndLastName(name);

        expect(result).toEqual({
            firstName: "",
            lastName: "",
        });
    });

    it("should handle names with more than two parts correctly", () => {
        const name = "John Michael Smith";
        const result = getFirstAndLastName(name);

        expect(result).toEqual({
            firstName: "John",
            lastName: "Smith",
        });
    });
});