## Travel App

### description:
* The project is used to schedule your trips and get weather on theses days.

### Techniques: 
1- Node JS
2- HTML, SCSS and JS
3- Webpack
4- Jest
5- Service Workers

### requirements:
 1. Node version 14.0
 2. Create Travel-App\src\client\js\constansts.js file (beside app.js) to save API keys.
 3. Register at http://www.geonames.org/ to get your user name.
 4. set the key like `USER_NAME=**************` in constansts.js.
 5. Register at https://www.weatherbit.io/account/create to get the API key.
 6. set the key in constansts.js like `WEATHERBIT_API_KEY =**************`  in constansts.js.
 7. Register at https://pixabay.com to get the API key.
 8. set the key in constansts.js like `PIXABAY_API_KEY =**************`  in constansts.js.

### Steps to run the project: 
 1. `npm install`.
 2. to backend server `npm run start`.
 3. to run frontend `npm run build-dev`.
 4. Enter city name like "Roma Italy", "Paris France", "tokyo japan" and the date.

### Notes: 
 1. To run production build `npm run build-prod`.
 2. The project is limit to 16 day in the future due to `weatherbit` limitions.