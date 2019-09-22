import Cookies from "js-cookie";

export default class Authentication {
  
  constructor() {
  }
  
  createToken() {
  
  }
  
  validateToken() {
  
  }
  
  
  /** Controls validation and new token creation
   * returns token string on success
   *
   * Only errs if both validating and creating a token fails
   */
  authenticateUser(credentials) {
    const TOKEN_COOKIE = "delayedCoupons_token";
    let token = Cookies.get(TOKEN_COOKIE);
    
    // if token present try to validate it
    if (token) {
      const response = this.validateToken(token);
      
      // if token validated return it
      if (response && 'token' in response) {
        return response.token;
      }
    }
    
    // if no token, or prev token not valid, create new token and save/overwrite token cookie
    const newToken = this.createToken(credentials);
    Cookies.set(TOKEN_COOKIE);
    
    // return newly created token
    return newToken.token;
  }
  
}