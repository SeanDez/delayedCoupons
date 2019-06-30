import {useReducer} from "react";

export const initialState = {count: 0};

export const reducer = (previousState, action) => {
  switch (action.type) {
    case 'increment':
      // note no spread of previousState as in redux
      return {count: previousState.count + 1};
    default:
      throw new Error();
  }
};

