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

  // const couponData = useContext(CurrentCouponChannel);
  
  // load couponData initially and onChange
  const [couponData, setCouponData] = useState();
  
  useEffect( () => {
    try {
      (async () => {
        const response = await ajaxRequestor.post({
          action : 'loadCouponData'
        }, undefined, dummyCouponData);
        console.log(response, `=====response=====`);
        setCouponData(response.data);
      })();
    }
    catch (e) {
      console.log(e, `=====error=====`);
    }
  }, [couponData]);
  
  
  const [tableMarker, setTableMarker] = useState(0);
  
  
  // todo use record.couponId to send a delete request
  // decides whether or not to render table
  const checkIfCouponDataExists = data => {
    if (data && data.length) {
      console.log(`=====coupon data exist=====`);
      return true;
    }
    console.log(`=====coupon data doesn't exist=====`);
    return false
  };
  
  
  // send row delete request
  
  
  
  
  // renders body cell data
  const renderTableBody = (data, marker) => {
    console.log(data, `=====data=====`);
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
  
  
  // calculate table position
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
  
  // (Re)Render table rows based on state changes
  // couponData changes after a delete request
  // tableMarker changes when prev/next selected
  // useEffect(() => {
  //   renderTableBody(couponData, tableMarker);
  // }, [couponData, tableMarker]);

  
  
  
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

////// Jss Styles //////

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











