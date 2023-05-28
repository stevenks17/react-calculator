import { useReducer } from "react";
import { ACTIONS } from "./Actions";
import DigitButton from "./DigitButton";
import { State, Action } from "./CalculatorTypes";
import "./App.css";
import OperationButton from "./OperationButton";

function reducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload?.digit,
          overwrite: false,
        };
      }
      if (payload?.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (typeof state.currentOperand === 'string' && state.currentOperand?.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload?.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATOR:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload?.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload?.operation,
          previousOperand: state.currentOperand,
          currentOperand: undefined,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload?.operation,
        currentOperand: undefined,
      }; 
    case ACTIONS.CLEAR:
      return {
        currentOperand: undefined,
        previousOperand: undefined,
        operation: undefined,
        overwrite: false,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: undefined,
        };
      }
      if (state.currentOperand == null) return state;
      if (typeof state.currentOperand === 'string' && state.currentOperand?.length === 1) {
        return { ...state, currentOperand: undefined };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CALCULATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: undefined,
        operation: undefined,
        currentOperand: evaluate(state),
      };
    default:
      return state;
  }
}
interface EvaluateProps {
  currentOperand: string | number | null | undefined;
  previousOperand: string | number | null | undefined;
  operation: string | null | undefined;
}

function evaluate({ currentOperand, previousOperand, operation }:EvaluateProps): string | undefined {
  const prev = parseFloat(previousOperand?.toString() || "");
  const current = parseFloat(currentOperand?.toString() || "");
  if (isNaN(prev) || isNaN(current)) return undefined;
  let computation = undefined;
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }

  return computation?.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand: string | number | null | undefined) {
  if (operand == null) return;
  const [integer, decimal] = operand.toString().split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(+integer);
  return `${INTEGER_FORMATTER.format(+integer)}.${decimal}`;
}

const initialState: State = {
  currentOperand: undefined,
  previousOperand: undefined,
  operation: undefined,
  overwrite: false,
};

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CALCULATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;

