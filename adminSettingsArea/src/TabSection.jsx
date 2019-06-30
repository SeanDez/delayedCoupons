import React, {useState} from "react";
import styled from "styled-components";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Link as RouterLink} from "react-router-dom";
import MaterialLink from "@material-ui/core/Link";

////// Styling //////
const jssClasses = makeStyles(theme => ({
  appBar : {
    flexGrow : 1,
    backgroundColor : theme.palette.background.paper
  }
}));

////// View Constants //////
const addNewCoupon = 'addNewCoupon',
      seeCurrentCoupons = 'seeCurrentCoupons';


////// Component //////
export default () => {
  const [adminView, setAdminView] = useState('addNewCoupon');
  
  return (
    <React.Fragment>
      <AppBar position="static">
        {/*<Tabs*/}
        {/*  value={adminView}*/}
        {/*  centered*/}
        {/*>*/}
          <StyledMaterialLink component={RouterLink} to='/add-coupon'>
            <Tab
              label="Add New Coupon"
              value={addNewCoupon}
              onClick={() => setAdminView(addNewCoupon)}
            />
          </StyledMaterialLink>
          <StyledMaterialLink
            component={RouterLink}
            to='/view-coupons'>
            <Tab
              label="See Current Coupons"
              value={seeCurrentCoupons}
              onClick={() => setAdminView(seeCurrentCoupons)}
            />
        </StyledMaterialLink>
        {/*</Tabs>*/}
    </AppBar>
    </React.Fragment>
  )
};


////// STYLED COMPONENTS //////
const StyledRouterLink = styled(RouterLink)`
  text-decoration: inherit;
  color: inherit;
`;

const StyledMaterialLink = styled(MaterialLink)`
  text-decoration: inherit;
  color: inherit;
`;















