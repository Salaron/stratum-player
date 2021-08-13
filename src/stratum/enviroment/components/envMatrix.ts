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

    isSquare(): boolean {
        return this.cols === this.rows;
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

    mul(secondMatrix: EnvMatrix): EnvMatrix | null {
        if (this.cols !== secondMatrix.rows) return null;

        const cols = secondMatrix.cols;
        const rows = this.rows;
        const result = new EnvMatrix({
            cols,
            rows,
            minH: this.minH,
            minV: this.minV,
        });

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < secondMatrix.cols; j++) {
                let sum = 0;
                for (let k = 0; k < this.rows; k++) {
                    sum += this.data[i * this.cols + k] * secondMatrix.data[k * secondMatrix.cols + j];
                }
                result.data[i * this.rows + j] = sum;
            }
        }

        return result;
    }

    det(): number {
        if (!this.isSquare()) throw new Error("Not a square matrix");
        if (this.rows === 1) return this.data[0];
        if (this.rows === 2) {
            return this.data[0] * this.data[3] - this.data[1] * this.data[2];
        }
        const copy = Array.from(this.data);
        const n = this.rows;

        let det = 1;
        for (let i = 0; i < n; i++) {
            let max = 0;
            let maxIndex = 0;
            for (let j = i; j < n; j++) {
                let t = copy[j * n + i];
                if (t > max) {
                    max = t;
                    maxIndex = j;
                }
            }
            if (max === 0) return 0;
            if (maxIndex !== i) {
                det = -det;
                for (let j = i; j < n; j++) {
                    let t = copy[maxIndex * n + j];
                    copy[maxIndex * n + j] = copy[i * n + j];
                    copy[i * n + j] = t;
                }
            }

            for (let j = i + 1; j < n; j++) {
                let t = copy[j * n + i] / max;
                for (let k = i + 1; k < n; k++) {
                    copy[j * n + k] = copy[j * n + k] - t * copy[i * n + k];
                }
            }
            det = det * copy[i * n + i];
        }
        return det;
    }

    obr(): EnvMatrix | null {
        if (!this.isSquare() || this.det() === 0) return null;

        const N = this.rows;
        const copy = new EnvMatrix({
            cols: this.cols,
            rows: this.rows,
            minH: 0,
            minV: 0,
            data: Array.from(this.data),
        });
        const result = new EnvMatrix({
            cols: this.cols,
            rows: this.rows,
            minH: 0,
            minV: 0,
        });

        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                result.set(i, j, 0);
                if (i === j) {
                    result.set(i, j, 1);
                }
            }
        }

        for (let k = 0; k < N; k++) {
            let temp = copy.get(k, k);

            for (let j = 0; j < N; j++) {
                copy.set(k, j, copy.get(k, j) / temp);
                result.set(k, j, result.get(k, j) / temp);
            }

            for (let i = k + 1; i < N; i++) {
                temp = copy.get(i, k);
                for (let j = 0; j < N; j++) {
                    copy.set(i, j, copy.get(i, j) - copy.get(k, j) * temp);
                    result.set(i, j, result.get(i, j) - result.get(k, j) * temp);
                }
            }
        }

        for (let k = N - 1; k > 0; k--) {
            for (let i = k - 1; i >= 0; i--) {
                let temp = copy.get(i, k);

                for (let j = 0; j < N; j++) {
                    copy.set(i, j, copy.get(i, j) - copy.get(k, j) * temp);
                    result.set(i, j, result.get(i, j) - result.get(k, j) * temp);
                }
            }
        }

        result.minH = this.minH;
        result.minV = this.minV;
        return result;
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

    toArrayBuffer(): ArrayBuffer {
        const size = 34 + this.data.byteLength;
        const buf = new ArrayBuffer(size);
        const r = new DataView(buf);

        r.setUint16(0, 0x0c, true);
        [0x4d, 0x41, 0x54, 0x52, 0x49, 0x58, 0x20, 0x46, 0x49, 0x4c, 0x45, 0x2e].forEach((v, i) => r.setUint8(2 + i, v));
        [this.rows, this.cols, this.minV, this.minH].forEach((v, i) => r.setInt32(14 + i * 4, v, true));
        //пропускаем два uint16 нуля
        this.data.forEach((v, i) => r.setFloat64(34 + i * 8, v, true));

        return buf;
    }
}
