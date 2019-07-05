import axios from "axios";


export default class AjaxRequestor {
  
  constructor(ajaxUrl = undefined) {
    this.environment = process.env.NODE_ENV;
    this.url = ajaxUrl;
    this.setUrl();
  }
  
  setUrl() {
    // any non dev env should use undefined (and throw an error) or better, use an actual ajaxUrl
    if (process.env.NODE_ENV === 'development') {
      this.url = 'devUrl'
    }
  }
  
  async post(postData, url = this.url, returnData = null) {
    // if dev just resolve the data
    
    if (
      this.environment &&
      (this.environment === 'development' ||
       this.environment === 'test' )
    ) {
      try {
        const resolvedValue = await Promise
          .resolve({data : returnData});

        return resolvedValue;
      }
      catch (e) {
        console.log(e, `=====error=====`);
      }
      
    } else {
      try {
        const response = await axios
          .post(url, postData);
        return response.data;
      }
      catch (e) {
        console.log(e, `=====error=====`);
      }
    }
  }
}

