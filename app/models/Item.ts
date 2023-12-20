export default interface Item {
    id: number | null;
    name: string;
    unit: string;
    createdAt: Date | null;
    done: Boolean;
    count: number
}
