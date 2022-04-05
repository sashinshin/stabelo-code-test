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
    patchCallsBlocked: false,
};


router
    .get("/api/init", (context) => {
        context.response.body = {
            message: {
                floors: Array.from(Array(FLOORS).keys()).reverse(),
                elevators: Array.from(Array(ELEVATORS).keys())
            }
        };
    })
    .get("/api/positions", (context) => {
        context.response.body = { message: serverData.elevatorPositions };
        context.response.status = 200;
    })
    .patch("/api/positions", (context) => {
        if (serverData.patchCallsBlocked) {
            context.response.body = { message: "Elevator currently in movement" };
            context.response.status = 503;
        } else {

            const destinationFloor = context.request.body.destinationFloor;
            try {
                const { elevator, iterations, elevatorAbove, floorWithElevator } = getMoveElevatorData(destinationFloor, serverData.elevatorPositions);
                serverData.patchCallsBlocked = true;
                moveElevator(0, iterations, elevator, elevatorAbove, floorWithElevator, serverData);

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

app.listen(PORT);
