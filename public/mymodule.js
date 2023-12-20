export function FormatDate(date) {
    if (!date) return null;
    return (
        date.getFullYear() +
        "/" +
        date.getMonth() +
        "/" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
    );
}
