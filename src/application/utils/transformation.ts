

const getFirstAndLastName = (name: string) => {
    const nameParts = name.trim().split(/\s+/); // Divide o nome por espaços em branco
    const firstName = nameParts[0]; // Primeiro nome
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""; // Último nome ou vazio

    return {
      firstName,
      lastName,
    }
}

export {getFirstAndLastName}
