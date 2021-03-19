/*
Copyright 2021 Adevinta
*/

export default
    /**
    * This functions applies the async mapper function to all the items, by
    * running concurrently the m function in batches of "batchSize". That is the
    * function ensures that the n async function is applied to all the items but
    * there is no more than batchSize functions running concurrently in any
    * given time.
    */
    async function asyncMapBatches<T, K>(items: T[], batchSize: number, m: mapper<T, K>): Promise<[T, K][]> {
    const res: [T, K][] = [];
    const batches = (items.length / batchSize) + (items.length % batchSize);
    for (let i = 0; i < batches; i = i + 1) {
        const first = i * batchSize;
        let last = i * batchSize + batchSize
        last = (last <= items.length) ? last : items.length;
        const batchItems = items.slice(first, last);
        const batch = await mapBatch(batchItems, m);
        batch.forEach((v, j) => {
            res.push([batchItems[j], v])
        });
    }
    return res
}

export async function mapBatch<T, K>(items: T[], m: mapper<T, K>): Promise<K[]> {
    const ops: Promise<any>[] = [];
    for (const item of items) {
        const op = m(item);
        ops.push(op)
    }
    return await Promise.all(ops);
}

export type mapper<T, K> = (item: T) => Promise<K>
