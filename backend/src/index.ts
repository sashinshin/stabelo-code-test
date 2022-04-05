import * as cors from "kcors";
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as Router from "koa-router";

const app = new Koa();
const router = new Router();

const PORT = 3000;

const FLOORS = 20;
const ELEVATORS = 5;


const generateElevators = (): boolean[][] => {
    const floors = new Array(FLOORS).fill(false)
    floors[0] = true
    const elevators = new Array(ELEVATORS).fill(null).map(() => [...floors]);
    return elevators
};

let elevatorPositions: boolean[][] = generateElevators();

const moveElevator = (destinationFloor: number) => {
    if (destinationFloor > FLOORS) {
        throw new Error("Invalid floor")
    }
    let loop = true;
    let iteration = 0;
    const newPositions = elevatorPositions;

    while (loop) {
        for (let elevator = 0; elevator < elevatorPositions.length; elevator++) {
            const above = elevatorPositions[elevator][destinationFloor + iteration];
            if (above) {
                newPositions[elevator][destinationFloor + iteration] = false;
                newPositions[elevator][destinationFloor] = true;

                return {
                    newPositions,
                    iteration,
                }
            }
            const below = elevatorPositions[elevator][destinationFloor - iteration];
            if (below) {
                newPositions[elevator][destinationFloor - iteration] = false;
                newPositions[elevator][destinationFloor] = true;

                return {
                    newPositions,
                    iteration,
                }
            }
        }

        iteration = iteration + 1
        if (iteration > FLOORS) {
            throw new Error("Too many iterations")
        }
    }
}


router.get("/api/init", (context) => {
    context.response.body = {
        message: {
            floors: Array.from(Array(FLOORS).keys()).reverse(),
            elevators: Array.from(Array(ELEVATORS).keys())
        }
    }
});

router
    .get("/api/positions", (context) => {
        context.response.body = { message: elevatorPositions };
        context.response.status = 200;
    })
    .patch("/api/positions", (context) => {
        console.log("/patch positions");

        // console.log(elevatorPositions);

        // console.log(context.request.body);
        const newPos = moveElevator(context.request.body.destinationFloor);
        console.log(newPos);
        elevatorPositions = newPos.newPositions;





        context.response.body = { message: elevatorPositions };
        context.response.status = 200;
    })




app.use(bodyparser({
    enableTypes: ["json"],
}));
app.use(cors());

app.use(router.routes());

// app.use(router.allowedMethods());

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
