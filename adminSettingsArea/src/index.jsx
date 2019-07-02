import React, {useReducer} from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {initialState, reducer} from './reducer';

import TabSection from "./TabSection.jsx";
import AddCouponForm from "./AddCouponForm.jsx";
import ViewCoupons from "./ViewCoupons.jsx";





const AdminArea = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <BrowserRouter>
      <TabSection />
  
      <p>Count: {state.count}</p>
      <button onClick={() => {
        dispatch({type : "increment"})
      }}>
        Raise Count
      </button>
      
      <Switch>
        <Route
          path='/view-coupons'
          render={props => (
            <CurrentCouponChannel.Provider
              value={state.currentCouponsAndTargets}>
              <ViewCoupons />
            </CurrentCouponChannel.Provider>
          )}
        />
        
        <Route
          path={'(/|/add-coupon)'} exact
          render={props => (
            <TestTunnel.Provider value={state}>
              <AddCouponForm />
            </TestTunnel.Provider>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};


////// CONTEXT PROVIDERS //////
export const TestTunnel = React.createContext();

export const CurrentCouponChannel = React.createContext();



////// SCRIPT INJECTION //////
ReactDOM.render(
  <AdminArea/>,
  document.getElementById('adminRoot')
  );

