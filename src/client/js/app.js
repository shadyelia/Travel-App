import * as constansts from "./constansts";

export const setDateLimitions = () => {
  const currentDate = new Date();
  const today = currentDate.toISOString().split("T")[0];
  const numberOfDaysToAdd = 16; //weatherbit limitions
  const maxDay = new Date(
    currentDate.setDate(currentDate.getDate() + numberOfDaysToAdd)
  )
    .toISOString()
    .split("T")[0];
  document.getElementById("travelDate").setAttribute("min", today);
  document.getElementById("travelDate").setAttribute("max", maxDay);
};

export const addTrip = () => {
  const cityName = document.getElementById("city").value.trim();
  const date = document.getElementById("travelDate").value;
  if (cityName !== "" && date !== "") {
    getCityInfo(cityName);
  }
};

const getCityInfo = (cityName) => { //get lat and lng for a city
  fetch(
    `http://api.geonames.org/postalCodeSearchJSON?placename=${cityName}&maxRows=1&username=${constansts.USER_NAME}`
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      setCityInfo(data["postalCodes"][0]);
    })
    .catch(function () {});
};

const setCityInfo = (data) => {
  const selectDate = new Date(document.getElementById("travelDate").value);
  selectDate.setHours(0, 0, 0, 0);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const differenceInTime = selectDate - todayDate;
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  const cityName = document.getElementById("city").value.trim();

  const entry = {
    latitude: data["lat"],
    longitude: data["lng"],
    country: cityName,
    date: differenceInDays
  };

  if (differenceInDays <= 7) {
    getCurrentWearthInfo(entry);
  } else {
    getWeathInfo(entry);
  }
};

const getCurrentWearthInfo = (entry) => { //get current weather
  fetch(
    `https://api.weatherbit.io/v2.0/current?lat=${entry.latitude}&lon=${entry.longitude}&key=${constansts.WEATHERBIT_API_KEY}`
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (result) {
      const data = result["data"];
      const dataInfo = data[0];
      entry["temp"] = dataInfo["temp"];
      entry["description"] = dataInfo["weather"]["description"];

      getImages(entry);
    })
    .catch(function () {});
};

const getWeathInfo = (entry) => {//get future weather
  fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?lat=${entry.latitude}&lon=${entry.longitude}&days=${entry.date}&key=${constansts.WEATHERBIT_API_KEY}`
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (result) {
      const data = result["data"];
      const dataInfo = data[data.length - 1];
      entry["max_temp"] = dataInfo["max_temp"];
      entry["min_temp"] = dataInfo["min_temp"];
      entry["description"] = dataInfo["weather"]["description"];

      getImages(entry);
    })
    .catch(function () {});
};

const getImages = (entry) => { // get image for the city
  const countryName = entry.country.replace(/ /g, "+");
  fetch(
    `https://pixabay.com/api/?key=${constansts.PIXABAY_API_KEY}&q=${countryName}&image_type=photo&per_page=3`
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(async function (result) {
      const data = result["hits"];
      entry["image"] = data.length > 0 ? data[0].webformatURL : "";

      console.log("entry", entry);
      postData("http://localhost:8080/add", { entry: entry }).then(
        await retrieveData()
      );
    })
    .catch(function () {});
};

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  try {
    const newData = await response.json();
    console.log(newData);
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

const retrieveData = async () => {
  const request = await fetch("http://localhost:8080/all");
  try {
    const data = await request.json();
    localStorage.setItem("trips", JSON.stringify(data));
    drawTrips(data);
    resetFields();
  } catch (error) {
    console.log("error", error);
  }
};

export const drawTrips = (data) => {
  const tripsDiv = document.getElementById("trips");
  tripsDiv.innerHTML = "";

  data.forEach((element) => {
    const card = drawCard(element);
    tripsDiv.appendChild(card);
  });
  document.getElementById("trips").style.display = "inline-block";
};

const drawCard = (data) => {
  const tripDiv = document.createElement("div");
  tripDiv.className = "a-box";

  const imgContainer = drawCardImg(data.image);
  tripDiv.appendChild(imgContainer);

  const cardInfo = drawCardInfo(data);
  tripDiv.appendChild(cardInfo);

  return tripDiv;
};

const drawCardImg = (image) => {
  const imgContainer = document.createElement("div");
  imgContainer.className = "img-container";

  const imgInner = document.createElement("div");
  imgInner.className = "img-inner";

  const innerSkew = document.createElement("div");
  innerSkew.className = "inner-skew";

  const img = document.createElement("img");
  img.src = image;

  innerSkew.appendChild(img);
  imgInner.appendChild(innerSkew);
  imgContainer.appendChild(imgInner);

  return imgContainer;
};

const drawCardInfo = (data) => {
  const infoDiv = document.createElement("text-container");

  const title = document.createElement("h3");
  title.innerHTML = data.country;

  const info = document.createElement("div");
  if (data.min_temp && data.max_temp) {
    info.innerHTML = `Your trip to ${data.country} after ${data.date} will have ${data.description} 
    with max temp ${data.max_temp} and min temp ${data.min_temp}`;
  } else {
    info.innerHTML = `Your trip to ${data.country} after ${data.date} will have ${data.description} 
    with temp ${data.temp}`;
  }

  infoDiv.appendChild(title);
  infoDiv.appendChild(info);
  return infoDiv;
};

const resetFields = () => {
  document.getElementById("city").value = "";
  document.getElementById("travelDate").value = "";
};
