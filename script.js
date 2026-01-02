console.log("Writing javascript");

let currentsong=new Audio();

function secondsToMinutes(seconds) {
  if (isNaN(seconds)) return "00:00";

  seconds = Math.floor(seconds); // 👈 FIX HERE

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0")
  );
}


async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  console.log(as);
  let songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1])
    }
  }
  return songs;
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
  currentsong.src="songs/"+track
  if(!pause){
  currentsong.play()
  play.src="pause.svg"
  }
  document.querySelector(".songinfo").innerHTML=cleanSongName(track)
  document.querySelector(".songtime").innerHTML="00:00/00:00"
}

async function main() {
  //get list of all songs
  let songs = await getsongs();
  playmusic(songs[0],true);
  console.log(songs);

  songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
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

}
  main();

