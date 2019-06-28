import React, {useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


////// Styling //////
const jssClasses = makeStyles(theme => ({
  appBar : {
    flexGrow : 1,
    backgroundColor : theme.palette.background.paper
  }
}));

////// Menu Options //////
const views = Object.freeze({
  addNewCoupon : 'addNewCoupon',
  seeCurrentCoupons : 'seeCurrentCoupons'
});


////// Component //////
export default props => {
  const [adminView, setAdminView] = useState('addNewCoupon');
  
  
  
  return (
    <React.Fragment>
      <AppBar position="static">
        <Tabs value={adminView} centered>
          <Tab
            label="Add New Coupon"
            value={views.addNewCoupon}
            onClick={() => setAdminView(views.addNewCoupon)}
          />
          <Tab
            label="See Current Coupons"
            value={views.seeCurrentCoupons}
            onClick={() => setAdminView(views.seeCurrentCoupons)}
          />
        </Tabs>
      </AppBar>
    </React.Fragment>
  )
};