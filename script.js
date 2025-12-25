console.log("Writing javascript");

let currentsong=new Audio();

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

const playmusic=(track)=>{
  // let audio=new Audio("songs/"+track)
  currentsong.src="songs/"+track
  currentsong.play()
  play.src="pause.svg"
  document.querySelector(".songinfo").innerHTML=cleanSongName(track)
  document.querySelector(".songtime").innerHTML="00:00/00:00"
}

async function main() {
  //get list of all songs
  let songs = await getsongs();
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

}
  main();

