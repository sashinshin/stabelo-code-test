import * as React from "react";
import * as css from "./ImplementationPage.module.scss";

const floors = Array.from(Array(20).keys()).reverse();
const elevatorsInit = Array.from(Array(5).keys());

const getFloorId = (elevator: number, floor: number) => `e${elevator}f${floor}`

const generateFloors = (elevator: number): JSX.Element[] => floors.map((floor) => <div key={getFloorId(elevator, floor)}>floor {floor}</div>);
const createInterface = (): JSX.Element[] => elevatorsInit.map((elevator) => <div id={(elevator).toString()}>{generateFloors(elevator)}</div>);


type board = boolean[][]

const initBoard: board = [
    [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true],
    [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
];

const visualizeElevators = (board: board): void => {
    board.forEach((elevators, elevator) => {
        elevators.forEach((elevatorOnFloor, floor) => {
            const floorElement = document.getElementById(getFloorId(elevator, floor));
            elevatorOnFloor
                ? floorElement.classList.add(css.active)
                : floorElement.classList.remove(css.active);
        });
    });
};

const ImplementationPage = () => {

    const [boardState, setBoardState] = React.useState(initBoard)
    const [destinationFloor, setDestinationFloor] = React.useState("0");

    const moveElevator = () => {
        let floor = parseInt(destinationFloor, 10);
        let exit = true;
        let iteration = 0;

        while (exit) {

            for (let elevator = 0; elevator < boardState.length; elevator++) {
                
                console.log("check floor", floor + iteration, " and ", floor - iteration);
                const above = boardState[elevator][floor + iteration];

                if (above) {
                    console.log(floor + iteration, " floor is elevator");
                    const newBoardState = boardState;
                    newBoardState[elevator][floor + iteration] = false;
                    newBoardState[elevator][floor] = true;
                    setBoardState(newBoardState);
                    visualizeElevators(newBoardState);
                    exit = false
                    break;
                }
                const below =  boardState[elevator][floor - iteration];
                if (below) {
                    console.log(floor - iteration, " floor is elevator");
                    const newBoardState = boardState;
                    newBoardState[elevator][floor - iteration] = false;
                    newBoardState[elevator][floor] = true;
                    setBoardState(newBoardState);
                    visualizeElevators(newBoardState);
                    exit = false
                    break;

                }

            }

            iteration = iteration + 1



        }

    }

    React.useEffect(() => {
        visualizeElevators(boardState);
    }, [])


    return (
        <>
            <h2 className={css.title}>Lägg implementationen här</h2>
            <div className={css.container}>

                {createInterface()}
            </div>

            <div>
                <input
                    type="number"
                    min="0"
                    max="19"
                    value={destinationFloor}
                    onChange={(e) => setDestinationFloor(e.target.value)}
                />

                <button onClick={moveElevator}>Elevator</button>
            </div>

        </>
    );
}


export default ImplementationPage;
