import { tweet } from "./twitter.js";
import { post, get } from "./fetcher.js";
// import { FormatDate } from "./mymodule.js";
import * as mymod from "./mymodule.js";
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Events = Matter.Events;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

//設定変数格納用
const configParm = {
    volume: 0,
};
let playerData = {
    lastPlay: null,
    name: null,
};
const tmpBody = {
    name: null,
    score: null,
    time: null,
};

// create an engine
const engine = Engine.create();
// create a renderer
const render = Render.create({
    element: document.body.children[0],
    engine: engine,
    options: {
        width: 450,
        height: 800,
        // showAngleIndicator: true,
        // showCollisions: true,
        // showDebug: true,
        wireframes: false,
        background: "transparent",
    },
});
console.log(render);
// create a runner
const runner = Runner.create();

//click
document.querySelector("#container > canvas").addEventListener("click", (e) => {
    if (runner.enabled == true) {
        console.log(e.clientX);
        // let box = Bodies.rectangle(e.clientX, 0, 80, 80);
        // Composite.add(engine.world, box);
        new Dodoco(e.clientX, 100);
    }
});

Events.on(engine.world, "afterAdd", (e) => {
    document.getElementById("score").innerText =
        (e.source.bodies.length - 2) / 4;
});

//death
Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;
    pairs.forEach((pair) => {
        if (pair.bodyA.label == "dead" || pair.bodyB.label == "dead") {
            runner.enabled = false;
            console.log(engine);
            tmpBody.score = (engine.world.bodies.length - 2) / 4;
            flash();
            result();
        }
    });
});

function init() {
    createStage();
    title();
    Render.run(render);
    Runner.run(runner, engine);
    runner.enabled = false;
    playerData = mymod.GetLS("playerData");
    console.log(playerData);
}

init();

//restart
function restart() {
    Matter.World.clear(engine.world);
    runner.enabled = true;
    createStage();
}

function createStage() {
    const ground = Bodies.rectangle(225, 700, 380, 60, {
        isStatic: true,
        render: {
            sprite: {
                texture: "./image/ground.png",
                xScale: 0.5,
                yScale: 0.5,
            },
        },
    });
    const deadline = Bodies.rectangle(225, 803, 900, 5, {
        isStatic: true,
        label: "dead",
    });
    Composite.add(engine.world, [ground, deadline]);
}

// const v = Bodies.fromVertices(100, 0, [
//     { x: 0, y: 0 },
//     { x: 100, y: 100 },
//     { x: 0, y: 100 },
// ]);
// const s = Bodies.fromVertices(100, 100, [
//     { x: 0, y: 0 },
//     { x: 100, y: 0 },
//     { x: 100, y: 100 },
//     { x: 0, y: 100 },
// ]);
// const tail = Bodies.fromVertices(
//     300,
//     100,
//     [
//         { x: 0, y: 25 },
//         { x: 50, y: 0 },
//         { x: 0, y: -25 },
//         { x: -50, y: 0 },
//     ],
//     {
//         isStatic: true,
//     }
// );

// const b = Matter.Constraint.create({
//     bodyB: c,
//     pointA: { x: 100, y: 100 },
//     stiffness: 1,
//     length: 0,
// });
// Composite.add(engine.world, [c, b]);
// console.log(c);

