import * as cors from "kcors";
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as Router from "koa-router";
import config from "./config"
import { moveElevator } from "./utils";

const app = new Koa();
const router = new Router();

const { PORT, FLOORS, ELEVATORS } = config;


const generateElevators = (): boolean[][] => {
    const floors = new Array(FLOORS).fill(false);
    floors[0] = true;
    const elevators = new Array(ELEVATORS).fill(null).map(() => [...floors]);
    return elevators;
};

let elevatorPositions: boolean[][] = generateElevators();
let callsBlocked = false;


const timeout = (floorsTravelled: number, floorsToTravel: number, elevator: number, above: boolean, floorWithElevator: number): void => {
    if (floorsToTravel > floorsTravelled) {
        setTimeout(() => {

            const newFloorWithElevator = above ? floorWithElevator - 1 : floorWithElevator + 1;
            elevatorPositions[elevator][floorWithElevator] = false;
            elevatorPositions[elevator][newFloorWithElevator] = true;

            timeout(floorsTravelled + 1, floorsToTravel, elevator, above, newFloorWithElevator);

            console.log("travelled ", floorsTravelled + 1, " stops");

        }, 2000);
    } else {
        callsBlocked = false;
    };
};

router
    .get("/api/init", (context) => {
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
        if (callsBlocked) {
            context.response.body = { message: "Elevator currently in movement" }
            context.response.status = 503;
        } else {


            const destinationFloor = context.request.body.destinationFloor;

            try {
                const { elevator, iterations, above, floorWithElevator } = moveElevator(destinationFloor, elevatorPositions);
                callsBlocked = true;
                timeout(0, iterations, elevator, above, floorWithElevator);

                context.response.body = { message: iterations };
                context.response.status = 200;
            } catch (error) {
                // handle error here
            }
        }

    });



app.use(bodyparser({
    enableTypes: ["json"],
}));
app.use(cors());

app.use(router.routes());


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
