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
      seeCurrentCoupons = 'seeCurrentCoupons';


////// Component //////
export default props => {
  const {getPluginUrl} = props;
  
  ////// State //////
  const [adminView, setAdminView] = useState('addNewCoupon');
  
  useEffect(() => {
    console.log(adminView, `=====adminView=====`);
  });
  
  return (
    <React.Fragment>
      <AppBar position="static">
        {/*<Tabs*/}
        {/*  value={adminView}*/}
        {/*  centered*/}
        {/*>*/}
          <StyledMaterialLink component={RouterLink} to={`&section=add-coupon`}>
            <Tab
              label="Add New Coupon"
              value={addNewCoupon}
              onClick={() => {
                console.log(location.href, `=====location.href=====`);
                setAdminView(addNewCoupon)
              }}
            />
          </StyledMaterialLink>
          <StyledMaterialLink
            component={RouterLink}
            to={`/wptest2/wp-admin/options-general.php?`}>
            <Tab
              label="See Current Coupons"
              value={seeCurrentCoupons}
              onClick={() => {
                console.log(location.href, `=====location.href=====`);
                setAdminView(seeCurrentCoupons)
              }}
            />
        </StyledMaterialLink>
        {/*</Tabs>*/}
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

const StyledMaterialLink = styled(MaterialLink)`
  text-decoration: inherit;
  color: inherit;
`;















