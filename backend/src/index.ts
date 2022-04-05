import * as cors from "kcors";
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as Router from "koa-router";

const app = new Koa();
const router = new Router();

const PORT = 3000;

const FLOORS = 20;
const ELEVATORS = 5;

let callsBlocked = false;

const generateElevators = (): boolean[][] => {
    const floors = new Array(FLOORS).fill(false);
    floors[0] = true;
    const elevators = new Array(ELEVATORS).fill(null).map(() => [...floors]);
    return elevators;
};

let elevatorPositions: boolean[][] = generateElevators();

const moveElevator = (destinationFloor: number) => {
    if (destinationFloor > FLOORS) {
        throw new Error("Invalid floor")
    }
    let loop = true;
    let iterations = 0;
    const newPositions = elevatorPositions;

    while (loop) {
        for (let elevator = 0; elevator < elevatorPositions.length; elevator++) {
            const above = elevatorPositions[elevator][destinationFloor + iterations];
            if (above) {
                newPositions[elevator][destinationFloor + iterations] = false;
                newPositions[elevator][destinationFloor] = true;

                return {
                    newPositions,
                    iterations,
                    above: true,
                }
            }
            const below = elevatorPositions[elevator][destinationFloor - iterations];
            if (below) {
                newPositions[elevator][destinationFloor - iterations] = false;
                newPositions[elevator][destinationFloor] = true;

                return {
                    newPositions,
                    iterations,
                    above: false,
                }
            }
        }

        iterations = iterations + 1
        if (iterations > FLOORS) {
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

const timeout = (newPositions: boolean[][], floorsTravelled: number, above: boolean) => {
    console.log("timeout: ",floorsTravelled*2000);
    
    setTimeout(() => {
        elevatorPositions = newPositions;
        callsBlocked = false;
        console.log("timeout over");
        
    }, floorsTravelled*2000);
}

router
    .get("/api/positions", (context) => {
        context.response.body = { message: elevatorPositions };
        context.response.status = 200;
    })
    .patch("/api/positions", (context) => {
        if (callsBlocked) {
            context.response.body = { message: "Elevator currently in movement" }
            context.response.status = 503;
        } else {


            const destinationFloor = context.request.body.destinationFloor;
            const { newPositions, iterations, above } = moveElevator(destinationFloor);

            callsBlocked = true;
            timeout(newPositions, iterations, above);


            context.response.body = {
                message: {
                    elevatorPositions: newPositions,
                    iterations
                }
            };
            context.response.status = 200;
        }

    });




app.use(bodyparser({
    enableTypes: ["json"],
}));
app.use(cors());

app.use(router.routes());


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
