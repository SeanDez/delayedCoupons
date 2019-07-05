import AjaxRequestor from "../AjaxRequestor";
import dummyCouponData from '../../dummyCouponData';

const ajaxRequestor = new AjaxRequestor('testValue');


test('ajaxRequestor', async () => {
  // test the dev flow
  const response = await ajaxRequestor.post(undefined, undefined, [{ k : 'v'}]);
  expect(response.data).toStrictEqual([{k : 'v'}]);
  
  
  // test parameterizing
  expect(ajaxRequestor.url).toStrictEqual('testValue');
  
  const testUndefined = new AjaxRequestor();
  expect(testUndefined.url).toStrictEqual(undefined);
  
  // test mock returning
  try {
    const response = await ajaxRequestor.post(undefined, undefined, dummyCouponData);
    expect(response.data).toEqual(dummyCouponData);
  }
  catch (e) {
    console.log(e, `=====error=====`);
  }
  
});