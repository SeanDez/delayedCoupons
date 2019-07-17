require("./globals");
import React, {useReducer} from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {initialState, reducer} from './reducer';

import TabSection from "./TabSection.jsx";
import AddCouponForm from "./AddCouponForm.jsx";
import ViewCoupons from "./ViewCoupons.jsx";

import axios from "axios";


// todo fix routing problem (wordpress install/subfolder not included)


/** Handle PHP variable passage from back end (initial pageload)
 */


// if (!_wpnonce) {
//   throw new Error('_wpnonce not found: ', _wpnonce);
// }

// console.log(cookiesArray, `=====cookiesArray=====`);


const AdminArea = props => {
  const {match} = props;
  
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const getPluginUrl = () => {
      return 'options-general.php?page=delayed-coupons';
    
    // todo add fallbacks
  };
  
  return (
    <BrowserRouter>
      <TabSection
        getPluginUrl={getPluginUrl}
      />
  
      <p>Count: {state.count}</p>
      <button onClick={() => {
        dispatch({type : "increment"})
      }}>
        Raise Count
      </button>
      
      <Switch>
        <Route
          path={`/wptest2/wp-admin/options-general.php`}
          render={props => {
            {console.log(props.match, `=====props.match=====`)}
            
            return (
              <CurrentCouponChannel.Provider
                value={state.currentCouponsAndTargets}>
                <ViewCoupons />
              </CurrentCouponChannel.Provider>
            )
          }}
        />
        
        <Route
          path={`&section=add-coupon`}
          render={props => {
            {console.log(props.match, `=====props.match=====`)}
  
            return (
              <TestTunnel.Provider value={state}>
                <AddCouponForm
                  _wpnonce={_wpnonce}
                />
              </TestTunnel.Provider>
            )
          }}
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

