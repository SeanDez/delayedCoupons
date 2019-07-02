import {useReducer} from "react";
import dummyCouponData from "./dummyCouponData";



export const initialState = {
  count: 0, 
  k1 : 'v1',
  currentCouponsAndTargets : dummyCouponData
};

export const reducer = (previousState, action) => {
  switch (action.type) {
    case 'increment':
      // note no spread of previousState as in redux
      return {count: previousState.count + 1};
    default:
      throw new Error();
  }
};



