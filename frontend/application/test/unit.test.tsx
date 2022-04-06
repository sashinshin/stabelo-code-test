
import * as React from "react";
import * as renderer from "react-test-renderer";
import ImplementationPage from "../pages/implementation/ImplementationPage";
import { mockedInitResponse, mockedPositionsResponse, mockedUseRef } from "./test-utils/test-data"
import { enableFetchMocks } from 'jest-fetch-mock';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

jest
    .mock("react", () => {
        const originReact = jest.requireActual('react');
        return {
            ...originReact,
            useRef: () => mockedUseRef
        }
    })
    .mock("../pages/implementation/utils/react-utils", () => {
        const original = jest.requireActual("../pages/implementation/utils/react-utils");
        return {
            ...original,
            createInterfaceJSX: () => (
                <div />
            )
        }
    });

describe("1.0 ImplementationPage test suite", () => {
    beforeAll(() => {
        Enzyme.configure({ adapter: new Adapter() });
        enableFetchMocks();

    });

    it("1.1 Enzyme render", async () => {
        // when
        let wrapper;
        await renderer.act(async () => {
            wrapper = Enzyme.render(<ImplementationPage />);

            // then
            expect(wrapper.find("button")).toMatchSnapshot();
        });
    });


    it("1.2 Render page with useEffect", async () => {
        // given
        const mockedFetch = fetch as jest.Mocked<any>
        // GET http://localhost.com/api/init
        mockedFetch.once(mockedInitResponse);
        // GET http://localhost.com/api/positions
        mockedFetch.once(mockedPositionsResponse);

        // when
        await renderer.act(async () => {
            renderer.create(<ImplementationPage />);
        });

        // then
        expect(mockedFetch).toBeCalledTimes(2);
    });
});

