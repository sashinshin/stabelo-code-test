const apiCall = async<T>(
    endpoint: string,
    method: string,
    headers: HeadersInit,
    body?: string
): Promise<T> => {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
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

export const getInterfaceSpecs = async (): Promise<number[][]> => {
    const response = await apiCall<{ elevators: number[], floors: number[] }>(
        "api/init",
        "GET",
        { "accepts": "application/json" }
    );
    return [response.elevators, response.floors];
};

export const getElevatorPositions = async (): Promise<ElevatorPositions> => {
    const response = await apiCall<ElevatorPositions>(
        "api/positions",
        "GET",
        { "accepts": "application/json" }
    );

    return response;
};

export const moveElevator = async (destinationFloor: number): Promise<number> => {
    const response = await apiCall<number>(
        "api/positions",
        "PATCH",
        { "Content-Type": "application/json" },
        JSON.stringify({ destinationFloor }),
    );

    return response;
};