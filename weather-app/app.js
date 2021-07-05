const request = require('postman-request');

const BASE_URI = 'http://api.weatherstack.com/current'
const YOUR_ACCESS_KEY = 'b12b6083ed2a386b14159ab60bdce4d0'
const CURRENT_WEATHER_URL = `${BASE_URI}?access_key=${YOUR_ACCESS_KEY}&units=f`

request({
  uri: CURRENT_WEATHER_URL,
  json: true
}, (error, response, body) => {
  if (error) {
    console.log('Unable to connect to wather service')
  } else if (body.error) {
    console.log(body.error)
  } else {
    const {current} = response.body
    // observation_time: '07:11 PM',
    //   temperature: 17,
    //   weather_code: 122,
    //   weather_icons: [
    //   'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png'
    // ],
    //   weather_descriptions: [ 'Overcast' ],
    //   wind_speed: 0,
    //   wind_degree: 205,
    //   wind_dir: 'SSW',
    //   pressure: 1011,
    //   precip: 0,
    //   humidity: 38,
    //   cloudcover: 100,
    //   feelslike: 17,
    //   uv_index: 5,
    //   visibility: 16,
    //   is_day: 'yes'
    console.log(current)
  }
})
