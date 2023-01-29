import { generateData } from "./js/app";

import "./styles/style.scss";

const generateButton = document.getElementById("generate");
generateButton.addEventListener("click", generateData);
