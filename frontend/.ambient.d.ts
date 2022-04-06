declare module "*.module.scss" {
    interface IClassNames {
        [className: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
}

type ElevatorPositions = boolean[][];

type ElevatorRefs = React.MutableRefObject<React.RefObject<HTMLDivElement>[][]>