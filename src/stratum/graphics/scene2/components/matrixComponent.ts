export class MatrixComponent {
    private static getInversedMatrix(matrix: number[]): number[] {
        const det =
            matrix[0] * (matrix[4] * matrix[8] - matrix[7] * matrix[5]) -
            matrix[1] * (matrix[3] * matrix[8] - matrix[5] * matrix[6]) +
            matrix[2] * (matrix[3] * matrix[7] - matrix[4] * matrix[6]);

        return [
            (matrix[4] * matrix[8] - matrix[7] * matrix[5]) / det,
            (matrix[2] * matrix[7] - matrix[1] * matrix[8]) / det,
            (matrix[1] * matrix[5] - matrix[2] * matrix[4]) / det,
            (matrix[5] * matrix[6] - matrix[3] * matrix[8]) / det,
            (matrix[0] * matrix[8] - matrix[2] * matrix[6]) / det,
            (matrix[3] * matrix[2] - matrix[0] * matrix[5]) / det,
            (matrix[3] * matrix[7] - matrix[6] * matrix[4]) / det,
            (matrix[6] * matrix[1] - matrix[0] * matrix[7]) / det,
            (matrix[0] * matrix[4] - matrix[3] * matrix[1]) / det,
        ];
    }
    private _data: number[];
    private _inv: number[];
    constructor(data?: number[]) {
        if (data) {
            if (data.length !== 9) throw Error("Матрица должна иметь 9 элементов");
            this._data = data;
            this._inv = MatrixComponent.getInversedMatrix(data);
        } else {
            this._data = this._inv = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        }
    }

    data(): readonly number[] {
        return this._data;
    }
    inv(): readonly number[] {
        return this._inv;
    }
}