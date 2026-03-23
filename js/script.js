console.log("Spotify Clone Running 🚀");

let currentsong = new Audio();
let currentPlaylist = [];
let currentIndex = 0;

// 🎵 PLAYLIST DATA 
const playlists = [
  {
    name: "Punjabi Songs",
    cover: "https://res.cloudinary.com/dqenjnk8x/image/upload/v1774240506/cover_wswlxv.webp", 
    songs: [
      {
        name: "Aari Aari Dhurandhar",
        url: "https://res.cloudinary.com/dqenjnk8x/video/upload/v1774240523/Aari_Aari_Dhurandhar_The_Revenge_ljalex.mp3"
      },
      {
        name: "Good Luck Charm",
        url:" https://res.cloudinary.com/dqenjnk8x/video/upload/v1774240482/Good_Luck_Charm_-_K_S_Makhan_ogizgc.mp3"
      },
      {
        name:"Gallan 4",
        url:"https://res.cloudinary.com/dqenjnk8x/video/upload/v1774240510/Gallan_4_-_Talwiinder_Mr-Punjab.Com_wvaoqp.mp3"
      }
    ]
  },
  {
    name: "Angry Mood",
    cover: "https://res.cloudinary.com/dqenjnk8x/image/upload/v1774240478/cover_xapn54.jpg", 
    songs: [
      {
        name: "Standing Next to You",
        url: "https://res.cloudinary.com/dqenjnk8x/video/upload/v1774240493/Jungkook_-_Standing_Next_to_You_Usher_Remix__mp3.pm_valfyo.mp3"
      },
      {
        name: "Dhan Te nan",
        url:"https://res.cloudinary.com/dqenjnk8x/video/upload/v1774242363/Dhan_Te_Nan_Remix_Kaminey_Fmw11.com_i8sdcg.mp3"
      }
    ]
  }
];

// ⏱️ Time format
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// 🎧 Load playlists (cards)
function loadPlaylists() {
  let container = document.querySelector(".cardcontainer");
  container.innerHTML = "";

  playlists.forEach((playlist, index) => {
    container.innerHTML += `
      <div class="card rounded m-1" data-index="${index}">
        <img src="${playlist.cover}" alt="cover">
        <h2>${playlist.name}</h2>
        <p>${playlist.songs.length} songs</p>
      </div>`;
  });

  // Click playlist
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      let index = card.dataset.index;
      loadSongs(index);
    });
  });
}

// 🎵 Load songs in sidebar
function loadSongs(playlistIndex) {
  currentPlaylist = playlists[playlistIndex].songs;
  let songUL = document.querySelector(".songlist ul");
  songUL.innerHTML = "";

  currentPlaylist.forEach((song, index) => {
    songUL.innerHTML += `
      <li data-index="${index}">
        <img class="invert" src="./assets/music.svg">
        <div class="info">
          <div>${song.name}</div>
          <div>Saksham</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="./assets/play.svg">
        </div>
      </li>`;
  });

  document.querySelectorAll(".songlist li").forEach(li => {
    li.addEventListener("click", () => {
      currentIndex = li.dataset.index;
      playMusic(currentIndex);
    });
  });
}

// ▶️ Play song
function playMusic(index) {
  currentsong.src = currentPlaylist[index].url;
  currentsong.play();
  play.src = "./assets/pause.svg";

  document.querySelector(".songinfo").innerHTML =
    currentPlaylist[index].name;
}

// 🎯 MAIN
function main() {
  loadPlaylists();

  // ▶️ Play / Pause
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "./assets/pause.svg";
    } else {
      currentsong.pause();
      play.src = "./assets/play.svg";
    }
  });

  // ⏱️ Time update
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${formatDuration(currentsong.currentTime)} / ${formatDuration(currentsong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // 📍 Seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  // 🔊 Volume
  document.querySelector("#volumebar").addEventListener("input", e => {
    currentsong.volume = e.target.value / 100;
  });

  // ⏭️ Next
  next.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % currentPlaylist.length;
    playMusic(currentIndex);
  });

  // ⏮️ Previous
  previous.addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + currentPlaylist.length) %
      currentPlaylist.length;
    playMusic(currentIndex);
  });

  // 🍔 Mobile menu
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-115%";
  });
}

main();