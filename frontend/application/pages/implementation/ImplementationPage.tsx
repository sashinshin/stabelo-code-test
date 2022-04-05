import * as React from "react";
import * as css from "./ImplementationPage.module.scss";
import "regenerator-runtime/runtime.js";
import { getInterfaceSpecs, getElevatorPositions, moveElevator } from "./api-utils";

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
    const [loading, setLoading] = React.useState<boolean>(true);

    const poller = async (floorsToTravel: number): Promise<void> => {
        if (floorsToTravel > 0) {
            setTimeout(async () => {
                const elevatorsPositions = await getElevatorPositions();
                visualizeElevators(elevatorsPositions);
                poller(floorsToTravel - 1);
            }, 2000)
        } else {
            setLoading(false);
        }
    };

    const onClick = async (): Promise<void> => {
        setLoading(true);
        const floorsToTravel = await moveElevator(Number.parseInt(destinationFloor));
        poller(floorsToTravel);
    }

    React.useEffect((): void => {
        const init = async (): Promise<void> => {
            const [elevators, floors] = await getInterfaceSpecs();
            setElevatorInterface(createInterface(elevators, floors));
            const elevatorsPositions = await getElevatorPositions();
            visualizeElevators(elevatorsPositions);
            setLoading(false);
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

                {loading
                    ? <p>loading...</p>
                    : <button onClick={onClick}>Elevator</button>}

            </div>

        </>
    );
};

export default ImplementationPage;
