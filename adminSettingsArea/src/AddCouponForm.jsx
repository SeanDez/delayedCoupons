import React, {useState, useContext, useEffect} from "react";
import {Route} from "react-router-dom";


import {makeStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel";
import SnackBar from '@material-ui/core/Snackbar';
import SnackBarContent from '@material-ui/core/SnackbarContent';
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import AjaxRequestor from "./utilities/AjaxRequestor";

// todo create a success / error Snackbar and send it data (will be a direct child)

const ajaxRequestor = new AjaxRequestor();


const AddCouponForm = props => {
  let {clientNonce, apiBaseUrl} = props;
  const styles = jssStyles();
  
  ////// State for inputs //////
  const [pageTarget, setPageTarget] = useState('');
  const [displayThreshold, setDisplayThreshold] = useState(0);
  const [numberOfOffers, setNumberOfOffers] = useState(0);
  const [couponHeadline, setCouponHeadline] = useState('');
  const [couponDescription, setCouponDescription] = useState('');
  
  ////// State for dropdowns //////
  const [headlineTextColor, setHeadlineTextColor] = useState("");
  const [headlineBackgroundColor, setHeadlineBackgroundColor] = useState("");
  const [descriptionTextColor, setDescriptionTextColor] = useState("");
  const [descriptionBackgroundColor, setDescriptionBackgroundColor] = useState("");
  
  ////// Checkbox State //////
  const [addCouponBorder, setAddCouponBorder] = useState(true);
  
  
  /** Resets all the form state variables
   * @return void
   */
  const resetAddCouponState = () => {
    setPageTarget("");
    setDisplayThreshold(0);
    setNumberOfOffers(0);
    setCouponHeadline("");
    setCouponDescription("");
    setHeadlineTextColor("");
    setHeadlineBackgroundColor("");
    setDescriptionTextColor("");
    setDescriptionBackgroundColor("");
    setAddCouponBorder(true);
  };
  

  /** Form Handling
   * Submits post request
   * @return: object. If success, success key. if error, error key.
   */
  const postCouponAndSetSnackBarMessage = async () => {
    // push all state keys into an object
    const formData = {
      pageTarget, // target table
      displayThreshold, // target table
      numberOfOffers, // target table
      couponHeadline, // coupon table
      couponDescription, // coupon table
      headlineTextColor, // coupon table
      headlineBackgroundColor, // coupon table
      descriptionTextColor, // coupon table
      descriptionBackgroundColor, // coupon table
      addCouponBorder,
      clientNonce
    };
    
    console.log(formData, `=====formData=====`);
    
    const response = await ajaxRequestor.post( `${apiBaseUrl}/${namepaceAndVersion}/add`, formData);
    setupSnackBarData(response);
    resetAddCouponState();
  };
  
  
  
  /** Snackbar
   * Will immediately be handed success or error information to fire
   *
   * State will not be held. This would cause problems with future additions
   */
  const snackBarTypes = Object.freeze({
    success : 'success',
    error : 'error'
  });
  
  const [snackBarType, setSnackBarType] = useState('');
  const [snackBarMessage, setSnackBarMessage] = useState('');
  
  /** Sets the snackbar state
   * A component prop automatically blanks it out after a preset time (in another component prop)
   */
  const setupSnackBarData = responseData => {
    if (responseData.newCouponId) {
      // fire snackbar with success state
      setSnackBarType(snackBarTypes.success);
      setSnackBarMessage(`Successfully added a new coupon. ID: ${ responseData.newCouponId }. Click 'View Coupons' to see your new coupon.`);
    } else if (responseData.error) {
      // setup error snackBar
      setSnackBarType(snackBarTypes.error);
      setSnackBarMessage(responseData.error);
    }
  };
  
  
  const generateColorOptions = () => {
    const colors = ['black', 'blue', 'brown', 'gray', 'green', 'orange', 'purple', 'red', 'yellow', 'white'];
    
    const menuJsx = colors.map(color => (
      <MenuItem
        value={color}
        key={color}
      >
        {color}
      </MenuItem>
    ));
    
    return menuJsx;
  };
  
  
  return (
    <div
    >
      <Typography
        className={[styles.all, styles.paragraphSpacing].join(" ")}
        variant={'h6'}
      >Add Coupons Form</Typography>
      
      <Typography
        className={[styles.all, styles.paragraphSpacing].join(" ")}
        variant={'subtitle2'}
      >There are 2 main parts to add a coupon. First are the coupon settings itself, including information like the text and colors. Then you will also need to define the page that a user must visit, and how many times to count visits before showing a coupon</Typography>
      <Typography
        className={[styles.all, styles.paragraphSpacing].join(" ")}
        variant={'subtitle2'}
      >Click here for a full explanation of how the plugin works and how to setup your first coupon</Typography>
      
     
      <form
        className={[styles.form, styles.all].join(" ")}
        onSubmit={e => {
          e.preventDefault();
          postCouponAndSetSnackBarMessage();
        }}
      >
        <TextField
          label="Target page"
          helperText='Copy and paste the target page for the coupon to be shown here'
          name='targetPage'
          className={styles.formChild}
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
          className={styles.formChild}
        />
        <TextField
          label='Number of times offer shown'
          helperText="Maximum number of visits the user then sees the coupon"
          required
          name='numberOfOffers'
          type='number'
          value={numberOfOffers}
          onChange={e => setNumberOfOffers(e.target.value)}
          className={styles.formChild}
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
            {generateColorOptions()}
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
            {generateColorOptions()}
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
            {generateColorOptions()}
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
            {generateColorOptions()}
          </Select>
        </div>
        
        <FormControlLabel
          control={<Checkbox
            checked={addCouponBorder}
            onChange={() => setAddCouponBorder(!addCouponBorder)}
          />}
          label={'Include a dashed border around this coupon. The dashes will be the same color as the description text.'}
          className={styles.formChild}
        />

        
        <Button
          type='submit'
          className={styles.addButton}
        >Add Coupon</Button>
      </form>
  
      {/*
       The snackbar below is triggered by an ajax response
       It is closed automatically, triggering onClose
       onClose wipes state keys for the next round (add or submit attempt).
       */}
  
      <SnackBar
        open={Boolean(snackBarType)}
        autoHideDuration={10000}
        message={<p>{snackBarMessage}</p>}
        onClose={() =>  {
          setSnackBarType('');
          setSnackBarMessage('');
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      />

    </div>
  );
};



////// Styles //////

const jssStyles = makeStyles(theme => ({
  all : {
    maxWidth : '500px',
    padding: '0 3vw'
  },
  form: {
    margin: theme.spacing(0, 0, 0, 0),
    display : "flex",
    flexFlow : "column wrap",
    justifyContent : 'space-around',
  },
  addButton: {
    margin: theme.spacing(5, 2, 20, 2)
    , padding: theme.spacing(1, 2, 1, 2)
    , border : '2px dashed brown'
  },
  dropDownSelect : {
    minWidth : '300px'
  },
  formChild : {
    margin : '40px 0 0 0',
  },
  errorSnackbar : {
    backgroundColor : theme.palette.error.dark
  },
  paragraphSpacing : {
    padding : theme.spacing(2, 2, 0, 2),
  }
}));



export default AddCouponForm;











