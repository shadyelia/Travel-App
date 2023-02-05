import * as constansts from "./constansts";

var today = new Date().toISOString().split("T")[0];
document.getElementById("travelDate").setAttribute("min", today);

export const generateData = () => {
  const cityName = document.getElementById("city").value.trim();
  if (cityName !== "") {
    getCityInfo(cityName);
  }
};

const getCityInfo = (cityName) => {
  fetch(
    `http://api.geonames.org/postalCodeSearchJSON?placename=${cityName}&maxRows=1&username=${constansts.USER_NAME}`
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      setData(data["postalCodes"][0]);
    })
    .catch(function () {});
};

const setData = (data) => {
  const selectDate = new Date(document.getElementById("travelDate").value);
  const todayDate = new Date();
  const differenceInTime = selectDate - todayDate;
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  const cityName = document.getElementById("city").value.trim();

  const entry = {
    latitude: data["lat"],
    longitude: data["lng"],
    country: cityName,
    date: differenceInDays
  };
  getWeathInfo(entry);
};

const getWeathInfo = (entry) => {
  fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?lat=${entry.latitude}&lon=${entry.longitude}&days=${entry.date}&key=${constansts.WEATHERBIT_API_KEY}`
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (result) {
      const data = result["data"];
      const dataInfo = data[entry.date - 1];
      entry["max_temp"] = dataInfo["max_temp"];
      entry["min_temp"] = dataInfo["min_temp"];
      entry["description"] = dataInfo["weather"]["description"];
      entry["country_code"] = dataInfo["weather"]["country_code"];

      getImages(entry);
    })
    .catch(function () {});
};

const getImages = (entry) => {
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
    const tripsDiv = document.getElementById("trips");
    tripsDiv.innerHTML = "";
    
    data.forEach((element) => {
      const card = drawCard(element);
      tripsDiv.appendChild(card);
    });
    document.getElementById("trips").style.display = "inline-block";
  } catch (error) {
    console.log("error", error);
  }
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
  info.innerHTML = `Your trip to ${data.country} after ${data.date} will have ${data.description} 
    with max temp ${data.max_temp} and min temp ${data.min_temp}`;
  
  infoDiv.appendChild(title);
  infoDiv.appendChild(info);
  return infoDiv;
};
