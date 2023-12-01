// Add additional functions to Array
interface Array<T> {
    asynchronousFind(
        predicate: (element: T, key: number, array: T[]) => Promise<boolean>,
        thisArg?: any
    ): Promise<T | undefined>;

    rotate(counter?: number, reverse?: boolean): T[];
}
