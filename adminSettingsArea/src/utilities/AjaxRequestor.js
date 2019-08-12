import axios from "axios";

/** Handles requests in dev and production
 *
 * controls the ajaxUrl setting based on either a specific Env Variable, or assumes production if that variable isn't set
 *
 */

export default class AjaxRequestor {
  
  constructor(ajaxUrl = undefined) {
    this.environment = process.env.NODE_ENV;
  }
  
  
  async post(url, postData = undefined, returnData = undefined) {
    // if dev just resolve the data
    
    if (
      this.environment && returnData &&
      (this.environment === 'development' ||
       this.environment === 'test' )
    ) {
      try {
        const resolvedValue = await Promise
          .resolve({
            data : returnData
          });

        return resolvedValue;
      }
      catch (e) {
        console.log(e, `=====error=====`);
      }
      
    } else { // live
      try {
        const response = await fetch(url, {
          method : 'post'
          , mode : 'cors'
          , headers : {
            'Content-Type' : 'application/json'
          }
          , body : JSON.stringify(postData)
        });
        return await response.json(); // returns promise that resolves with the response body
      }
      catch (e) {
        console.log(e, `=====error=====`);
      }
    }
  }
}

