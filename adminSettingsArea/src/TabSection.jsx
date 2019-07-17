import React, {useState, useEffect} from "react";
import styled from "styled-components";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Link as RouterLink} from "react-router-dom";
import MaterialLink from "@material-ui/core/Link";



////// View Constants //////
const addNewCoupon = 'addNewCoupon',
      viewCurrentCoupons = 'viewCurrentCoupons';


////// Component //////
export default props => {
  const {adminView, setAdminView} = props;
  
  return (
    <React.Fragment>
      <AppBar position="static">
        <Tabs
          value={adminView}
          centered
        >
          <Tab
            label="Add New Coupon"
            value={addNewCoupon}
            onClick={() => setAdminView(addNewCoupon)}
          />

          <Tab
            label="View Current Coupons"
            value={viewCurrentCoupons}
            onClick={() => setAdminView(viewCurrentCoupons)
            }
          />
        </Tabs>
    </AppBar>
    </React.Fragment>
  )
};


////// Styling //////

const jssClasses = makeStyles(theme => ({
  appBar : {
    flexGrow : 1,
    backgroundColor : theme.palette.background.paper
  }
}));


////// Styled Components //////
const StyledRouterLink = styled(RouterLink)`
  text-decoration: inherit;
  color: inherit;
`;

const StyledAnchor = styled('a')`
  text-decoration: inherit;
  color: inherit;
`;















