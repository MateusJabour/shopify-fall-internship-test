# Allows me to work with JSON
require "json"
# Allows me to make http requests
require "net/http"
require "uri"
# total will be used to store the total value of all watches from the JSON of products, page will be responsible for going
# in each page of the JSON until it finds an empty page, isPageEmpty will stop our loop of requests
# in the right time(when an empty page is reached).
total = 0
page = 1
isPageEmpty = false
# getJson gets the shopify json using http requests, using the net library, also, i'm using URI object.
# If I didn't use this URI object, I would need to separate host from path, that's why I used it.
def getJSON(uri)
  http = Net::HTTP.get(URI(uri))
  JSON.parse(http)
end
# calculateResult receives the hash of products of a JSON page as its argument and
# calculates the value of all kind of watches and clocks in this hash.
# It return an array, the first value is the total value of the watches,
# and the second value is a boolean the returns true if the current page is empty, and return false if not.
def calculateResult(products)
  if (products.length != 0)
    result = 0

    products.each { |product|
      if (product["product_type"] == 'Clock' || product["product_type"] == 'Watch')
        product["variants"].each { |variant|
          result += variant['price'].to_f
        }
      end
    }
    return [result, false]
  end

  return [0, true]
end
# Here we're calculating the total price of the watches of all pages of a JSON of products. It just stops when it
# finds an empty page.
until isPageEmpty do
  result, isPageEmpty = calculateResult(getJSON('http://shopicruit.myshopify.com/products.json?page=' + page.to_s)["products"])
  total += result
  page += 1
end
# Prints the result, I'm using round to eliminate the numbers of imprecision that are produced.
puts "#{total.round(2)}"
