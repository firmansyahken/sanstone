const main_content = document.querySelector(".main_content")
const music_player = document.querySelector(".music_player_content")
const cover = document.getElementById("cover")
const title = document.getElementById("title")
const button_control = document.getElementById("button_control")
const button_back = document.getElementById("button_back")
const button_next = document.getElementById("button_next")
const keyword = document.getElementById("keyword")
const music_bar = document.getElementById("bar")

let music_data = []
var music = new Audio;
var playing = false;
var playTrack;
var idMusic;

window.document.body.style.overflowY = "hidden"

function infoClose() {
    document.querySelector(".info_section").style.opacity = 0
    document.querySelector(".info_section").style.transition = "ease 1000ms"
    setTimeout(function() { 
        document.querySelector(".info_section").style.display ="none" 
        window.document.body.style.overflowY = "scroll"
    }, 1000)
}

async function getData() {
    let fetchData = await fetch("db.json")
    let response =  await fetchData.json()
    music_data = response.data
    renderData(response.data)
}

getData()

function searchData() {
    let value = keyword.value.toLowerCase()
    let res = music_data.filter(m => {
        return(m.title.toLowerCase().includes(value))
    })
    renderData(res)
}

keyword.addEventListener("keyup", searchData)

function renderData(data) {
    let template = data.map((music, index) => {
        return `<div class="post" data-id="${music.id}" onclick="playMusic(${music.id})">
                    <img src="${music.cover}">
                    <p>${music.title}</p>
                </div>`
    }).join(" ")

    main_content.innerHTML = template

}


function playMusic(id_music) {
    music_bar.value = 0
    let id = parseInt(id_music)
    document.querySelectorAll(".post").forEach(post => post.classList.remove("active"))
    document.querySelector(`[data-id="${id_music}"]`).classList.add("active")
    let data = music_data.filter(music => {return music.id === id})
    data.map(m => {
        src = m.src
        cover.setAttribute("src", m.cover)
        title.innerText = m.title
        return src
    })

    if(playing) {
        if(playTrack != src) {
            playing = true
            music.src = src
            cover.classList.add("active")
            button_control.setAttribute("class", "fa fa-pause")
            music.play()
        } else {
            music.pause()
            cover.classList.remove("active")
            button_control.setAttribute("class", "fa fa-play")
            playing = false
        }
    } else {
        playing = true
        button_control.setAttribute("class", "fa fa-pause")
        cover.classList.add("active")

        if(playTrack != src) {
            playing = true
            music.src = src
        }
        music.play()
    }

    button_next.addEventListener("click", nextMusic)
    button_back.addEventListener("click", prevMusic)

    playTrack = src
    idMusic = id

}

button_control.addEventListener("click", function() {
    playMusic(idMusic)
})

music_bar.addEventListener("input", changeDuration)
music.addEventListener("timeupdate", updateDurationMusic)

function changeDuration() {
    let durationMusicNow = music.duration * (music_bar.value / 100)
    music.currentTime = durationMusicNow
}

function updateDurationMusic() {
    let newDuration = music.currentTime * (100 / music.duration)
    music_bar.value = newDuration;
}

function stopMusic() {
    button_control.setAttribute("class", "fa fa-play")
    cover.classList.remove("active")
}

function nextMusic() {
    try {
        music_bar.value = 0
        let index = idMusic + 1
        playMusic(index)
    } catch (error) {
        stopMusic()
    }
}

function prevMusic() {
    try {
        music_bar.value = 0
        let index = idMusic - 1
        playMusic(index)
    } catch (error) {
        stopMusic()
    }
}

music.addEventListener("ended", function() {
    music_bar.value = 0
    try {
        let index = idMusic + 1
        playMusic(index)
    } catch (error) {
        return stopMusic()
    } 

})
