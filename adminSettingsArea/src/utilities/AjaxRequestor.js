import axios from "axios";

class AjaxRequestor {
  constructor() {
    this.environment = process.env.NODE_ENV;
  }
  
  post(url, postData, returnData = null) {
    // if dev just resolve the data
    
  }
}