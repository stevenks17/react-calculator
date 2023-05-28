export type Operation = "+" | "-" | "*" | "÷" | undefined;

export interface Action {
  type: string;
  payload?: {
    digit?: string;
    operation?: Operation;
  };
}

export type State = {
  overwrite: boolean;
  currentOperand: string | undefined;
  previousOperand: string | undefined;
  operation: Operation | undefined;
};
