interface ServerData {
    elevatorPositions:boolean[][];
    movingElevators: number[];
}

type ElevatorPositions = boolean[][];

interface MovingElevatorData {
    elevator: number;
    iterations: number;
    elevatorAbove: boolean;
    floorWithElevator: number;
}