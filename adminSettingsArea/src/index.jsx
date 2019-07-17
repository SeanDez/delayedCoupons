require("./globals");
import React, {useReducer, useState} from "react";
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

let clientNonce;
if (typeof _wpnonce === 'undefined') {
  clientNonce = 10;
} else {
  clientNonce = _wpnonce;
}

// console.log(cookiesArray, `=====cookiesArray=====`);


const AdminArea = props => {
  const {match} = props;
  
  /** Controls the body section of the admin area 
   */
  const [adminView, setAdminView] = useState('addNewCoupon');
  
  
  
  const [state, dispatch] = useReducer(reducer, initialState);
  

  
  return (
    <React.Fragment>
      <TabSection
        adminView={adminView}
        setAdminView={setAdminView}
      />
  
      <ViewCoupons />
      
      <AddCouponForm
        clientNonce={clientNonce}
      />
    </React.Fragment>
  );
};




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

