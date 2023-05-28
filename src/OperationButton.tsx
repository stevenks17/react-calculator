import { Dispatch } from "react";
import { ACTIONS } from "./Actions";
import { Action } from "./CalculatorTypes";
interface OperationButtonProps {
  dispatch: Dispatch<Action>;
  operation: string;
}
export default function OperationButton({ dispatch, operation }): OperationButtonProps {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATOR, payload: { operation } })
      }
    >
      {operation}
    </button>
  )
}
