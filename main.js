const modal = document.getElementById("videoModal");
const span = document.getElementById("close");
const modalIframe = document.getElementById("modalIframe");

function modalHandler(element, videoUrl, username) {
  modal.style.display = "block";
  const URL = videoUrl;
  const user = username;
  modalIframe.setAttribute("src", URL);
  //
  axios
    .get(`https://www.aparat.com/etc/api/profile/username/${user}`)
    .then((res) => {
      const profileName = res.data.profile.name;
      const profilepicture = res.data.profile.pic_m;
      const text = document.getElementById("profileName");
      const img = document.getElementById("profilePic");
      text.innerText = profileName;
      img.setAttribute("src", profilepicture);
    });
}
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
// let videos = JSON.parse(localStorage.getItem('videoCounts'));
let videos = [];
function SearchVideos() {
  const inputVal = document.getElementById("search").value;
  const videoPart = document.getElementById("videoPart");
  var child = videoPart.lastElementChild;
  while (child) {
    videoPart.removeChild(child);
    child = videoPart.lastElementChild;
  }
  axios
    .get(
      `https://www.aparat.com/etc/api/videoBySearch/text/${inputVal}/perpage/6/curoffset/${skip}`
    )
    .then((res) => {
      console.log(res);
      for (let i = 0; i <= 5; i++) {
        const videoPart = document.getElementById("videoPart");
        const parentDiv = document.createElement("div");
        parentDiv.setAttribute("class", "box");
        parentDiv.setAttribute("id", `box${i}`);
        const parag = document.createElement("p");
        parag.setAttribute("id", `p${i}`);
        parentDiv.appendChild(parag);
        var iframe = document.createElement("iframe");
        iframe.setAttribute("class", "inner-box");
        iframe.setAttribute("id", `innerBox${i}`);
        let videoUrl = res.data.videobysearch[i].frame;
        let username = res.data.videobysearch[i].username;
        let videoId = res.data.videobysearch[i].uid;
        iframe.setAttribute("src", videoUrl);
        parag.innerText = username;
        parentDiv.appendChild(iframe);
        videoPart.insertAdjacentElement("afterbegin", parentDiv);
        iframe.setAttribute("data-id", videoId);
        iframe.addEventListener("mouseover", () => {
          document.getElementById(`innerBox${i}`).style.display = "none";
        });
        parentDiv.addEventListener("mouseleave", () => {
          document.getElementById(`innerBox${i}`).style.display = "block";
        });
        parentDiv.addEventListener("click", () => {
          const thisElement = document.getElementById(`innerBox${i}`);
          modalHandler(thisElement, videoUrl, username);
        });
        
        videos.push({videoId ,counter:0});
        
        parentDiv.addEventListener("click", () => {
          const thisElement = document.getElementById(`innerBox${i}`);
          const dataId = thisElement.getAttribute("data-id");
          const result = videos.filter((obj) =>(obj.videoId == dataId));
          const isDataExist = result.length > 0 ? true : false;
          const index = videos.findIndex((obj) =>(obj.videoId == dataId) )
          if (isDataExist) {
            videos[index].counter = videos[index].counter + 1 ;
          } else {
            videos.push({videoId:dataId ,counter:1})
          }
          const videoCounts = localStorage.getItem("videoCounts");
          if (!videoCounts) {
            localStorage.setItem("videoCounts", JSON.stringify(videos));
          }
          localStorage.setItem("videoCounts", JSON.stringify(videos));
          const visit = document.getElementById("visit");
          visit.innerHTML= videos[index].counter ;
        });
      }
      console.log(videos);
    });
}
var skip = 0;
var currentPage = 1;
function nextPageHandler() {
  skip = skip + 6;
  currentPage = currentPage + 1;
  SearchVideos();
}
function prevPageHandler() {
  skip = skip - 6;
  currentPage = currentPage - 1;
  SearchVideos();
}
