import '../globals';
import Cookies from "js-cookie";

export default class Authentication {
  
  async createToken(userAndPass) {
    const createTokenUrl = apiBaseUrl + '/jwt-auth/v1/token';
    
    try {
      const response = await fetch(createTokenUrl, {
        method : 'post'
        , mode : 'cors'
        , headers : {
          'Content-Type' : 'application/json'
        }
        , body : JSON.stringify(userAndPass)
      });
      
      return response.json();
    }
    
    catch (e) {
      console.log(e, `=====error=====`);
    }
  }
  
  getCurrentJwt() {
    const currentJwt = Cookies.get('delayedCoupons_token');
    
    return currentJwt;
  }
  
  saveTokenToCookie(tokenValue) {
    Cookies.set('delayedCoupons_token', tokenValue);
  }
  
  /** Returns boolean
   */
  async tokenIsValid(token) {
    const validationUrl = apiBaseUrl + '/jwt-auth/v1/token/validate';
    
    // if data.status === 200 it's valid
    try {
      const response = await fetch(validationUrl, {
        method : 'post'
        , mode : 'cors'
        , headers : {
          'Content-Type' : 'application/json'
          , 'Authorization' : `Bearer ${token}`
        }
      });
      const json = await response.json();
      
      // 200 means token is valid
      if ('data' in json && 'status' in json.data) {
        return Boolean(json.data.status === 200)
      }
    }
    catch (e) {
      console.log(e, `=====error during fetch=====`);
    }
  }
  
  
  /** Controls validation and new token creation
   * Returns token string on success
   *
   * Only errs if both validating and creating a token fails
   */
  async retrieveOrCreateValidJwt(userAndPass) {
    const currentJwt = this.getCurrentJwt();

    if (currentJwt && currentJwt !== 'undefined') {
      // return current token if valid
      const jwtIsValid = await this.tokenIsValid(currentJwt);

      if (jwtIsValid) {
        return currentJwt;
      }
    }
    
    // if no valid current token, create a new one, save and return it
    const newTokenDetails = await this.createToken(userAndPass);

    if (newTokenDetails && 'token' in newTokenDetails && newTokenDetails.token !== 'undefined') {
      this.saveTokenToCookie(newTokenDetails.token)
    }
    
    return newTokenDetails.token;
  }
  
}