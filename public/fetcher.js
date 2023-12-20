export async function post(path, body) {
    const dark_front = document.getElementById("dark-front");
    dark_front.classList.remove("hide");
    const res = await fetch(path, {
        method: "POST",
        body: body,
    });
    self.setTimeout(() => {
        dark_front.classList.add("hide");
    }, 200);
    return res;
}

export async function get(path) {
    const res = await fetch(path);
    const text = await res.text();
    return new Date(text);
}
