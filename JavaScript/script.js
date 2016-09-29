// put IIFE to protect global environment and use strict.
(function(window, document) {
  'use strict';
// I created a function that it's a IIFE, this helps me to make methods private and public.
// On this IIFE there are methods to calculate the total price of all watches and clocks in a JSON of products.
  var priceCalculator = (function() {
// result will be responsible for storing the total value of those clocks, page will be responsible for storing
// the number of the current page and shopifyJsonUrl is self-describable, it stores the JSON of products url, the reason I // created this variable is to avoid duplication of this url.
    var result = 0;
    var page = 1;
    var shopifyJsonUrl = 'http://shopicruit.myshopify.com/products.json?page=';
// priceCalculator.init will start the http request via ajax, passing the json url and the callback by arguments.
    var init = function () {
      makeGet(shopifyJsonUrl + page, handleShopifyJson(0));
    };
// priceCalculator.isRequestOk checks if the request is done or not, returns boolean.
    var isRequestOk = function (request) {
      return request.readyState === 4 && request.status === 200;
    };
// priceCalculator.makeGet makes a http request via ajax, I used it to get the products.json remotely.
    var makeGet = function (url, callback) {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', url);
      ajax.send();
      ajax.addEventListener('readystatechange', callback);
    };
// This is a callback for the ajax request, it will handle with the http response getting the JSON of each page, then, it
// checks if the page is empty or not, until it finds an empty page, it calculates the prices recursively, storing the total
// value on the argument objectResult, and in each recursive ajax request, it adds the total value of the current page to
// objectResult, pass it to the next ajax request and when it finds an empty page, it basically print the value of
// objectResult on screen.
    var handleShopifyJson = function (objectResult) {
      return function () {
        if ( isRequestOk(this) ) {
          try {
            var clocksAndWatches = [];
            var products = JSON.parse(this.responseText).products;

            if (Object.keys(products).length !== 0) {
              clocksAndWatches = getClocksFromJSON(products);
              page += 1;
              makeGet(shopifyJsonUrl + page, handleShopifyJson(addToResult(clocksAndWatches)));
            } else {
              printOnScreen('result', objectResult.toFixed(2));
            }
          } catch (error) {
            printOnScreen('error', error);
          }
        }
      };
    };
// priceCalculator.getClocksFromJSON iterate on a list of products to get each type of clocks and watches, and return an
// array with all the possible types on the current page.
    var getClocksFromJSON = function (products) {
      var arrayOfClocksAndWatches = [];

      products.forEach(function (product) {
        if (product.product_type === 'Clock' || product.product_type === 'Watch') {
          product.variants.forEach(function (variant) {
            arrayOfClocksAndWatches.push(variant);
          });
        }
      });
      console.log(arrayOfClocksAndWatches);
      return arrayOfClocksAndWatches;
    };
// priceCalculator.addToResult basically gets an array of clocks and watches, iterate on it to get each price, add each
// price to the result variable and return it.
    var addToResult = function (clocksAndWatches) {
      var totalPrice = 0;

      clocksAndWatches.forEach(function (clock) {
        totalPrice += (+(clock.price));
      });

      result += totalPrice;
      return result;
    };
// priceCalculator.printOnScreen will print on screen a defList with title and value.
    var printOnScreen = function (targetTitle, targetValue) {
      var defList = document.createElement('dl');
      var title = document.createElement('dt');
      var value = document.createElement('dd');

      title.innerHTML = targetTitle;
      value.innerHTML = targetValue;

      defList.appendChild(title);
      defList.appendChild(value);

      document.body.appendChild(defList);
    };
// Letting just init public.
    return {
      init: init
    };
  })();
// Executes the init function to have the result printed on screen.
  priceCalculator.init();
})(window, document);
