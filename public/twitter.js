export function tweet() {
    const url =
        "https://twitter.com/intent/tweet?url=https://dodoco.deno.dev/&text=";
    const content = `${this.score.innerText}点を獲得しました！`;
    window.open(url + content, "_blank", "width=600, height=300,location=no");
}
