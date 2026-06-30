
export function makeDateAppear(value) {
    const converting = new Date(value);

    const year = converting.getFullYear();

    const month = converting.getMonth() + 1;

    const date = converting.getDate();

    return `${year}-${month <= 9 ? `0${month}` : `${month}`}-${date <= 9 ? `0${date}` : `${date}`}`;
}