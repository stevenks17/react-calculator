export interface Action {
  type: string

  payload?: {
    digit: string | number;
    operation?: string;
  };
}

export type State = {
  currentOperand: string ;
  previousOperand: string;
  operation: string;
};