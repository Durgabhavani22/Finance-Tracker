import React, { createContext, useReducer } from "react";

const initialState = {
  transactions: [],
};

export const TransactionContext = createContext(initialState);

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    default:
      return state;
  }
}

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  function addTransaction(transaction) {
    dispatch({
      type: "ADD_TRANSACTION",
      payload: transaction,
    });
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        addTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
