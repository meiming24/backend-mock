export function generatePassword(length: number): string {
    let result = "";
    let counter = 0;
    const character = "abcdefghijklmnopqrstuvwxyz";

    const upperCharacter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const numberic = "0123456789";

    while (counter < length) {
        let addChar;
        switch (counter % 3) {
            case 0:
                addChar = getRandomChar(character);
                break;
            case 1:
                addChar = getRandomChar(upperCharacter);
                break;
            default:
                addChar = getRandomChar(numberic);
        }
        result += addChar;
        counter += 1;
    }
    return result;
}

function getRandomChar(char: string): string {
    return char.charAt(Math.floor(Math.random() * char.length));
}
