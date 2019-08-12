require("./globals");
import React, {useReducer, useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {initialState, reducer} from './reducer';
import styled from 'styled-components';

import Fade from "@material-ui/core/Fade";

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


const AdminArea = props => {
  const {match} = props;
  
  /** Controls the body section of the admin area 
   */
  const bodyViews = Object.freeze({
    addNewCoupon : 'addNewCoupon',
    viewCurrentCoupons : 'viewCurrentCoupons'
  });
  
  const [adminView, setAdminView] = useState('addNewCoupon');
  
  const [state, dispatch] = useReducer(reducer, initialState);
  
  
  
  return (
    <React.Fragment>
      
      {/* ////// HEADER ////// */ }
      <TabSection
        adminView={ adminView }
        setAdminView={ setAdminView }
      />
      
      
      {/* ////// BODY ////// */ }
      
      {/* todo refactor this so the fade is styled, and AddCouponForm can pass its prop without issues */}
      <Fade
        in={ Boolean(adminView === bodyViews.addNewCoupon) }
        timeout={ 1000 }
        mountOnEnter unmountOnExit
      >
        <ConditionalDiv
          displayBool={Boolean(adminView === bodyViews.addNewCoupon)}
        >
          <AddCouponForm
            clientNonce={ clientNonce }
          />
        </ConditionalDiv>
      </Fade>
      
      <Fade
        in={ Boolean(adminView === bodyViews.viewCurrentCoupons) }
        timeout={ 1000 }
        mountOnEnter unmountOnExit
      >
        <ConditionalDiv
          displayBool={Boolean(adminView === bodyViews.viewCurrentCoupons)}
        >
          <ViewCoupons />
        </ConditionalDiv>
      </Fade>
      
      
      
      {/* ////// FOOTER ////// */ }
    
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


/** ConditionalDiv
 *
 * Goal: to move hidden body components out of the way so the active one dominates the screen area
 *
 * If its value is true, display block
 * If its value is false, display none
 */
const ConditionalDiv = styled.div`
  display : ${props => props.displayBool ? 'block' : 'none'}
`;

const ConditionalFade = styled(Fade)`
  display : ${props => props.in ? 'block' : 'none'}
`;



////// Script Injection //////
ReactDOM.render(
  <AdminArea/>,
  document.getElementById('adminRoot')
  );
























