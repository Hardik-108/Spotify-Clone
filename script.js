let currfolder;
let currentSong = new Audio();
async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(
    `https://spotify-clone-one-bice.vercel.app/${folder}/`
  );
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songlist = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  songlist.innerHTML = "";
  for (let song of songs) {
    songlist.innerHTML =
      songlist.innerHTML +
      `<li>
      
      <i class="fa-solid fa-music music-icon"></i>
                <h5 class="song-name">${song.replaceAll(
                  "%20",
                  " ",
                  ".mp3",
                  " "
                )}
                </h5>
                <i class="fa-solid fa-play play-icon"></i>
      
      </li>`;
  }

  // To play each song
  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.getElementsByTagName("h5")[0].innerHTML);
    });
  });
  return songs;
}
// getsongs()
// Function to format time
function formatTime(seconds) {
  // Calculate whole minutes
  const minutes = Math.floor(seconds / 60);

  // Calculate remaining whole seconds
  const secs = Math.floor(seconds % 60);

  // Return time in "00:00" format
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// getsongs();

// to play the Music
function playMusic(songName, pause = false) {
  currentSong.src = `/${currfolder}/` + songName;
  if (!pause) {
    currentSong.play();
    ply.src = "img/pause.svg";
  }
  let title = document.querySelector(".title");
  title.innerHTML = decodeURI(songName);
  document.querySelector(".song-duration").innerHTML = "00:00/00:00";
}
let songs = [];
// To change icon when music is played or paused

let ply = document.getElementById("play");

async function DisplayAlbums() {
  let a = await fetch(`https://spotify-clone-one-bice.vercel.app/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardcontainer = document.querySelector(".card-container");
  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const e = array[i];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      let a = await fetch(
        `https://spotify-clone-one-bice.vercel.app/songs/${folder}/info.json`
      );
      let response = await a.json();
      cardcontainer.innerHTML =
        cardcontainer.innerHTML +
        `<div data-folder="${folder}" class="card">
              <i class="fa-solid fa-play play-bt"></i>
              <img
                src="/songs/${folder}/cover.jpg"
                alt="Album Profile"
              />
              <h3>${response.title}</h3>
              <p> ${response.Artist}</p>
            </div>`;
    }
  }
  Array.from(document.querySelectorAll(".card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}
async function main() {
  // To get the list of all songs
  await getsongs("songs/AnuvJain");
  playMusic(songs[0], true);
  // To Display the Albums
  await DisplayAlbums();
  // To play each song
  ply.addEventListener("click", (element) => {
    if (currentSong.paused) {
      currentSong.play();
      ply.src = "img/pause.svg";
    } else {
      currentSong.pause();
      ply.src = "img/play.svg";
    }
  });

  // Making Previous and next button
  let prev = document.getElementById("Previous");
  prev.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 > length) {
      playMusic(songs[index + 1]);
    }
  });

  // Adding Volume button
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // To add time and duration
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".song-duration").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Making the seekbar active
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
}
document.querySelector(".vol-icon").addEventListener("click", (e) => {
  if (e.target.src.includes("volume.svg")) {
    e.target.src = e.target.src.replace("volume.svg", "mute.svg");
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  } else {
    e.target.src = e.target.src.replace("mute.svg", "volume.svg");
    currentSong.volume = 0.1;
    document
      .querySelector(".range")
      .getElementsByTagName("input")[0].value = 10;
  }
});
// Adding event listener to hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});
// Adding event listener to Close Icon
document.querySelector(".close-icon").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-100%";
});
main();
