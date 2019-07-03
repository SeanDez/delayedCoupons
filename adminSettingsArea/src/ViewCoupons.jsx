import React, {useState, useContext, useEffect} from "react";
import {CurrentCouponChannel} from "./index.jsx";

import {makeStyles} from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import styled from "styled-components";
import {FaChevronCircleLeft, FaChevronCircleRight} from 'react-icons/fa';


export default props => {
  const couponData = useContext(CurrentCouponChannel),
        styles = useStyles();
  
  const [tableMarker, setTableMarker] = useState(0);
  
  
  // decides whether or not to render table
  const checkifCouponDataExists = data => {
    if (data && data.length) {
      return true;
    }
    return false
  };
  
  // renders body cell data
  const renderTableBody = (data, marker) => {
    console.log(marker, `=====marker=====`);
    
    const filteredData = data.filter((arrayItem, index) => (
      index >= marker &&
      index <= (marker + 9)
    ));
    console.log(filteredData, `=====filteredData=====`);
    
    return filteredData.map((record, i) => (
      <TableRow key={i}>
        <TableCell align='center'>{record.pageTarget}</TableCell>
        <TableCell align='center'>{record.displayThreshold}</TableCell>
        <TableCell align='center'>{record.numberOfOffers}</TableCell>
        <TableCell align='center'>{Math.random() * 100}</TableCell>
        <TableCell align='center'>delete</TableCell>
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
  
  

  
  
  ////// Side Effects //////

  // (Re)Render table rows based on state change to tableMarker
  useEffect(() => {
    renderTableBody(couponData, tableMarker);
  }, [tableMarker]);
  
  
  return (
    <React.Fragment>
      <h3>View Coupons</h3>
      <p>On this page you will find all the coupons you have setup and the pages they target. To delete a coupon click
         the delete icon to remove it.</p>
      
      { checkifCouponDataExists(couponData) ?
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











