/* Global Variables */
// Personal API Key for OpenWeatherMap API
import { key } from "./constanst";

const apiKey = `${key}&units=imperial`;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

export const generateData = () => {
  const zipCode = document.getElementById("zip").value.trim();
  if (zipCode !== "") {
    getWeather(+zipCode);
  }
};

const getWeather = (zipCode) => {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?zip=" +
      zipCode +
      "&appid=" +
      apiKey
  )
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(async function (data) {
      await setData(data);
    })
    .catch(function () {
      // catch any errors
    });
};

const setData = async (resp) => {
  const temp = resp.main.temp;
  const entry = {
    date: newDate,
    temp: temp,
    feel: document.getElementById("feelings").value.trim()
  };
  postData("http://localhost:8080/add", { entry: entry }).then(
    await retrieveData()
  );
};

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

const retrieveData = async () => {
  const request = await fetch("http://localhost:8080/all");
  try {
    // Transform into JSON
    const allData = await request.json();
    console.log(allData);
    // Write updated data to DOM elements
    document.getElementById("temp").innerHTML =
      Math.round(allData.temp) + " degrees";
    document.getElementById("content").innerHTML = allData.feel;
    document.getElementById("date").innerHTML = allData.date;
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
};
