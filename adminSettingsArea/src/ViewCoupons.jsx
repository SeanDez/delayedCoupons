import React from "react";

import {makeStyles} from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';




export default props => {
  
  ////// Side Effects //////

  // (Re)Render table rows based on state.currentCouponsAndTargets
  
  
  return (
    <React.Fragment>
      <h3>View Coupons</h3>
      <p>On this page you will find all the coupons you have setup and the pages they target. To delete a coupon click
         the delete icon to remove it.</p>
      
      { true === true ?
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Target Page</TableCell>
              <TableCell>Delay</TableCell>
              <TableCell># of Offers</TableCell>
              <TableCell>Total times coupon seen</TableCell>
              <TableCell>Delete?</TableCell>
            </TableRow>
          </TableHead>
          <tbody>
        
          </tbody>
        </Table>
                      :
        <p>No Coupons to Show</p>
      }
    </React.Fragment>
  );
}

////// Jss Styles //////

const useStyles = makeStyles(theme => ({
  table : {
  
  },
  
}));
















