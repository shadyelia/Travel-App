import { addTrip, drawTrips, setDateLimitions } from "./js/app";

import "./styles/style.scss";

//set date limitions from today to today+16
setDateLimitions();

//set the handler to add button
const generateButton = document.getElementById("Add");
generateButton.addEventListener("click", addTrip);

//get saved trips
const trips = JSON.parse(localStorage.getItem("trips"));
if (trips && trips.length > 0) {
  drawTrips(trips);
}

export { addTrip, drawTrips, setDateLimitions };
