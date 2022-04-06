import nock = require("nock");
import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
const mockedFetch = fetch as jest.Mocked<any>

// import fetchMock = require('jest-fetch-mock');
// fetchMock.enableFetchMocks()
import * as React from "react";
import * as renderer from "react-test-renderer";
import ImplementationPage from "../pages/implementation/ImplementationPage";


import { createInterfaceJSX } from "../pages/implementation/utils/react-utils"
import { getInterfaceSpecs, getElevatorPositions } from "../pages/implementation/utils/api-utils"

const test = () => {
    console.log(React);
    console.log(getElevatorPositions);
}
console.log(test);


const [FLOORS, ELEVATORS] = [5, 20];

export const generateElevatorPositions = (): ElevatorPositions => {
    const floors = new Array(FLOORS).fill(false);
    floors[0] = true;
    const elevators = new Array(ELEVATORS).fill(undefined).map(() => [...floors]);
    return elevators;
};

nock("http://localhost:3000/api")
    .get("/init")
    .reply(200, {
        message: {
            floorsArray: Array.from(Array(FLOORS).keys()).reverse(),
            elevatorsArray: Array.from(Array(ELEVATORS).keys()),
            floors: (FLOORS - 1).toString(),
        }
    });
nock("http://localhost:3000/api")
    .get("/positions")
    .reply(200, {
        message: generateElevatorPositions()
    });
nock("http://localhost:3000/api")
    .patch("/positions")
    .reply(200, {
        message: 2
    }
    );

describe("1.0 ImplementationPage test suite", () => {
    it("1.1 Mount ImplementationPage component", async () => {
        // given
        const mockedInitResponse = JSON.stringify({
            message: {
                floorsArray: Array.from(Array(FLOORS).keys()).reverse(),
                elevatorsArray: Array.from(Array(ELEVATORS).keys()),
            }
        });
        const mockedPositionsResponse = JSON.stringify({
            message: generateElevatorPositions()
        });
        mockedFetch
            .once(mockedInitResponse)
            .once(mockedPositionsResponse);

        // when
        const tree = renderer
            .create(<ImplementationPage />)
            .toJSON();

        // then
        expect(tree).toMatchSnapshot()
    });

    it("1.2 Generate interface JSX", async () => {
        // given
        const mockedResponse = JSON.stringify({
            message: {
                floorsArray: Array.from(Array(FLOORS).keys()).reverse(),
                elevatorsArray: Array.from(Array(ELEVATORS).keys()),
            }
        })
        mockedFetch.mockResponse(mockedResponse);

        // when
        const [elevatorsArray, floorsArray] = await getInterfaceSpecs();
        const interfaceJSX = createInterfaceJSX(elevatorsArray, floorsArray);

        // then
        expect(interfaceJSX).toMatchSnapshot();


    });
});