document.getElementById("test").addEventListener("click", () => {});
//ドドコ
const SIZE = 30;
const EARSIZE = 20;
class Dodoco {
    constructor(x, y) {
        this.group = Body.nextGroup(true);
        this.face = this.createFace(x, y);
        this.tail = this.createTail(x, y);
        this.earL = this.createEarL(x, y);
        this.earR = this.createEarR(x, y);
        Composite.add(engine.world, [
            this.tail,
            this.earR,
            this.earL,
            this.face,
        ]);
    }
    createFace(x, y) {
        const face = Bodies.polygon(x, y, 8, 30, {
            collisionFilter: { group: this.group },
        });
        face.render.sprite = {
            texture: "./image/Dface.png",
            xScale: 0.3,
            yScale: 0.3,
            xOffset: 0.5,
            yOffset: 0.5,
        };
        return face;
    }
    createTail(x, y) {
        const tail = Bodies.fromVertices(
            x,
            y + (SIZE * 3) / 2,
            [
                { x: 0, y: SIZE },
                { x: SIZE / 2, y: 0 },
                { x: 0, y: -SIZE },
                { x: -SIZE / 2, y: 0 },
            ],
            {
                collisionFilter: { group: this.group },
            }
        );
        tail.render.sprite = {
            texture: "./image/Dtail.png",
            xScale: 0.3,
            yScale: 0.3,
            xOffset: 0.5,
            yOffset: 0.5,
        };
        const axis = Constraint.create({
            bodyA: tail,
            pointA: { x: 0, y: -SIZE },
            bodyB: this.face,
            pointB: { x: 0, y: SIZE / 2 },
            length: 0,
            render: {
                visible: false,
            },
        });
        const rad = Math.random() * Math.PI;
        const point = Constraint.create({
            bodyA: tail,
            pointA: { x: 0, y: -SIZE / 2 },
            bodyB: this.face,
            pointB: {
                x: (Math.cos(rad) * SIZE) / 2,
                y: SIZE / 2 + (Math.sin(rad) * SIZE) / 2,
            },
            length: 0,
            render: {
                visible: false,
            },
        });
        Composite.add(engine.world, [axis, point]);
        return tail;
    }
    createEarR(x, y) {
        const ear = Bodies.fromVertices(
            x - SIZE,
            y - SIZE,
            [
                { x: 0, y: EARSIZE },
                { x: EARSIZE / 2, y: 0 },
                { x: 0, y: -EARSIZE },
                { x: -EARSIZE / 2, y: 0 },
            ],
            {
                collisionFilter: { group: this.group },
            }
        );
        ear.render.sprite = {
            texture: "./image/Dear.png",
            xScale: 0.2,
            yScale: 0.2,
            xOffset: 0.5,
            yOffset: 0.3,
        };
        const axis = Constraint.create({
            bodyA: ear,
            pointA: { x: 0, y: EARSIZE },
            bodyB: this.face,
            pointB: { x: -SIZE / 2, y: -SIZE / 2 },
            length: 0,
            render: {
                visible: false,
            },
        });
        const rad = (Math.random() * Math.PI) / 2;
        const point = Constraint.create({
            bodyA: ear,
            pointA: { x: 0, y: EARSIZE / 2 },
            bodyB: this.face,
            pointB: {
                x: -SIZE / 2 - (Math.sin(rad) * EARSIZE) / 2,
                y: -SIZE / 2 - (Math.cos(rad) * EARSIZE) / 2,
            },
            length: 0,
            render: {
                visible: false,
            },
        });
        Composite.add(engine.world, [axis, point]);
        return ear;
    }
    createEarL(x, y) {
        const ear = Bodies.fromVertices(
            x + SIZE,
            y - SIZE,
            [
                { x: 0, y: EARSIZE },
                { x: EARSIZE / 2, y: 0 },
                { x: 0, y: -EARSIZE },
                { x: -EARSIZE / 2, y: 0 },
            ],
            {
                collisionFilter: { group: this.group },
            }
        );
        ear.render.sprite = {
            texture: "./image/Dear.png",
            xScale: 0.2,
            yScale: 0.2,
            xOffset: 0.5,
            yOffset: 0.3,
        };
        const axis = Constraint.create({
            bodyA: ear,
            pointA: { x: 0, y: EARSIZE },
            bodyB: this.face,
            pointB: { x: SIZE / 2, y: -SIZE / 2 },
            length: 0,
            render: {
                visible: false,
            },
        });
        const rad = (Math.random() * Math.PI) / 2;
        const point = Constraint.create({
            bodyA: ear,
            pointA: { x: 0, y: EARSIZE / 2 },
            bodyB: this.face,
            pointB: {
                x: SIZE / 2 + (Math.sin(rad) * EARSIZE) / 2,
                y: -SIZE / 2 - (Math.cos(rad) * EARSIZE) / 2,
            },
            length: 0,
            render: {
                visible: false,
            },
        });
        Composite.add(engine.world, [axis, point]);
        return ear;
    }
}

async function title() {
    const dark_back = document.getElementById("dark-back");
    dark_back.classList.remove("hide");
    const notice = document.getElementById("notice");
    notice.querySelector(".footer button").addEventListener("click", () => {
        dark_back.classList.add("hide");
        notice.classList.add("hide");
        self.setTimeout(() => {
            runner.enabled = true;
        }, 1);
        playBGM();
    });
    const content = notice.querySelector(".mcontent");
    const req = await fetch("/start");
    const text = await req.text();
    content.innerText = text;
}

//BGM
const bgm = new Audio("/sounds/Flow_and_Breeze.mp3");
function playBGM() {
    if (bgm.paused != 1) return;
    bgm.loop = true;
    bgm.playbackRate = 0.95;
    bgm.play();
}

