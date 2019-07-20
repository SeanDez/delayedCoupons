import React, {useState, useContext, useEffect} from "react";
import {CurrentCouponChannel} from "./index.jsx";
import AjaxRequestor from './utilities/AjaxRequestor';
import dummyCouponData from "./dummyCouponData";

import {makeStyles} from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import styled from "styled-components";
import {FaChevronCircleLeft, FaChevronCircleRight, FaTrashAlt} from 'react-icons/fa';


// workaround to fill ajaxUrl
let ajaxUrl = 'hardcoded value';
if (window && window.ajaxUrl) {
  ajaxUrl = window.ajaxUrl;
}

// setup the request handler
const ajaxRequestor = new AjaxRequestor(ajaxUrl);




export default props => {
  const styles = useStyles();

  // const couponData = useContext(CurrentCouponChannel); // decided not to run data through the parent.
  
  /**
   * loads couponData initially and onChange
   *
   * Automatically updates after a delete request, which also modifies the array bound to couponData
   */

  const [couponData, setCouponData] = useState();
  
  useEffect( () => {
    try {
      (async () => {
        const response = await ajaxRequestor.post({
          action : 'loadCouponData'
        }, ajaxUrl, dummyCouponData);

        setCouponData(response.data);
      })();
    }
    catch (e) {
      console.log(e, `=====error=====`);
    }
  }, [couponData]);
  
  
  const [tableMarker, setTableMarker] = useState(0);
  
  
  
  
  /**
   * decides whether to render table or "no data" msg
   *
   * @return boolean (bound to a test in render)
   *
   **/
  
  const checkIfCouponDataExists = data => {
    if (data && data.length) {
      return true;
    }
    
    return false
  };
  
  

  
  /**
   * Deletes a single table row
   * takes in a couponId. Gives it to a handler on the back end to run a delete query
   *
   * Also modifies a state key being watched by a useEffect, which will then update automatically on change
   *
   */
  
  const deleteCouponTableRow = couponId => {
    // todo create a handler for this delete request on the server
    
    try {
      const response = ajaxRequestor.post({
        action : 'deleteCurrentCoupon',
        payload : { couponId }
      }, ajaxUrl);
      
      return response.data;
    }
    catch (e) {
      console.log(e, `=====error=====`);
    }
  };
  
  
  /**
   *  renders body cell data
   *
   *  @param data array. Holds coupon, target, and view data
   *
   *  @param marker int. decides what list item to start/end rendering
   *
   *  @return array of JSX values (table elements) to be created by Javascript
   *
   */
  
  const renderTableBody = (data, marker) => {
    const filteredData = data.filter((arrayItem, index) => (
      index >= marker &&
      index <= (marker + 9)
    ));
    
    // return a new array of JSX table rows
    return filteredData.map(record => (
      <TableRow key={record.couponId}>
        <TableCell align='center'>{record.pageTarget}</TableCell>
        <TableCell align='center'>{record.displayThreshold}</TableCell>
        <TableCell align='center'>{record.numberOfOffers}</TableCell>
        <TableCell align='center'>{Math.round(Math.random() * 100)}</TableCell>
        <TableCell align='center'>
          <FaTrashAlt
            onClick={() => {
              // todo use record.couponId to send a delete request
            }}
          />
        </TableCell>
      </TableRow>
    ))
  };
  
  
  /** calculate table position
   *
   * prevents the table marker from going too high or low
   *
   * @param currentPosition int.
   * @param direction int. Examples: 10, -10
   * @param upperLimit int. Gives the .length of the data array in state
   *
   * @return void. State is updated. Next, useEffect calls dependent on same state key will auto-update
   */
  const adjustTableMarker = (currentPosition, direction, upperLimit) => {
    if ( // below 0, reset to 0
      currentPosition + direction <= 0) {
      setTableMarker(0);
    } else if (currentPosition + direction >= upperLimit) { // goes over limit, no adding
      setTableMarker(currentPosition);
    } else { // else let it run
      setTableMarker(currentPosition + direction);
    }
  };
  

  
  /**
   * Renders either a data table of current coupons, or a "no coupons" message
   */
  
  return (
    <div
      {...props}
    >
      <h3>View Coupons</h3>
      <p>On this page you will find all the coupons you have setup and the pages they target. To delete a coupon click
         the delete icon to remove it.</p>
      
      { checkIfCouponDataExists(couponData) ?
        <React.Fragment>
          <StyledTable className={ styles.table }>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Target Page</TableCell>
                <TableCell align='center'>Delay</TableCell>
                <TableCell align='center'># of Offers</TableCell>
                <TableCell align='center'>Total times coupon seen</TableCell>
                <TableCell align='center'>Delete?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { renderTableBody(couponData, tableMarker) }
            </TableBody>
          </StyledTable>
        
          {/* Prev / Next Buttons*/}
          <PrevNextContainer>
            <FaChevronCircleLeft
              className={styles.bigIcon}
              onClick={() => {
                adjustTableMarker(tableMarker, -10, couponData.length)
              }}
            />
            <FaChevronCircleRight
              className={styles.bigIcon}
              onClick={() => {
                adjustTableMarker(tableMarker, 10, couponData.length)
              }}
            />
          </PrevNextContainer>
        </React.Fragment>
                                            :
        <p>No Coupons to Show</p>
      }
    </div>
  );
}



/** a JSS preprocessor that takes styles as a large object argument,
 *
 * @type {StylesHook<Styles<Theme, {}, string>>}
 *
 * @return function. Resulting function useStyles is executed and returns an object that allows access to the styles below by their key. Styles are assigned in className
 */

const useStyles = makeStyles(theme => ({
  table : {
    border : '2px dashed red',
  },
  bigIcon : {
    width : '30px',
    height : 'auto',
    color : 'blue',
    border : '2px dashed green'
  }
}));


////// Styled Components //////

const StyledTable = styled(Table)`
   max-width : 400px !important;
   width : 400px !important;
`;

const PrevNextContainer = styled('div')`
  margin-top : 20px;
  display: flex;
  flex-flow: row nowrap;
  width: 80px;
  justify-content: space-around;
  border: 2px dashed pink;
`;











