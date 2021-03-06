const apiCall = async<T>(
    endpoint: string,
    method: string,
    headers: HeadersInit,
    body?: string
): Promise<T> => {
    const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method,
        headers,
        body,
    });
    const parsed = await response.json();
    if (response.status !== 200) {
        throw Error(parsed.message);
    };
    return parsed.message;
};

export const getInterfaceSpecs = async (): Promise<[number[], number[], string]> => {
    const response = await apiCall<{ elevatorsArray: number[], floorsArray: number[], floors: string }>(
        "init",
        "GET",
        { "accepts": "application/json" }
    );
    return [response.elevatorsArray, response.floorsArray, response.floors];
};

export const getElevatorPositions = async (): Promise<ElevatorPositions> => {
    const response = await apiCall<ElevatorPositions>(
        "positions",
        "GET",
        { "accepts": "application/json" }
    );
    return response;
};

export const moveElevator = async (destinationFloor: number): Promise<number> => {
    const response = await apiCall<number>(
        "positions",
        "PATCH",
        { "Content-Type": "application/json" },
        JSON.stringify({ destinationFloor }),
    );
    return response;
};