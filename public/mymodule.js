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
        String(date.getMinutes()).padStart(2, "0")
    );
}
