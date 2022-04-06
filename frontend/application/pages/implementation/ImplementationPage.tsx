import "regenerator-runtime/runtime.js";
import * as React from "react";
import * as css from "./ImplementationPage.module.scss";
import { getInterfaceSpecs, getElevatorPositions, moveElevator } from "./utils/api-utils";
// import { visualizeElevators, createInterfaceJSX } from "./utils/react-utils";
import { createInterfaceJSX, visualizeElevators, poller } from "./utils/react-utils";


// const getFloorId = (elevator: number, floor: number) => `e${elevator}f${floor}`;

// const generateFloorsJSX = (
//     elevator: number,
//     floors: number[]
// ): JSX.Element[] => (floors.map((floor) => (
//     <div id={getFloorId(elevator, floor)}
//         key={getFloorId(elevator, floor)}
//         className={css.cell}>
//         F{floor}
//     </div>)));

// export const createInterfaceJSX = (
//     elevators: number[],
//     floors: number[]
// ): JSX.Element[] => (elevators.map((elevator) => (
//     <div id={(elevator).toString()}
//         key={elevator}>
//         {generateFloorsJSX(elevator, floors)}
//     </div>)));

// const visualizeElevators = (elevatorPositions: ElevatorPositions): void => {
//     elevatorPositions.forEach((elevators, elevator) => {
//         elevators.forEach((elevatorOnFloor, floor) => {
//             const floorElement = document.getElementById(getFloorId(elevator, floor));
//             elevatorOnFloor
//                 ? floorElement.classList.add(css["cell--active"])
//                 : floorElement.classList.remove(css["cell--active"]);
//         });
//     });
// };

// const poller = async (floorsToTravel: number): Promise<void> => {
//     if (floorsToTravel > 0) {
//         setTimeout(async () => {
//             const elevatorsPositions = await getElevatorPositions();
//             visualizeElevators(elevatorsPositions);
//             poller(floorsToTravel - 1);
//         }, 2000);
//     }
// };

// const onClick = async (
//     maxFloors: string,
//     destinationFloor: string,
//     setErrorMessage: React.Dispatch<React.SetStateAction<string>>
// ): Promise<void> => {
//     try {
//         const destinationFloorInt = Number.parseInt(destinationFloor, 10);
//         if (destinationFloorInt > Number.parseInt(maxFloors, 10) || 0 > destinationFloorInt) {
//             throw new Error("Invalid destination floor");
//         }
//         const floorsToTravel = await moveElevator(destinationFloorInt);
//         poller(floorsToTravel);
//     } catch (error) {
//         setErrorMessage(error.message as string);
//         setTimeout(() => {
//             setErrorMessage("");
//         }, 2000);
//     }
// };

const ImplementationPage = (): JSX.Element => {
    const [destinationFloor, setDestinationFloor] = React.useState<string>("0");
    const [elevatorInterface, setElevatorInterface] = React.useState<JSX.Element[]>([]);
    const [maxFloors, setMaxFloors] = React.useState<string>("0");
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const onClick = async (): Promise<void> => {
        try {
            const destinationFloorInt = Number.parseInt(destinationFloor, 10);
            const maxFloorsInt = Number.parseInt(maxFloors, 10);
            if (destinationFloorInt > maxFloorsInt || 0 > destinationFloorInt) {
                throw new Error("Invalid destination floor");
            }
            const floorsToTravel = await moveElevator(destinationFloorInt);
            poller(floorsToTravel);
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
            setElevatorInterface(createInterfaceJSX(elevatorsArray, floorsArray));
            const elevatorsPositions = await getElevatorPositions();
            visualizeElevators(elevatorsPositions);
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
