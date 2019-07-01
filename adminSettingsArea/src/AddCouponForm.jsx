import React, {useState, useContext, useEffect} from "react";
import {TestTunnel} from "./index.jsx";

import {makeStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
// import NumberField from "material-ui-number-input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel";


const jssStyles = makeStyles(theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    // minHeight : 800,
    marginTop: theme.spacing(0),
    border: '1px solid lightgray',
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
    margin : '20px 0'
  }
}));


export default props => {
  const testValue = useContext(TestTunnel);
  const styles = jssStyles();
  
  ////// State for inputs //////
  const [pageTarget, setPageTarget] = useState(null);
  const [displayThreshold, setDisplayThreshold] = useState(null);
  const [numberOfOffers, setNumberOfOffers] = useState();
  
  
  
  ////// State for dropdowns //////
  const [headlineTextColor, setHeadlineTextColor] = useState("Orange");
  const [headlineBackgroundColor, setHeadlineBackgroundColor] = useState("");
  const [descriptionTextColor, setDescriptionTextColor] = useState("");
  const [descriptionBackgroundColor, setDescriptionBackgroundColor] = useState("");
  
  const [couponHeadline, setCouponHeadline] = useState('On the fence? Special Offer Just For You!');
  const [couponDescription, setCouponDescription] = useState("Buy now and take 10% off! Use coupon code 'OffTheFence' at checkout");
  
  
  const [dummyVal, setDummyVal] = useState(0);
  
  const sendFormToBackEnd = () => {
    setDummyVal(dummyVal + 1);
    console.log(dummyVal);
  };
  
  ////// Side Effects //////
  useEffect(() => {
    console.log(headlineTextColor, `=====headlineTextColor=====`);
  }, [headlineTextColor]);
  
  
  return (
    <React.Fragment>
      {/*{console.log(headlineTextColor, `=====headlineTextColor=====`)}*/}
      <h3>Add Coupons Form</h3>
      {/* page to target. hits before showing. number of times to show it. headline text. body text. colors for text/bg */ }
      
      <form
        action=""
        method="post"
        className={styles.form}
      >
        
        <TextField
          label="What page should this coupon target?"
          name='targetPage'
          className={styles.formChild}
        />
        {/*<NumberField*/ }
        {/*  label="How many times should a user visit this page before the coupon is offered?"*/ }
        {/*  required*/ }
        {/*  name='displayThreshold'*/ }
        {/*/>*/ }
        {/*<NumberField*/ }
        {/*  label="How many times should your coupon then be shown?"*/ }
        {/*  required*/ }
        {/*  name='numberOfOffers'*/ }
        {/*/>*/ }
        <TextField
          label='Coupon Headline'
          multiline
          placeholder={couponHeadline}
          name='couponHeadline'
          className={styles.formChild}
        />
        <TextField
          label='Coupon Description'
          multiline
          placeholder={couponDescription}
          className={styles.formChild}
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
          >
            <MenuItem value='black'>Black</MenuItem>
            <MenuItem value='white'>White</MenuItem>
          </Select>
        </div>
        
        <Button
          className={[styles.addButton, styles.formChild].join(' ')}
          onClick={() => {
            sendFormToBackEnd()
          }}
        >Add Coupon</Button>
      </form>
      
      {/*<p>Test k1 from hook: { testValue.k1 }</p>*/}
    </React.Fragment>
  );
}

















