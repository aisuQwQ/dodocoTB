export async function post(path, json) {
    const body = JSON.stringify(json);
    const dark_front = document.getElementById("dark-front");
    dark_front.classList.remove("hide");
    const res = await fetch(path, {
        method: "POST",
        body: body,
    });
    self.setTimeout(() => {
        dark_front.classList.add("hide");
    }, 200);
    console.log(res);
    return res;
}

export async function get(path) {
    const res = await fetch(path);
    const text = await res.text();
    return new Date(text);
}
