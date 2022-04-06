import * as cors from "kcors";
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as Router from "koa-router";

import config from "./config";
import { generateElevatorPositions, getMoveElevatorData, moveElevator } from "./utils";

const app = new Koa();
const router = new Router();

const { PORT, FLOORS, ELEVATORS } = config;

const serverData: ServerData = {
    elevatorPositions: generateElevatorPositions(),
    movingElevators: [],
};


router
    .get("/api/init", (context) => {
        context.response.body = {
            message: {
                floorsArray: Array.from(Array(FLOORS).keys()).reverse(),
                elevatorsArray: Array.from(Array(ELEVATORS).keys()),
                floors: FLOORS.toString(),
            }
        };
    })
    .get("/api/positions", (context) => {
        context.response.body = { message: serverData.elevatorPositions };
        context.response.status = 200;
    })
    .patch("/api/positions", (context) => {
            const destinationFloor = context.request.body.destinationFloor;
            try {
                const { elevator, iterations, elevatorAbove, floorWithElevator } = getMoveElevatorData(destinationFloor, serverData);
                serverData.movingElevators = [...serverData.movingElevators, elevator];
                moveElevator(0, iterations, elevator, elevatorAbove, floorWithElevator, serverData);

                context.response.body = { message: iterations };
                context.response.status = 200;
            } catch (error) {
                context.response.body = { message: error.message };
                context.response.status = 500;
            }
    });

app.use(bodyparser({
    enableTypes: ["json"],
}));
app.use(cors());

app.use(router.routes());

app.listen(PORT);
