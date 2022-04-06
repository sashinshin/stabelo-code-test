import * as React from "react";
import * as css from "../ImplementationPage.module.scss";

import { getElevatorPositions, moveElevator } from "./api-utils"

const getFloorId = (elevator: number, floor: number) => `e${elevator}f${floor}`;

const generateFloorsJSX = (
    elevator: number,
    floors: number[]
): JSX.Element[] => (floors.map((floor) => (
    <div id={getFloorId(elevator, floor)}
        key={getFloorId(elevator, floor)}
        className={css.cell}>
        F{floor}
    </div>)));

export const createInterfaceJSX = (
    elevators: number[],
    floors: number[]
): JSX.Element[] => (elevators.map((elevator) => (
    <div id={(elevator).toString()}
        key={elevator}>
        {generateFloorsJSX(elevator, floors)}
    </div>)));

export const visualizeElevators = (elevatorPositions: ElevatorPositions): void => {
    elevatorPositions.forEach((elevators, elevator) => {
        elevators.forEach((elevatorOnFloor, floor) => {
            const floorElement = document.getElementById(getFloorId(elevator, floor));
            elevatorOnFloor
                ? floorElement.classList.add(css["cell--active"])
                : floorElement.classList.remove(css["cell--active"]);
        });
    });
};

export const poller = async (floorsToTravel: number): Promise<void> => {
    if (floorsToTravel > 0) {
        setTimeout(async () => {
            const elevatorsPositions = await getElevatorPositions();
            visualizeElevators(elevatorsPositions);
            poller(floorsToTravel - 1);
        }, 2000);
    }
};

export const onClick = async (
    maxFloors: string,
    destinationFloor: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
    try {
        const destinationFloorInt = Number.parseInt(destinationFloor, 10);
        if (destinationFloorInt > Number.parseInt(maxFloors, 10) || 0 > destinationFloorInt) {
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