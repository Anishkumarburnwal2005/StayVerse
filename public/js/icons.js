let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () => {
  //console.log("Button was clicked");
  let taxtInfo = document.getElementsByClassName("GST");
  //console.log(taxtInfo)
  for (info of taxtInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});

let rightAngle = document.querySelector(".rightAngle");
let leftAngle = document.querySelector(".leftAngle");
let allIcons = document.getElementById("filters");

rightAngle.addEventListener("click", () => {
  // console.log("hello");
  allIcons.scrollBy({ left: 150, behavior: "smooth" });
});

leftAngle.addEventListener("click", () => {
  //console.log("hello");
  allIcons.scrollBy({ left: -150, behavior: "smooth" });
});
