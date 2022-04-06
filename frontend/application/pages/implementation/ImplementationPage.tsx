import "regenerator-runtime/runtime.js";
import * as React from "react";
import * as css from "./ImplementationPage.module.scss";
import { getInterfaceSpecs, getElevatorPositions, moveElevator } from "./utils/api-utils";
import { createInterfaceJSX, visualizeElevators, poller } from "./utils/react-utils";


const ImplementationPage = (): JSX.Element => {
    const [destinationFloor, setDestinationFloor] = React.useState<string>("0");
    const [elevatorInterface, setElevatorInterface] = React.useState<JSX.Element[]>([]);
    const [maxFloors, setMaxFloors] = React.useState<string>("0");
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const createRefs = () => (new Array(5)
        .fill(undefined)
        .map(() => (new Array(20)
            .fill(undefined)
            .map(() => React.createRef())
        )));
    const refs = React.useRef(createRefs());

    const onClick = async (): Promise<void> => {
        try {
            const destinationFloorInt = Number.parseInt(destinationFloor, 10);
            const maxFloorsInt = Number.parseInt(maxFloors, 10);
            if (destinationFloorInt > maxFloorsInt || 0 > destinationFloorInt) {
                throw new Error("Invalid destination floor");
            }
            const floorsToTravel = await moveElevator(destinationFloorInt);
            poller(floorsToTravel, refs as ElevatorRefs);
        } catch (error) {
            setErrorMessage(error.message as string);
            setTimeout(() => {
                setErrorMessage("");
            }, 2000);
        }
    };

    React.useEffect((): void => {
        const init = async (): Promise<void> => {
            const [elevatorsArray, floorsArray, floors] = await getInterfaceSpecs();
            setMaxFloors(floors);
            const interfaceJSX = createInterfaceJSX(elevatorsArray, floorsArray, refs as ElevatorRefs);
            setElevatorInterface(interfaceJSX);
            const elevatorsPositions = await getElevatorPositions();
            visualizeElevators(elevatorsPositions, refs as ElevatorRefs);
        }
        init();
    }, []);

    return (
        <>
            <div className={css["cell-container"]}>
                {elevatorInterface}
            </div>

            <div className={css["button-container"]}>
                <input
                    type="number"
                    min="0"
                    max={maxFloors}
                    value={destinationFloor}
                    onChange={(e) => setDestinationFloor(e.target.value)}
                />

                {errorMessage
                    ? <div>{errorMessage}</div>
                    : <button onClick={onClick}>Elevator</button>}

            </div>

        </>
    );
};

export default ImplementationPage;
