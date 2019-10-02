import {localDefaults} from "./globals";
import './theme.css'

import React, {useReducer, useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {initialState, reducer} from './reducer';
import styled from 'styled-components';

import {makeStyles} from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import Grow from "@material-ui/core/Grow";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import TabSection from "./TabSection.jsx";
import AddCouponForm from "./AddCouponForm.jsx";
import ViewCoupons from "./ViewCoupons.jsx";

import Authentication from "./utilities/Authentication";
import toPropertyKey from "@babel/runtime/helpers/esm/toPropertyKey";


const useStyles = makeStyles(theme => ({
  snackbar : {
    border : '2px dashed yellow',
    display : 'flex',
    justifyContent : 'space-around'
  },
  snackbarText : {
    padding : theme.spacing(0.1),
    margin: '0 auto !important',
    border: '2px dashed purple'
  }
}));

// create and export a context
export const StatePassingContext = React.createContext(true);


// todo fix routing problem (wordpress install/subfolder not included)


/** Handle PHP variable passage from back end (initial pageload)
 *
 * If none detected, such as in development, these are set based on globals.js
 */
if ('serverParams' in window) {
  clientNonce = serverParams._wpnonce;
  apiBaseUrl = serverParams.apiBaseUrlFromWp;
  namepaceAndVersion = serverParams.namepaceAndVersion;
}



////// TOP LEVEL COMPONENT //////
const AdminArea = props => {
  const {match} = props;
  const styles = useStyles();
  
  // todo move this somewhere else
  const [snackbarMessage, setSnackbarMessage] = useState(false);
  
  
  /** Setup JWT Auth IF credentials found and dev env is in dev
   */
  
  if (window) {
    window.wpUser = process.env.REACT_APP_WP_USER;
    window.wpPassword = process.env.REACT_APP_WP_PASSWORD;
  }
  
  useEffect(() => {
    const authenticate = async () =>  {
      if ( process.env.NODE_ENV === 'development' &&
           process.env.REACT_APP_WP_USER &&
           process.env.REACT_APP_WP_PASSWORD
      ) {
        const authentication = new Authentication();
        const token = await authentication.retrieveOrCreateValidJwt({
          username : process.env.REACT_APP_WP_USER
          , password : process.env.REACT_APP_WP_PASSWORD
        });
    
        console.log(token, `=====token=====`);
      }
    };
    
    authenticate()
      .then(data => console.log(data, `=====final authenticate() call=====`));
  });
  
  
  /** Controls the body section of the admin area 
   */
  const bodyViews = Object.freeze({
    addNewCoupon : 'addNewCoupon',
    viewCurrentCoupons : 'viewCurrentCoupons'
  });
  
  const [adminView, setAdminView] = useState('addNewCoupon');
  
  const [state, dispatch] = useReducer(reducer, initialState);
  
  
  
  ////// Application Width and Placement Adjustments //////

  const [appWidth, setAppWidth] = useState(window.innerWidth);
  
  const handleSetAppWidth = resizeEvent => {
    setAppWidth(window.innerWidth);
  };
  
  useEffect(() => {
    window.addEventListener('resize', handleSetAppWidth);
    
    return () => {
      // do this on unmount
      window.removeEventListener('resize', handleSetAppWidth)
    };
  }, []);
  
  
  return (
    <AppContainer>
      <StatePassingContext.Provider value={{setSnackbarMessage}}>
      
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
            apiBaseUrl={apiBaseUrl}
            namepaceAndVersion={namepaceAndVersion}
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
          <ViewCoupons
            clientNonce={ clientNonce }
            apiBaseUrl={apiBaseUrl}
            namepaceAndVersion={namepaceAndVersion}
          />
        </ConditionalDiv>
      </Fade>
      
      
    {/* ////// FOOTER ////// */ }
    
      
    {/* FLOATS / HIDDEN / SPECIAL */}
    
    <Snackbar
      open={Boolean(snackbarMessage)}
      autoHideDuration={8000}
      onClose={() => setSnackbarMessage('')}
      anchorOrigin={{ vertical : 'bottom', horizontal : 'center' }}
      message={<p className={styles.snackbarText}>{snackbarMessage}</p>}
      TransitionComponent={Grow}
      className={styles.snackbar}
    />
    
      </StatePassingContext.Provider>
    </AppContainer>
  );
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

const AppContainer = styled.div`
  margin-left: 170px;
  border: 2px dashed yellow;
  
  @media (max-width: 784px) {
  margin-left: 10px;
  }
`;


////// Script Injection //////
ReactDOM.render(
  <AdminArea/>,
  document.getElementById('adminRoot')
  );
























