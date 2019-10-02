import fetchMock from 'fetch-mock';
import '../../globals';
import Authentication from "../Authentication";
import dotenvv from 'dotenv';
import Cookies from "js-cookie";

dotenvv.config();

const authentication = new Authentication();

////// SETUP //////



////// TESTS //////

test('createToken', async () => {
  fetchMock
    .post('http://localhost/wptest2/wp-json/jwt-auth/v1/token', {token : 'tokenVal'})
    // .post('http://localhost/wptest2/wp-json/jwt-auth/v1/token', {code : 'jwt_auth_failed'});
    
  
  // a post request returns an object with a token property
  const token1 = await authentication.createToken();
  expect(token1).toEqual({token : 'tokenVal'});
  
  // credentials are invalid
  
});



test('validateToken', async () => {
  // successful validation. Then an invalid post
  fetchMock.post('http://localhost/wptest2/wp-json/jwt-auth/token/validate', {data : { status : 200 }})
  
  
  
});


test('retrieveOrCreateValidJwt', async () => {
  fetchMock.config.overwriteRoutes = true;
  
  // if there is no token/cookie then create a new one
  Object.defineProperty(window.document, 'cookie', {
    writable : true
    , value : 'delayedCoupons_token='
  });
  fetchMock.post('http://localhost/wptest2/wp-json/jwt-auth/v1/token', {token : 'valueFromCreate'});
  expect(await authentication.retrieveOrCreateValidJwt({})).toEqual('valueFromCreate');
  
  
  // setup a cookie
  Object.defineProperty(window.document, 'cookie', {
    writable : true
    , value : 'delayedCoupons_token=testVal'
  });
  expect(Cookies.get('delayedCoupons_token')).toEqual('testVal');
  
  // return a token from a current Cookie value
  // need to mock the fetch request to say "yes, it's valid"
  fetchMock.post('http://localhost/wptest2/wp-json/jwt-auth/v1/token/validate', {data : { status : 200 }});
  expect(await authentication.retrieveOrCreateValidJwt({})).toEqual('testVal');
  
  
  // if the validation comes back invalid, have a new token be created
  fetchMock
  .post('http://localhost/wptest2/wp-json/jwt-auth/v1/token/validate', {data : { status : 403 }})
  .post('http://localhost/wptest2/wp-json/jwt-auth/v1/token', {token : 'testVal2'});
  expect(await authentication.retrieveOrCreateValidJwt({})).toEqual('testVal2');
  
});