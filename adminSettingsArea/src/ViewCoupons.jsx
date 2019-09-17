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
import ReactPaginate from 'react-paginate';

import styled from "styled-components";
import {FaChevronCircleLeft, FaChevronCircleRight, FaTrashAlt} from 'react-icons/fa';



// setup the request handler
const ajaxRequestor = new AjaxRequestor();



////// Component //////
export default props => {
  const {apiBaseUrl, clientNonce} = props;
  const {setSnackbarMessage} = useContext(StatePassingContext);
  
  
  ////// Pagination State //////
  const [pageOffset, setPageOffset] = useState(0);
  const [totalRecordCount, setTotalRecordCount] = useState(null);
  
  ////// JSS //////
  const styles = useStyles();
  
  /**
   * loads couponData initially and onChange
   *
   * Automatically updates after a delete request, which also modifies the array bound to couponData
   */
  const [couponData, setCouponData] = useState([]);
  
  // return a promise which if resolves, responds with the data array
  const fetchAllCoupons = async (limit, offset) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${namepaceAndVersion}/load?limit=${limit}&offset=${offset}`, {
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
  
  
  /** ON INITIAL LOAD AND TABLE UPDATES
   *
   * Sets up couponData state, which also controls whether a table or "Nothing to Display" message is shown
   *
   * Also sets pagination state for the offset and total record count
   */
  
  // if couponData = blank then run
  
  useEffect( () => {
    fetchAllCoupons(10, pageOffset)
      .then(data => {
          if (_.isEqual(data.rows, couponData) === false) {
            setCouponData(data.rows);
            setPageOffset(() => pageOffset + 10);
            setTotalRecordCount(data.totalCount);
          }
      })
      .catch(e => console.log(e, '====error===='));
  }, []);
  
  
  
  
  
  /** Decides whether to render table or "no data" msg
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
  
  
  /** Deletes a single table row
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
  
  
  /** Truncates and returns the end of an input string
   */
  const truncateEndingSegment = (inputString, numberOfCharacters) => {
    const interpolatedRegex = new RegExp(`.{${numberOfCharacters}}$`);
    
    const truncatedString = inputString.match(interpolatedRegex);
    return '...' + truncatedString;
  };
  
  
  /** Handles coupon deletion, updating of table or error box
   *
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
  
  
  /** Renders body cell data
   *
   *  @param data array. Holds coupon, target, and view data
   *
   *  @return array of JSX values (table elements) to be created by Javascript
   *
   */
  const renderTableBody = data => {
    return data.map(record => (
      <TableRow key={record.couponId}>
        <TableCell align='center'>{record.couponId}</TableCell>
        <Tooltip
          title={record.titleText}
          placement={'top'}
        >
          <TableCell
            align='center'
            className={styles.fixedWidthColumn}
          >{record.titleText}</TableCell>
        </Tooltip>
        <Tooltip
          title={record.descriptionText}
          placement={'top'}
        >
          <TableCell
            align='center'
            className={styles.fixedWidthColumn}
          >{record.descriptionText}</TableCell>
        </Tooltip>
        <Tooltip
          title={record.targetUrl}
          placement={'top'}
        >
          <TableCell
            align={'center'}
            className={styles.fixedWidthColumn}
          >{truncateEndingSegment(record.targetUrl, 15)}</TableCell>
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
  

  
  /** RENDER
   * Renders either a data table of current coupons, or a "no coupons" message
   */
  return (
    <div>
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
                <TableCell
                  align='center'
                  className={styles.fixedWidthColumn}
                >Title Text</TableCell>
                <TableCell
                  align='center'
                  className={styles.fixedWidthColumn}
                >Description Text</TableCell>
                <TableCell
                  align='center'
                  className={styles.fixedWidthColumn}
                >Target Page</TableCell>
                <TableCell align='center'>Total Hits</TableCell>
                <TableCell align='center'>Delay</TableCell>
                <TableCell align='center'># of Offers</TableCell>
                <TableCell align='center' >Delete?</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              { renderTableBody(couponData) }
            </TableBody>
          </StyledTable>
        
          <ReactPaginate
            pageCount={Math.ceil(totalRecordCount / 10)}
          />
          
          <button
            onClick={() => {
              console.log(couponData, `=====couponData=====`);
              console.log(Math.ceil(totalRecordCount / 10), `=====Math.ceil(totalRecordCount / 10)=====`);
              console.log(totalRecordCount, `=====totalRecordCount=====`);
              console.log(pageOffset, `=====pageOffset=====`);
            }}
          >console log</button>
          
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
  fixedWidthColumn : {
    maxWidth : '200px'
    , overflow : 'hidden'
    , textOverflow : 'ellipsis'
    , whiteSpace : 'nowrap'
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











