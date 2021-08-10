import { NumBool } from "stratum/common/types";

export interface EnvMatrixArgs {
    minV: number;
    minH: number;
    rows: number;
    cols: number;
    data?: number[];
}

export class EnvMatrix {
    private minV: number;
    private minH: number;
    private cols: number;
    private rows: number;
    private data: Float64Array;

    constructor(args: EnvMatrixArgs) {
        this.minV = args.minV;
        this.minH = args.minH;
        this.rows = args.rows;
        this.cols = args.cols;

        this.data = args.data ? new Float64Array(args.data) : new Float64Array(this.rows * this.cols);
    }

    get(i: number, j: number): number {
        const r = i - this.minV;
        const c = j - this.minH;
        if (r < 0 || c < 0 || r >= this.rows || c >= this.cols) return 0;
        return this.data[r * this.cols + c];
    }

    set(i: number, j: number, val: number): number {
        const r = i - this.minV;
        const c = j - this.minH;
        if (r < 0 || c < 0 || r >= this.rows || c >= this.cols) return 0;
        this.data[r * this.cols + c] = val;
        return val;
    }

    sum(): number {
        return this.data.reduce((e, sum) => e + sum, 0);
    }

    fill(value: number): NumBool {
        this.data.fill(value);
        return 1;
    }

    sortRow(index: number, desc: boolean): NumBool {
        const r = index - this.minV;
        if (r < 0 || r >= this.rows) return 0;

        const from = r * this.cols;
        const to = from + this.cols;
        const copy = this.data.subarray(from, to);

        copy.sort();
        if (desc) copy.reverse();

        return 1;
    }

    sortColumn(index: number, desc: boolean): NumBool {
        const c = index - this.minH;
        if (c < 0 || c >= this.cols) return 0;

        const copy = new Uint8Array(this.rows);
        for (let i = 0; i < this.rows; ++i) {
            copy[i] = this.data[i * this.cols + c];
        }

        copy.sort();
        if (desc) copy.reverse();

        for (let i = 0; i < this.rows; ++i) {
            this.data[i * this.cols + c] = copy[i];
        }

        return 1;
    }
}
// FLOAT MLoad(FLOAT Q, STRING FileName, FLOAT Flag)
