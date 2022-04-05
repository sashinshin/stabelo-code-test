import * as cors from "kcors";
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as Router from "koa-router";

const app = new Koa();
const router = new Router();
console.log("hello");


// This is just an example route
router.get("/sample", (context) => {
    console.log("/sample");
    
    context.response.body = { message: "Hello world" };
    context.response.status = 200;
});

// let board = []

// router
//     .get("/api/board", (context) => {
//         console.log("/get board");

//         context.response.body = { message: "Hello world" };
//         context.response.status = 200;
//     })
//     .post("/api/board", (context) => {
//         console.log("/post board");

//         context.response.body = { message: "Hello world" };
//         context.response.status = 200;
//     })




// Add additional routes for implementation here...

app.use(bodyparser({
    enableTypes: ["json"],
}));
app.use(cors());

app.use(router.routes());

app.listen(3000, () => console.log("Listening on port 3000"));
