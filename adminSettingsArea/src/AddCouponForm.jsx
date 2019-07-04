import React, {useState, useContext, useEffect} from "react";
import {Route} from "react-router-dom";
import {TestTunnel} from "./index.jsx";

import {makeStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
// import NumberField from "material-ui-number-input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel";

import axios from "axios";


//

////// Form Poster //////

// todo get async await ready for this function
export const postFormData = async (ajaxUrl, formData) => {
  const {pageTarget, displayThreshold, numberOfOffers,
          couponHeadline, couponDescription, headlineTextColor, headlineBackgroundColor, descriptionTextColor, descriptionBackgroundColor} = formData;

  // todo get the ajaxUrl from php

  // try {
  //   const response = await axios.post(ajaxUrl, {
  //     pageTarget, displayThreshold, numberOfOffers,
  //     couponHeadline, couponDescription, headlineTextColor, headlineBackgroundColor, descriptionTextColor, descriptionBackgroundColor
  //   });
  //   return response.data.json(); // add await
  // }
  // catch (e) {
  //   console.log(e, `=====error=====`);
  // }

};



export default props => {
  const testValue = useContext(TestTunnel);
  const styles = jssStyles();
  
  ////// State for inputs //////
  const [pageTarget, setPageTarget] = useState('');
  const [displayThreshold, setDisplayThreshold] = useState(0);
  const [numberOfOffers, setNumberOfOffers] = useState(0);
  
  
  
  ////// State for dropdowns //////
  const [headlineTextColor, setHeadlineTextColor] = useState("Orange");
  const [headlineBackgroundColor, setHeadlineBackgroundColor] = useState("");
  const [descriptionTextColor, setDescriptionTextColor] = useState("");
  const [descriptionBackgroundColor, setDescriptionBackgroundColor] = useState("");
  
  const [couponHeadline, setCouponHeadline] = useState('');
  const [couponDescription, setCouponDescription] = useState('');
  
  
  const [dummyVal, setDummyVal] = useState(0);
  
  
  ////// Side Effects //////
  useEffect(() => {
    console.log(headlineTextColor, `=====headlineTextColor=====`);
  }, [headlineTextColor]);
  
  
  // todo split this form in 2 parts after it works
  
  return (
    <React.Fragment>
      <h3>Add Coupons Form</h3>
      <p>There are 2 main parts to add a coupon. First are the coupon settings itself, including information like the text and colors. Then you will also need to define the page that a user must visit, and how many times to count visits before showing a coupon</p>
      <p>Click here for a full explanation of how the plugin works and how to setup your first coupon</p>
      
      <form className={styles.form} >
        <TextField
          label="Target page"
          helperText='Copy and paste the target page for the coupon to be shown here'
          name='targetPage'
          className={styles.formChild}
          type='number'
          value={pageTarget}
          onChange={e => setPageTarget(e.target.value)}
        />
        <TextField
          label='Delay before showing offer'
          helperText="How many times a user should visit this page before the coupon is offered?"
          required
          name='displayThreshold'
          type='number'
          value={displayThreshold}
          onChange={e => setDisplayThreshold(e.target.value)}
        />
        <TextField
          label='Number of times offer shown'
          helperText="Maximium number of visits the user then sees the coupon"
          required
          name='numberOfOffers'
          type='number'
          value={numberOfOffers}
          onChange={e => setNumberOfOffers(e.target.value)}
        />
        <TextField
          label='Coupon Headline'
          multiline
          placeholder='On the fence? Special Offer Just For You!'
          name='couponHeadline'
          className={styles.formChild}
          value={couponHeadline}
          onChange={e => setCouponHeadline(e.target.value)}
        />
        <TextField
          label='Coupon Description'
          multiline
          placeholder="Buy now and take 10% off! Use coupon code 'OffTheFence' at checkout"
          className={styles.formChild}
          value={couponDescription}
          onChange={e => setCouponDescription(e.target.value)}
        />
        
        <div
          id="flexChildContainer"
          className={styles.formChild}
        >
          <InputLabel htmlFor='headlineTextColor'>
            Headline Text Color
          </InputLabel>
          <Select
            id='headlineTextColor'
            className={styles.dropDownSelect}
            value={headlineTextColor}
            onChange={e => {
              setHeadlineTextColor(e.target.value);
            }}
          >
            <MenuItem value='black'>Black</MenuItem>
            <MenuItem value='white'>White</MenuItem>
          </Select>
        </div>
        
        <div id="flexChildContainer"
             className={styles.formChild}
             defaultValue={headlineBackgroundColor}
             
        >
          <InputLabel htmlFor='headlineBackgroundColor'>
            Headline Background Color
          </InputLabel>
          <Select
            id='headlineBackgroundColor'
            className={styles.dropDownSelect}
            value={headlineBackgroundColor}
            onChange={e => setHeadlineBackgroundColor(e.target.value)}
          >
            <MenuItem value='black'>Black</MenuItem>
            <MenuItem value='white'>White</MenuItem>
          </Select>
        </div>
        
        <div id="flexChildContainer"
             className={styles.formChild}
        >
          <InputLabel htmlFor='descriptionTextColor'>
            Description Text Color
          </InputLabel>
          <Select
            id='descriptionTextColor'
            className={styles.dropDownSelect}
            value={descriptionTextColor}
            onChange={e => setDescriptionTextColor(e.target.value)}
          >
            <MenuItem value='black'>Black</MenuItem>
            <MenuItem value='white'>White</MenuItem>
          </Select>
        </div>
        
        <div id="flexChildContainer"
             className={styles.formChild}
        >
          <InputLabel htmlFor='descriptionBackgroundColor'>
            Description Background Color
          </InputLabel>
          <Select
            id='descriptionBackgroundColor'
            className={styles.dropDownSelect}
            value={descriptionBackgroundColor}
            onChange={e => setDescriptionBackgroundColor(e.target.value)}
          >
            <MenuItem value='black'>Black</MenuItem>
            <MenuItem value='white'>White</MenuItem>
          </Select>
        </div>
        
        <Route render={props => (
          <Button
            className={[styles.addButton, styles.formChild].join(' ')}
            onClick={() => {
              // postFormData(null, null)
              //   .then(res => res)
              props.history.push('/view-coupons')
            }}
          >Add Coupon</Button>
        )}
        />
      </form>
      
      {/*<p>Test k1 from hook: { testValue.k1 }</p>*/}
    </React.Fragment>
  );
}

////// Styles //////

const jssStyles = makeStyles(theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    // minHeight : 800,
    marginTop: theme.spacing(0),
    // border: '1px solid lightgray',
    padding: '0 3vw',
    display : "flex",
    flexFlow : "column wrap",
    justifyContent : 'space-around'
  },
  addButton: {
    margin: theme.spacing(3, 0, 2),
  },
  dropDownSelect : {
    minWidth : '300px'
  },
  formChild : {
    margin : '30px 0'
  }
}));















