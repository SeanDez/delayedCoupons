import React, {useState, useContext, useEffect} from "react";
import _ from 'lodash';
import {StatePassingContext} from "./index.jsx";
import AjaxRequestor from './utilities/AjaxRequestor';
import dummyCouponData from "./dummyCouponData";

import {makeStyles} from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';

import styled from "styled-components";
import {FaChevronCircleLeft, FaChevronCircleRight, FaTrashAlt} from 'react-icons/fa';



// setup the request handler
const ajaxRequestor = new AjaxRequestor();



////// Component //////
export default props => {
  const {apiBaseUrl, clientNonce} = props;
  const {setSnackbarMessage} = useContext(StatePassingContext);
  
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
      const response = await fetch(`${apiBaseUrl}/${namepaceAndVersion}/loadAll`, {
        method : 'get'
        , headers : {
          'X-WP-Nonce' : clientNonce
        }
      });
      let data = await response.json();
      
      if (data && 'error' in data) {
        setSnackbarMessage(data.error)
      }
      
      return data;
    }
    catch (e) {
      // console.log(e, `=====error=====`);
      throw e;
    }
  };
  
  /** ON INITIAL LOAD
   */
  useEffect( () => {
    fetchAllCoupons()
      .then(data => {
        // setting an object as a dep. in the 2nd argument of the useEffect fails as new objects always have new reference values. Therefore _.isEqual is used instead
          if (_.isEqual(data.rows, couponData) === false) {
            setCouponData(data.rows)
          }
      })
      .catch(e => console.log(e, '====error===='));
  });
  
  
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
  const deleteCouponTableRow = async couponId => {
    const appendedUrl = `${apiBaseUrl}/${namepaceAndVersion}/delete/${couponId}`;
    
    try {
      const jsonResponse = await ajaxRequestor.post(appendedUrl, {clientNonce});
      
      if (jsonResponse && 'error' in jsonResponse) {
        return setSnackbarMessage(jsonResponse.error)
      }
      
      return jsonResponse; // next method will handle the keys
    }
    catch (e) {
      console.log(e, `=====error=====`);
    }
  };
  
  
  /** Handles coupon deletion, updating of table or error box
   * @param couponId number. The id of the row to be deleted
   * @return void
   */
  const deleteCouponRefetchPostSnackbarMessage = async couponId => {
    const result = await deleteCouponTableRow(couponId);
    // on success a string of the id is returned
    
    if (result && 'deletedCouponId' in result) {
      setSnackbarMessage(`SUCCESS: Coupon ID ${result.deletedCouponId} has been deleted`);
      // fetch is 2nd to let message show right away;
      
      try {
        const newData = await fetchAllCoupons();
        setCouponData(newData);
      }
      catch (e) {
        console.error(e, `=====error=====`);
      }
    } else if (result && 'error' in result) {
      setSnackbarMessage(result.error)
    } else {
      setSnackbarMessage('Internal error [else block], please contact the plugin developer');
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
        <TableCell align='center'>{record.couponId}</TableCell>
        <Tooltip
          title={record.titleText}
          placement={'top'}
        >
          <TableCell align='center'>{record.titleText}</TableCell>
        </Tooltip>
        <Tooltip
          title={record.descriptionText}
          placement={'top'}
        >
          <TableCell align='center'>{record.descriptionText}</TableCell>
        </Tooltip>
        <Tooltip
          title={record.targetUrl}
          placement={'top'}
        >
          <TableCell>{record.targetUrl}</TableCell>
        </Tooltip>
        <TableCell align='center'>{record.totalVisits || 0}</TableCell>
        <TableCell align='center'>{record.displayThreshold}</TableCell>
        <TableCell align='center'>{record.offerCutoff}</TableCell>
        <TableCell align='center'>
          <FaTrashAlt
            onClick={() => {
              deleteCouponRefetchPostSnackbarMessage(record.couponId)
            }}
            style={{cursor : 'pointer'}}
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
  

  
  /** RENDER
   * Renders either a data table of current coupons, or a "no coupons" message
   */
  return (
    <div
      // {...props}
    >
      <Typography
        variant={'h6'}
        className={styles.spacing}
      >
        View Coupons
      </Typography>
      <Typography
        variant={'subtitle2'}
        className={styles.spacing}
      >
        On this page you will find all the coupons you have setup and the pages they target. To delete a coupon click the delete icon to remove it.
      </Typography>
      
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
                <TableCell align='center' >Delete?</TableCell>
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
        <Typography
          variant={"body1"}
          className={styles.spacing}
        >
          [No Coupons to Show]
        </Typography>
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
    width : '50px'
    , height : 'auto'
    , color : 'blue'
    , border : '2px dashed green'
    , cursor : 'pointer'
  },
  spacing : {
    margin : theme.spacing(2, 1, 0, 1)
  },
  popover : {
    margin : theme.spacing(2)
    , backgroundColor : 'red'
  }
}));


////// Styled Components //////

const StyledTable = styled(Table)`
   max-width : 400px !important;
   width : 400px !important;
`;

const PrevNextContainer = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  width: 150px;
  justify-content: space-around;
  border: 2px dashed pink;
  margin: 20px auto 0 auto;
`;











