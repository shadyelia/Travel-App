import { generateData } from "./js/app";

import "./styles/style.scss";

const generateButton = document.getElementById("Add");
generateButton.addEventListener("click", generateData);
