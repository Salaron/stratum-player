declare module "vm-types" {
    import { GraphicSystemController } from "vm-interfaces-graphics";
    import { ClassState, InputSystemController, ProjectController, MemoryState } from "vm-interfaces-core";

    export interface FunctionOperand {
        funcName: string;
        argCount: number;
        argTypes: number[];
        returnType: number;
    }

    export type Operand = number | string | FunctionOperand;
    export type OperandType =
        | "double"
        | "long"
        | "string"
        | "codepoint"
        | "varId"
        | "word"
        | "functionData"
        | "dllFunctionData";

    export type Operation = (ctx: VmStateContainer, operand?: Operand) => void;

    export interface ParsedCode {
        /**
         * Масссив опкодов, совмещенных с операндами.
         * Опкод извлекается так:`code[index] & 2047`
         */
        code: Uint16Array;
        //в оригинале там 8-байтные double, но этот тип может оказаться быстрее.
        numberOperands: Float32Array;
        // doubleOperands: Float64Array;
        // longOperands: Int32Array;
        stringOperands: string[];
        otherOperands: (Operand | undefined)[];
    }

    export interface VirtualMachine {
        substituteState(newState: ClassState): number;
        returnState(prevState: ClassState, commandIndex: number): void;
        // nextCommandIndex(): number;
        nextCmdIndex: number;
        setCodeLength(length: number): void;
    }

    export interface VmStateContainer {
        readonly currentClass: ClassState;
        readonly memoryState: MemoryState;
        readonly canExecuteClass: boolean;
        readonly graphics: GraphicSystemController;
        // readonly input: InputSystemController;
        readonly project: ProjectController;

        pushDouble(value: number): void;
        popDouble(): number;

        pushLong(value: number): void;
        popLong(): number;

        pushString(value: string): void;
        popString(): string;

        jumpTo(index: number): void;
        setError(message: string): void;
        requestStop(): void;
    }
}
