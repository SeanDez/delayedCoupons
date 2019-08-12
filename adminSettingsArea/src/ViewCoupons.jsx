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



// setup the request handler
const ajaxRequestor = new AjaxRequestor();

// sets up the apiBaseUrl
// todo revert to the error when out of testing
// let apiBaseUrlSet = new Error("Custom Message: Wordpress did not set the api base url");
let apiBaseUrlSet = 'http://localhost/wptest2/index.php/wp-json/';
if (window && window.apiBaseUrl) {
  apiBaseUrlSet = apiBaseUrl;
}


////// Component //////
export default props => {
  
  const styles = useStyles();
  
  /**
   * loads couponData initially and onChange
   *
   * Automatically updates after a delete request, which also modifies the array bound to couponData
   */

  const [couponData, setCouponData] = useState([]);
  
  // return a promise which if resolves, responds with the data array
  const fetchAllCoupons = async () => {
    try {
      const response = await fetch('http://localhost/wptest2/?rest_route=/delayedCoupons/1.0/loadAll');
      let data = await response.json();
      return data;
    }
    catch (e) {
      // console.log(e, `=====error=====`);
      throw e;
    }
  };
  
  useEffect( () => {
    fetchAllCoupons()
      .then(data => setCouponData(data))
      .catch(e => console.log(e, '====error===='));
  }, []);
  
  
  const [tableMarker, setTableMarker] = useState(0);
  
  useEffect(() => {
    console.log(couponData, `=====couponData=====`);
    console.log(tableMarker, `=====tableMarker=====`);
  });
  
  
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
  const deleteCouponTableRow = async couponId => {
    const appendedUrl = `${apiBaseUrlSet}delayedCoupons/1.0/delete/${couponId}`;
    
    try {
      const jsonResponse = await ajaxRequestor.post(appendedUrl);
      console.log(jsonResponse, `=====jsonResponse=====`);
      return jsonResponse;
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
  
    console.log(`====View Coupons has loaded======`);
  
    console.log(filteredData, `=====filteredData=====`);
    
    // return a new array of JSX table rows
    return filteredData.map(record => (
      <TableRow key={record.couponId}>
        <TableCell align='center'>{record.couponId}</TableCell>
        <TableCell align='center'>{record.titleText}</TableCell>
        <TableCell align='center'>{record.descriptionText}</TableCell>
        <TableCell align='center'>{record.targetUrl}</TableCell>
        <TableCell align='center'>{record.totalVisits || 0}</TableCell>
        <TableCell align='center'>{record.displayThreshold}</TableCell>
        <TableCell align='center'>{record.offerCutoff}</TableCell>
        <TableCell align='center'>
          <FaTrashAlt
            onClick={e => {
              deleteCouponTableRow(record.couponId);
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
      // {...props}
    >
      <h3>View Coupons</h3>
      <p>On this page you will find all the coupons you have setup and the pages they target. To delete a coupon click
         the delete icon to remove it.</p>
      
      { checkIfCouponDataExists(couponData) ?
        <React.Fragment>
          <StyledTable className={ styles.table }>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Coupon Id</TableCell>
                <TableCell align='center'>Title Text</TableCell>
                <TableCell align='center'>Description Text</TableCell>
                <TableCell align='center'>Target Page</TableCell>
                <TableCell align='center'>Total Hits</TableCell>
                <TableCell align='center'>Delay</TableCell>
                <TableCell align='center'># of Offers</TableCell>
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
        
        // no couponData
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
 * @return function. Resulting function useStyles is executed and returns an object that allows access to the styles
 *   below by their key. Styles are assigned in className
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











