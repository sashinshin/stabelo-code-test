import * as React from "react";
import * as css from "../ImplementationPage.module.scss";

import { getElevatorPositions } from "./api-utils"

const getFloorKey = (elevator: number, floor: number) => `e${elevator}f${floor}`;

const generateFloorsJSX = (
    elevator: number,
    floors: number[],
    refs: ElevatorRefs
): JSX.Element[] => (floors.map((floor) => (
    <div
        key={getFloorKey(elevator, floor)}
        ref={refs.current[elevator][floor]}
        className={css.cell}>
        F{floor}
    </div>)));

export const createInterfaceJSX = (
    elevators: number[],
    floors: number[],
    refs: ElevatorRefs
): JSX.Element[] => (elevators.map((elevator) => (
    <div id={(elevator).toString()}
        key={elevator}>
        {generateFloorsJSX(elevator, floors, refs)}
    </div>)));

export const visualizeElevators = (elevatorPositions: ElevatorPositions, refs: ElevatorRefs): void => {
    elevatorPositions.forEach((elevators, elevator) => {
        elevators.forEach((elevatorOnFloor, floor) => {
            const floorElement = refs.current[elevator][floor].current
            elevatorOnFloor
                ? floorElement.classList.add(css["cell--active"])
                : floorElement.classList.remove(css["cell--active"]);
        });
    });
};

export const poller = async (floorsToTravel: number, refs: ElevatorRefs): Promise<void> => {
    if (floorsToTravel > 0) {
        setTimeout(async () => {
            const elevatorsPositions = await getElevatorPositions();
            visualizeElevators(elevatorsPositions, refs);
            poller(floorsToTravel - 1, refs);
        }, 2000);
    }
};