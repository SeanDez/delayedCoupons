import {postFormData} from "../AddCouponForm";

test('postFormData', () => {
  // setup mock data object
  const formData = {
    pageTarget : 'http://google.com', 
    displayThreshold : 4, 
    numberOfOffers : 5,
    couponHeadline : 'Test Headline', 
    couponDescription : 'Test Description', 
    headlineTextColor : 'Navy',
    headlineBackgroundColor : 'Magenta',
    descriptionTextColor : 'Brown',
    descriptionBackgroundColor : 'Gray'
  },
        ajaxUrl = '/admin-ajax.php'
  
  // run
    
});