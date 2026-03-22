

console.log('lets write javascript');
let currentsong = new Audio()
let currentfolder;

function formatDuration(seconds) {
     if (!seconds || isNaN(seconds)) {
        return "00:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return String(mins).padStart(2, '0') + ':' +
        String(secs).padStart(2, '0');
}


async function getsongs(folder) {
    currentfolder=folder;
    let a = await fetch(`http://127.0.0.1:3002/songs/${currentfolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`%5C${currentfolder}%5C`)[1]);
        }

    }

    
    // show all the songs in the playlist

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li>
                        <img class="invert" src="assets/music.svg" alt="music">
                         <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>Saksham</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="assets/play.svg" alt="play">
                        </div> </li>`;

    }

    //add event listener to the songs..
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(li => {

        

        li.addEventListener("click", element => {

       
            playmusic(li.querySelector(".info").firstElementChild.innerHTML.trim())



        })
    }


    )

 return songs;
    


}

const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/songs/${currentfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "assets/pause.svg"
    }



    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    

}

async function displayAlbums(params) {

    let a = await fetch(`http://127.0.0.1:3002/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName('a');
let cardcontainer = document.querySelector(".cardcontainer")

    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
    
    
       
        
        if(e.href.includes("songs%")){
           let folder  =  e.href.split("%5C").slice(-1)[0].split("/").slice(-2)[0];
            console.log(folder);
           
            //get the metadata of folder
             let a = await fetch(`http://127.0.0.1:3002/songs/${folder}/info.json`);
            let response = await a.json();

         cardcontainer.innerHTML = cardcontainer.innerHTML + `  <div data-folder="${folder}" class="card rounded m-1">



                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30"
                            color="currentColor" fill="currentColor" stroke="currentColor" stroke-width="1.5"
                            stroke-linejoin="round">
                            <path
                                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" />
                        </svg>



                        <img src="/songs/${folder}/cover.jpg"
                            alt="song cover">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>


                    </div>`
            


            
        }
    }



        Array.from(document.getElementsByClassName("card")).forEach(e => {
       
        
        e.addEventListener("click" , async item =>{
   
            
             songs = await getsongs(`${item.currentTarget.dataset.folder}`);
            playmusic(songs[0])
            
        })
    })

    
    
    
}


async function main() {
    //get al the songs..
    await getsongs("ncs");
   

    playmusic(songs[0], true)


    //add play , pause and previous function to buttons

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "assets/pause.svg"

        }
        else {
            currentsong.pause()
            play.src = "assets/play.svg"
        }
    })

    displayAlbums();







    //update time duration 
    currentsong.addEventListener("timeupdate", () => {
        
        document.querySelector(".songtime").innerHTML = `${formatDuration(currentsong.currentTime)} / ${formatDuration(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"

    })
    //add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        
        document.querySelector(".circle").style.left = percent + "%"

        currentsong.currentTime = (currentsong.duration) * percent / 100


    })

    // hamburger functionality
    document.querySelector(".hamburger").addEventListener("click", () => {

        document.querySelector(".left").style.left = 0 + "%"

    })

    document.querySelector(".close").addEventListener("click", () => {

        document.querySelector(".left").style.left = -115 + "%"

    })

    //play and previous functionality


    previous.addEventListener("click", () => {
          let current = decodeURI(currentsong.src.split("/").pop());
    let index = songs.findIndex(song => decodeURI(song) === current);
        if((index - 1) >= 0){
            playmusic(songs[index-1])
        }
           

    })

    next.addEventListener("click", () => {

           let current = decodeURI(currentsong.src.split("/").pop());
    let index = songs.findIndex(song => decodeURI(song) === current);
        if((index + 1) < songs.length){
            playmusic(songs[index+1])
        }
        
    
          


    })

    //fucntionality of volume bar
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , e=>{
        console.log("setting volume to ", e.target.value/100);

        currentsong.volume = parseInt(e.target.value)/100
        


    })

    // //selecting playlist and showing the songs..
   
    // Array.from(document.getElementsByClassName("card")).forEach(e => {
       
        
    //     e.addEventListener("click" , async item =>{
   
            
    //          songs = await getsongs(`${item.currentTarget.dataset.folder}`);
            
    //     })
    // })






    //duration

    currentsong.addEventListener("loadeddata", () => {

       

        // The duration variable now holds the duration (in seconds) of the audio clip
    });


    //add event listener to mute the volume

    document.querySelector(".vol>img").addEventListener("click" , e =>{
      

        if(e.target.src.includes("assets/volume.svg")){
            e.target.src =  e.target.src.replace("assets/volume.svg", "assets/mute.svg");
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0

        }
        else{
             e.target.src = e.target.src.replace("assets/mute.svg", "assets/volume.svg");
             document.querySelector(".range").getElementsByTagName("input")[0].value = 10
            currentsong.volume = 0.10;

        }
    })

}



main();