const { get } = require('http');

get('http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters={ "Normalized": false, "NumberOfDays": 365, "DataPeriod": "Day","Elements":[{"Symbol":"AAPL","Type":"price","Params":["c"]}]}', (res) => {
  const statusCode = res.statusCode;
  const contentType = res.headers['content-type'];
// console.log("res stuff", res.json);
  let error;
  if (statusCode !== 200) {
    error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
  } else if (!/^text\/javascript/.test(contentType)) {
    error = new Error(`Invalid content-type.\n` +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.log(error.message);
    // consume response data to free up memory, since we won't use the request body. Until the data is consumed, the 'end' event will not fire. Also, until the data is read it will consume memory that can eventually lead to a 'process out of memory' error.
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => rawData += chunk);
  res.on('end', () => {
    try {
      let parsedData = JSON.parse(rawData);
      // console.log(parsedData);
      // console.log(parsedData.Elements[0].DataSeries.close.values);
      let priceval = parsedData.Elements[0].DataSeries.close.values;
      let summedprice = 0

      for (var i=0; i<priceval.length; i++) {
        summedprice += Number(priceval[i]);
      }

      let priceavg = Math.round(summedprice/priceval.length);

      console.log("the average price is ", priceavg);


    } catch (e) {
      console.log(e.message);
    }
  });
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});
