import * as React from "react";
import * as css from "./ImplementationPage.module.scss";
import "regenerator-runtime/runtime.js";
import { getInterface, getElevatorPositions, moveElevator } from "./api-utils";

const getFloorId = (elevator: number, floor: number) => `e${elevator}f${floor}`;

const generateFloors = (elevator: number, floors: number[]): JSX.Element[] => floors.map((floor) => <div id={getFloorId(elevator, floor)} key={getFloorId(elevator, floor)}>floor {floor}</div>);
const createInterface = (elevators: number[], floors: number[]): JSX.Element[] => elevators.map((elevator) => <div id={(elevator).toString()} key={elevator}>{generateFloors(elevator, floors)}</div>);

const visualizeElevators = (elevatorPositions: ElevatorPositions): void => {
    elevatorPositions.forEach((elevators, elevator) => {
        elevators.forEach((elevatorOnFloor, floor) => {
            const floorElement = document.getElementById(getFloorId(elevator, floor));
            elevatorOnFloor
                ? floorElement.classList.add(css.active)
                : floorElement.classList.remove(css.active);
        });
    });
};

const ImplementationPage = () => {
    const [destinationFloor, setDestinationFloor] = React.useState<string>("0");
    const [elevatorInterface, setElevatorInterface] = React.useState<JSX.Element[]>([]);

    const onClick = async (): Promise<void> => {
        const [elevatorPositions, iterations] = await moveElevator(Number.parseInt(destinationFloor));
        console.log(iterations);
        
        visualizeElevators(elevatorPositions);
    }

    React.useEffect((): void => {
        const init = async (): Promise<void> => {
            const [elevators, floors] = await getInterface();
            setElevatorInterface(createInterface(elevators, floors));
            const elevatorsPositions = await getElevatorPositions();
            visualizeElevators(elevatorsPositions);
        }

        init();
    }, []);

    return (
        <>
            <h2 className={css.title}>Lägg implementationen här</h2>
            <div className={css.container}>

                {elevatorInterface}
            </div>

            <div>
                <input
                    type="number"
                    min="0"
                    max="19"
                    value={destinationFloor}
                    onChange={(e) => setDestinationFloor(e.target.value)}
                />

                <button onClick={onClick}>Elevator</button>

            </div>

        </>
    );
};

export default ImplementationPage;
