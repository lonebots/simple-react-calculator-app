import React from "react";
import { useReducer } from "react";
import DigitButton from "./Components/DigitButton";
import OperationButton from "./Components/OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    //case 1 - add digit
    case ACTIONS.ADD_DIGIT:
      //check for overwrite condition
      if (state.overwrite) {
        //set currentOperand = entered digit
        //set overwrite to 'false'
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    //case2 - clear
    case ACTIONS.CLEAR:
      return {};

    //case3 - choose operation
    case ACTIONS.CHOOSE_OPERATION:
      //if nothing is entered - begining
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      //if current operand it null
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      //  previous operand is null
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      //setting the continuation of operaion 2+2+2 => 4+2
      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null,
      };

    //case4 - evaluate
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      //if we have every variables available in the state then
      return {
        ...state,
        //adding a new value called overwrite for handling overwriting after evaluation
        overwrite: true,

        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null,
      };

    //case5 - delete-digit
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) {
        return state;
      }

      //only one digit in current operand
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  //convert string to numbers
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  //check if any of them is NaN then return empty string
  if (isNaN(prev) || isNaN(current)) return "";

  //define variable for storing computation
  let computation = "";

  //switching through operation
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
    case "/":
      computation = prev / current;
      break;
    default:
  }
  //return computation
  return computation.toString();
}

//adding a digit formater
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

//function to format operand
function formatOperand(operand){
  //check if operand is null then do nothing
  if (operand == null) return

  //else split the integer and fraction part 
  const [integer,decimal] = operand.split(".");

  //if decimal is null then format only the integer part
  if (decimal == null) return INTEGER_FORMATTER.format(integer)

  //default if decimal is present
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
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
        onClick={() => {
          dispatch({ type: ACTIONS.CLEAR });
        }}
      >
        AC
      </button>
      <button
        onClick={() => {
          dispatch({ type: ACTIONS.DELETE_DIGIT });
        }}
      >
        DEL
      </button>
      <OperationButton operation="/" dispatch={dispatch} />
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
        onClick={() => {
          dispatch({ type: ACTIONS.EVALUATE });
        }}
      >
        =
      </button>
    </div>
  );
}

export default App;
