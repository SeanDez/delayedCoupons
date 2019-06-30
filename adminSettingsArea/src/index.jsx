import React, {useReducer} from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
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
            <ViewCoupons />
          )}
        />
  
        {/* todo direct navigation to /add-coupon doesn't work */}
        <Route
          path={'(/|/add-coupon)'} exact
          render={props => (
            <AddCouponForm />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};



//////  //////
ReactDOM.render(
  <AdminArea/>,
  document.getElementById('adminRoot')
  );

