import React, {useReducer} from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {initialState, reducer} from './reducer';

import TabSection from "./TabSection.jsx";
import AddCouponForm from "./AddCouponForm.jsx";
import ViewCoupons from "./ViewCoupons.jsx";

import axios from "axios";




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


////// Context Providers //////
export const TestTunnel = React.createContext();

export const CurrentCouponChannel = React.createContext();



////// Pure Functions //////

// this returns a promise that resolves to json
const loadCouponData = () => {
  let ajaxUrl = '';
  
  // if in the browser environment
  if (window &&
      window.ajaxUrl
  ) {
    ajaxUrl === window.ajaxUrl;
  }
  
  
  try {
    const response = ajaxRequestor.post()
  }
  catch (e) {
    console.log(e, `=====error=====`);
  }
  
  return axios
    .post(ajaxUrl, {
    action : 'getCurrentCoupons'
  })
    // take the data property. convert it to json and return it as a promise
    .then(res => res.data.json())
};




////// Script Injection //////
ReactDOM.render(
  <AdminArea/>,
  document.getElementById('adminRoot')
  );

