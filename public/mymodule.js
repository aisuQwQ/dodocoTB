export function FormatDate(date) {
    if (!date) return null;
    return (
        date.getFullYear() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        String(date.getMinutes()).padStart(2, "0")
    );
}

export function GetLS(key) {
    let json = null;
    try {
        json = { ...JSON.parse(localStorage.getItem(key)) };
    } catch {
        localStorage.removeItem(key);
    }
    return json;
}
export function SetLS(key, json) {
    const value = JSON.stringify(json);
    localStorage.setItem(key, value);
}