document.getElementById("menu").addEventListener("click", () => {
    const dark_back = document.getElementById("dark-back");
    dark_back.classList.remove("hide");
    const config = document.getElementById("config");
    config.classList.remove("hide");

    config.querySelector(".footer button").addEventListener("click", () => {
        dark_back.classList.add("hide");
        config.classList.add("hide");
        mymod.SetLS("configParm", configParm);
        self.setTimeout(() => {
            runner.enabled = true;
        }, 1);
    });
});

//スライドバー
//element:親要素 listener:発火させる関数
class slideBar {
    constructor(element, listener) {
        this.listener = listener;
        this.bar = document.createElement("div");
        this.thumb = document.createElement("div");
        this.bar.classList.add("slider");
        this.thumb.classList.add("thumb");
        element.appendChild(this.bar);
        this.bar.appendChild(this.thumb);

        this.bar.addEventListener("mousedown", (e) => {
            this.volmove(e);
            document.addEventListener("mousemove", this.volmove);
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", this.volmove);
            });
        });
        this.volmove(0);
    }
    volmove = (e) => {
        const baseColor = "#c6c4cc";
        const activeColor = "#ef9839";

        let vol = 0;
        if (typeof e == "number") {
            vol = e;
        } else {
            const rect = this.bar.getBoundingClientRect();
            const posx = rect.x;
            const x = e.clientX;
            vol = ((x - posx) / rect.width) * 100;
            if (vol < 0) vol = 0;
            if (vol > 100) vol = 100;
            this.bar.value = vol;
        }

        this.bar.style.background = `linear-gradient(to right, ${activeColor} ${vol}%, ${baseColor} ${vol}%)`;
        this.thumb.style.left = `${(vol * 150) / 100 - 10}px`;
        this.listener(vol);
    };
}

//音量スライドバー用関数
const setVolume = (vol) => {
    bgm.volume = (0.05 * vol) / 100;
    configParm.volume = vol;
};

setConfig();
function setConfig() {
    //スライドバー生成
    const slider = document.querySelector(".slider");
    const slidbar = new slideBar(slider, setVolume);
    //音量取得
    const configParm = mymod.GetLS("configParm");
    const vol = configParm?.volume >= 0 ? configParm?.volume : 100;
    console.log(vol);
    slidbar.volmove(vol);
}

//死後処理
async function result() {
    //時刻記録
    playerData.lastPlay = await get("/time");
    //表示
    const dark_back = document.getElementById("dark-back");
    dark_back.classList.remove("hide");
    const result = document.getElementById("result");
    result.classList.remove("hide");
    //ボタン設定
    result.querySelector(".footer button").addEventListener("click", () => {
        dark_back.classList.add("hide");
        result.classList.add("hide");
        restart();
        self.setTimeout(() => {
            runner.enabled = true;
        }, 1);
    });
    //文言設定
    const score = result.querySelector("#resultScore");
    score.innerText = document.querySelector("#score").innerText;
}

//フラッシュ
function flash() {
    const white = document.getElementById("white");
    white.classList.remove("hide");
    self.setTimeout(() => {
        white.style.opacity = 0;
    }, 1);
    self.setTimeout(() => {
        white.classList.add("hide");
        white.style.opacity = 1;
    }, 500);
}

//twitter share
document.querySelector("#share-twitter").addEventListener("click", {
    score: document.querySelector("#score"),
    handleEvent: tweet,
});

//rank share
document.getElementById("share-rank").addEventListener("click", () => {
    const dark_mid = document.getElementById("dark-mid");
    dark_mid.classList.remove("hide");
    const send = document.getElementById("send");
    send.classList.remove("hide");

    //set modal contents
    const name = playerData.name || "";
    const time = playerData.lastPlay;
    document.getElementById("name").value = name;
    document.getElementById("send-score").innerText = tmpBody.score;
    document.getElementById("send-time").innerText = mymod.FormatDate(time);

    tmpBody.name = name;
    tmpBody.time = time;
});
document
    .querySelector("#send .footer button")
    .addEventListener("click", async () => {
        const dark_mid = document.getElementById("dark-mid");
        const report = document.getElementById("report");

        if ((tmpBody.name = document.getElementById("name").value) == "") {
            tmpBody.name = "ななしの旅人";
        } else {
            playerData.name = tmpBody.name;
            playerData.lastPlay = tmpBody.time;
            mymod.SetLS("playerData", playerData);
        }

        const res = await post("/rank", tmpBody);
        dark_mid.classList.add("hide");
        send.classList.add("hide");
        if (res.ok) {
            report.innerText = "送信完了";
        } else {
            report.innerText = "登録済み";
        }
        report.classList.remove("hide");
        report.classList.add("show");
        self.setTimeout(() => {
            report.classList.remove("show");
        }, 1500);
    });
