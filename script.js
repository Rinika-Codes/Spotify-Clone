console.log("Writing javascript");

let currentsong=new Audio();
let songs;
let currFolder;

function secondsToMinutes(seconds) {
  if (isNaN(seconds)) return "00:00";

  seconds = Math.floor(seconds); 

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0")
  );
}


async function getsongs(folder) {
  currFolder=folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  console.log(as);
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }
   songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
   songUL.innerHTML=""
  for (const song of songs) {
    songUL.innerHTML += `
<li data-song="${song}">
  <img class="invert" src="music.svg" alt="">
  <div class="info">
    <div>${cleanSongName(song)}</div>
    <div>Artist Name</div>
  </div>
  <div class="playnow">
    <span>Play Now</span>
    <img class="invert" src="play.svg" alt="">
  </div>
</li>`;


  }

  Array.from(document.querySelector(".songlist").getElementsByTagName("li"))
  .forEach(e => {
    e.addEventListener("click", () => {
      playmusic(e.dataset.song);
    });
  });

  return songs
}

function cleanSongName(song) {
  const removePatterns = [
    "320kbps",
    "%2C",
    "%5Bn2dVFdqMYGA%5D",
    "CeeNaija.com",
    "218319",
    "www.",
    ".com",
  ];

  removePatterns.forEach(pattern => {
    song = song.replaceAll(pattern, "");
  });

  song = song
    .replaceAll("%20", " ")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replaceAll(".mp3", "");

  song = song.replace(/\s+/g, " ").trim();
  song = song.replace(/\b\w/g, c => c.toUpperCase());

  return song;
}

const playmusic=(track,pause=false)=>{
  // let audio=new Audio("songs/"+track)
  currentsong.src=`/${currFolder}/`+track
  // currentsong.load()
  if(!pause){
  currentsong.play()
  play.src="pause.svg"
  }
  document.querySelector(".songinfo").innerHTML=cleanSongName(track)
  document.querySelector(".songtime").innerHTML="00:00/00:00"
}

async function displayAlbums() {
  let res = await fetch("http://127.0.0.1:5500/songs/");
  let text = await res.text();

  let div = document.createElement("div");
  div.innerHTML = text;

  let links = div.querySelectorAll("a.icon-directory");
  let cardcontainer = document.querySelector(".card-container");

  for (let a of links) {
    let nameSpan = a.querySelector(".name");
    if (!nameSpan) continue;

    let folder = nameSpan.innerText.trim(); 

    try {
      let infoRes = await fetch(`/songs/${folder}/info.json`);
      let info = await infoRes.json();

      cardcontainer.innerHTML += `
  <div class="card" data-folder="${folder}">
    <div class="play">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
           width="40" height="40" fill="black">
        <path d="M18.89 12.846c-.353 1.343-2.023 2.292-5.364 4.19
                 -3.23 1.835-4.845 2.753-6.146 2.384
                 -.538-.153-1.028-.442-1.423-.841
                 -.956-.965-.956-2.836-.956-6.579
                 0-3.743 0-5.614.956-6.579
                 .395-.399.885-.688 1.423-.841
                 1.301-.369 2.916.549 6.146 2.384
                 3.341 1.898 5.011 2.847 5.364 4.19
                 .146.554.146 1.137 0 1.691z"/>
      </svg>
    </div>

    <img src="/songs/${folder}/cover.jpg" alt="">
    <h2>${info.title}</h2>
    <p>${info.description}</p>
  </div>
`;

    } catch (err) {
      console.error("Failed to load album:", folder);
    }
  }

  //event to card
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async items=>{
      songs = await getsongs(`songs/${items.currentTarget.dataset.folder}`);
      playmusic(songs[0]);
    })
  })
}


// async function displayAlbums(){
//   let a = await fetch('http://127.0.0.1:5500/songs/');
//   let response = await a.text();
//   let div = document.createElement("div")
//   div.innerHTML = response;
//   console.log(div)
//   let anchors=div.getElementsByTagName("a")
//   let cardcontainer=document.querySelector(".card-container")
//   Array.from(anchors).forEach(async e=>{
//     if(e.href.includes("/songs")){
//       let folder=(e.href.split("/").slice(-2)[0]);
//       let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
//       let response = await a.json();
//       cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
//                         <div class="play">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"
//                                 fill="#000">
//                                 <path
//                                     d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
//                                     stroke="black" stroke-width="1.5" stroke-linejoin="round" />
//                             </svg>
//                         </div>
//                         <img src="/songs/${folder}/cover.jpg" alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>
// `
//     }
//   })
// }

async function main() {
  //get list of all songs
  await getsongs("songs/ncs");
  playmusic(songs[0],true);
  console.log(songs);

 //display albums
 displayAlbums()

  play.addEventListener("click",()=>{
    if(currentsong.paused){
      currentsong.play()
      play.src="pause.svg"
    }else{
      currentsong.pause()
      play.src="play.svg"
    }
  })
  // listen for timeupdate event
  currentsong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML=`${secondsToMinutes(currentsong.currentTime)}/${secondsToMinutes(currentsong.duration)}`
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";
  })
  //adding eventlistener to seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=percent+"%";
    currentsong.currentTime=(currentsong.duration*percent)/100;
  })

  //adding eventlistener for hamburger
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";
  })

  //adding eventlistener for close button
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%";
  })

  //adding event listener to previous and next
  previous.addEventListener("click",()=>{
    console.log(currentsong);
    console.log(songs);
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index-1)>=0)
    playmusic(songs[index-1]);
  })
  next.addEventListener("click",()=>{
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index+1)<songs.length)
    playmusic(songs[index+1]);
  })

  //adding event listener to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentsong.volume=parseInt(e.target.value)/100
  })
  
  //add event to vol
  document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
      e.target.src=e.target.src.replace("volume.svg","mute.svg")
      currentsong.volume=0;
      document.querySelector(".range").getElementsByTagName("input")[0].value=0
    }else{
      e.target.src=e.target.src.replace("mute.svg","volume.svg")
      currentsong.volume=.10;
      document.querySelector(".range").getElementsByTagName("input")[0].value=10
    }
  })

}
  main();

