const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Events = Matter.Events;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

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
// console.log(render);
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
    let pairs = event.pairs;
    pairs.forEach((pair) => {
        if (pair.bodyA.label == "dead" || pair.bodyB.label == "dead") {
            // Render.stop(render);
            runner.enabled = false;
        }
    });
});

function init() {
    createStage();
    title();

    // run the renderer
    Render.run(render);
    // create runner

    // run the engine
    Runner.run(runner, engine);

    runner.enabled = false;
}

init();

//restart
document.getElementById("start").addEventListener("click", () => {
    Matter.World.clear(engine.world);
    runner.enabled = true;
    createStage();
});

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

// document.getElementById("test").addEventListener("click", () => {
//     const angle = Math.random() * Math.PI * 2;
//     // angle = Math.PI / 2;
//     Body.setAngle(tail, angle);
//     Body.translate(tail, {
//         x: -50 * Math.cos(angle),
//         y: -50 * Math.sin(angle),
//     });
// });
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
        });
        Composite.add(engine.world, [axis, point]);
        return ear;
    }
}

const d = Bodies.circle(100, 65, 50);
d.render.sprite = {
    texture: "./image/Dface.png",
    xScale: 0.5,
    yScale: 0.5,
    xOffset: 0.5,
    yOffset: 0.5,
};

async function title() {
    const back = document.getElementById("back");
    back.classList.remove("hide");
    const modal = document.getElementById("modal");
    modal.querySelector("button").addEventListener("click", () => {
        back.classList.add("hide");
        modal.classList.add("hide");
        window.setTimeout(() => {
            runner.enabled = true;
        }, 1);
        playBGM();
    });
    const content = document.getElementById("mcontent");
    const req = await fetch("/start");
    const text = await req.text();
    content.innerText = text;
}

function playBGM() {
    const bgm = new Audio("/sounds/Flow_and_Breeze.mp3");
    bgm.volume = 0.1;
    bgm.loop = true;
    bgm.playbackRate = 0.95;
    bgm.play();
}
