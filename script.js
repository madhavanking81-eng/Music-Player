
// ========================================
// VYBE MUSIC PLAYER
// Tamil Songs + Movie Posters + 3D Book
// ========================================

const $ = (id) => document.getElementById(id);

// ========================================
// SONG COLLECTION
// File names must match your actual files
// ========================================

const songs = [
    {
        title: "Aathi",
        artist: "Kathi",
        file: "songs/Aathi.mp3",
        image: "images/Kathi.jpg"
    },
    {
        title: "Ala Bolelo",
        artist: "Tamil Music",
        file: "songs/Ala Bolelo.mp3",
        image: "images/ala.jpg"
    },
    {
        title: "Bindaas",
        artist: "Tamil Music",
        file: "songs/Bindaas.mp3",
        image: "images/bin.jpg"
    },
    {
        title: "Idhazhin Oram",
        artist: "3",
        file: "songs/Idhazhin Oram (The Innocence of Love).mp3",
        image: "images/ida.jpg"
    },
    {
        title: "Kanave Kanave",
        artist: "David",
        file: "songs/Kanave Kanave.mp3",
        image: "images/kan.jpg"
    },
    {
        title: "Kannazhaga",
        artist: "3",
        file: "songs/Kannazhaga (The Kiss of Love).mp3",
        image: "images/kana.jpg"
    },
    {
        title: "Megham Karukatha",
        artist: "Thiruchitrambalam",
        file: "songs/Megham Karukatha.mp3",
        image: "images/meg.jpg"
    },
    {
        title: "Nee Paartha Vizhigal",
        artist: "3",
        file: "songs/Nee Paartha Vizhigal (The Touch of Love).mp3",
        image: "images/nee.jpg"
    },
    {
        title: "One Name",
        artist: "Jailer 2",
        file: "songs/One Name (From Jailer 2).mp3",
        image: "images/one name.jpg"
    },
    {
        title: "One Sun One Moon",
        artist: "Tamil Music",
        file: "songs/One Sun One Moon.mp3",
        image: "images/one sun.jpg"
    },
    {
        title: "Pakkam Vanthu",
        artist: "Kaththi",
        file: "songs/Pakkam Vanthu.mp3",
        image: "images/Kathi.jpg"
    },
    {
        title: "Po Nee Po",
        artist: "3",
        file: "songs/Po Nee Po (Remix - The Scream of Love).mp3",
        image: "images/poo.jpg"
    },
    {
        title: "Udhungada Sangu",
        artist: "VIP",
        file: "songs/Udhungada Sangu.mp3",
        image: "images/udhun.jpg"
    }
];

// ========================================
// ELEMENTS
// ========================================

const audio = $("audioPlayer");

let currentSongIndex = -1;
let isBookOpen = false;

// ========================================
// FORMAT SONG TIME
// ========================================

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// ========================================
// CREATE SONG CARD
// Used on BOTH home and book pages
// ========================================

function createSongCard(song) {
    const index = songs.indexOf(song);

    const card = document.createElement("button");
    card.type = "button";
    card.className = "song-card";
    card.setAttribute("aria-label", `Play ${song.title}`);

    const art = document.createElement("div");
    art.className = "song-card-art";

    const fallback = document.createElement("div");
    fallback.className = "fallback-art";
    fallback.textContent = "♫";

    const img = document.createElement("img");
    img.src = song.image;
    img.alt = `${song.artist} movie poster`;
    img.loading = "lazy";

    img.addEventListener("error", () => {
        img.remove();
        art.classList.add("no-image");
    });

    art.appendChild(fallback);
    art.appendChild(img);

    const title = document.createElement("h3");
    title.className = "song-card-title";
    title.textContent = song.title;

    const artist = document.createElement("p");
    artist.className = "song-card-artist";
    artist.textContent = song.artist;

    card.appendChild(art);
    card.appendChild(title);
    card.appendChild(artist);

    card.addEventListener("click", () => {
        playSong(index);
    });

    return card;
}

// ========================================
// RENDER SONGS ON BOTH PAGES
// ========================================

function renderSongs(list = songs) {
    const grids = [
        $("songGrid"),
        $("bookSongGrid")
    ].filter(Boolean);

    grids.forEach((grid) => {
        grid.innerHTML = "";

        list.forEach((song) => {
            grid.appendChild(createSongCard(song));
        });
    });

    const emptyMessage = $("emptyMessage");

    if (emptyMessage) {
        emptyMessage.hidden = list.length !== 0;
    }
}

// ========================================
// RENDER PLAYLIST INSIDE THE BOOK
// ========================================

function renderPlaylist() {
    const playlist = $("playlist");

    if (!playlist) {
        return;
    }

    playlist.innerHTML = "";

    $("playlistCount").textContent = songs.length;

    songs.forEach((song, index) => {
        const item = document.createElement("button");

        item.type = "button";
        item.className = "playlist-item";

        if (index === currentSongIndex) {
            item.classList.add("active");
        }

        const songName = document.createElement("span");
        songName.textContent = song.title;

        const number = document.createElement("span");
        number.textContent = String(index + 1).padStart(2, "0");

        item.appendChild(songName);
        item.appendChild(number);

        item.addEventListener("click", () => {
            playSong(index);
        });

        playlist.appendChild(item);
    });
}

// ========================================
// UPDATE CURRENT SONG DETAILS
// ========================================

function updateSongInfo() {
    if (currentSongIndex < 0 || !songs[currentSongIndex]) {
        return;
    }

    const song = songs[currentSongIndex];

    $("currentSongTitle").textContent = song.title;
    $("currentArtist").textContent = song.artist;

    const albumArt = $("albumArt");
    const miniArt = $("miniArt");

    albumArt.onerror = () => {
        albumArt.style.display = "none";
        $("fallbackArt").style.display = "grid";
    };

    albumArt.onload = () => {
        albumArt.style.display = "block";
        $("fallbackArt").style.display = "none";
    };

    albumArt.src = song.image;

    miniArt.onerror = () => {
        miniArt.style.visibility = "hidden";
    };

    miniArt.onload = () => {
        miniArt.style.visibility = "visible";
    };

    miniArt.src = song.image;

    $("miniTitle").textContent = song.title;
    $("miniArtist").textContent = song.artist;

    renderPlaylist();
}

// ========================================
// OPEN BOOK
// ========================================

function openBook() {
    $("homePage").hidden = true;
    $("bookPage").hidden = false;

    isBookOpen = false;

    $("musicBook").classList.remove("is-open");

    // Allow the book cover to appear before opening.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            $("musicBook").classList.add("is-open");
            isBookOpen = true;
        });
    });

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}

// ========================================
// RETURN HOME WITH BOOK ANIMATION
// ========================================

function closeBook() {
    if (!isBookOpen) {
        $("bookPage").hidden = true;
        $("homePage").hidden = false;
        return;
    }

    $("musicBook").classList.remove("is-open");
    isBookOpen = false;

    // Wait for the cover to close.
    setTimeout(() => {
        $("bookPage").hidden = true;
        $("homePage").hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }, 1500);
}

// ========================================
// PLAY SONG
// ========================================

async function playSong(index) {
    if (index < 0 || index >= songs.length) {
        return;
    }

    const songChanged = currentSongIndex !== index;

    currentSongIndex = index;

    if (songChanged) {
        audio.src = songs[index].file;
        audio.load();
    }

    updateSongInfo();
    openBook();

    $("miniPlayer").hidden = false;

    try {
        await audio.play();

        $("playButton").textContent = "Ⅱ";
        $("miniPlay").textContent = "Ⅱ";
    } catch (error) {
        $("playButton").textContent = "▶";
        $("miniPlay").textContent = "▶";

        console.warn(
            "Song could not be played. Check the MP3 file path:",
            song.file,
            error
        );
    }

    renderPlaylist();
}

// ========================================
// PLAY / PAUSE
// ========================================

async function togglePlay() {
    if (currentSongIndex === -1) {
        await playSong(0);
        return;
    }

    if (audio.paused) {
        try {
            await audio.play();
        } catch (error) {
            console.warn("Playback failed:", error);
        }
    } else {
        audio.pause();
    }
}

function updatePlayButtons() {
    const symbol = audio.paused ? "▶" : "Ⅱ";

    $("playButton").textContent = symbol;
    $("miniPlay").textContent = symbol;
}

// ========================================
// NEXT / PREVIOUS SONG
// ========================================

function nextSong() {
    if (currentSongIndex === -1) {
        playSong(0);
        return;
    }

    const nextIndex = (currentSongIndex + 1) % songs.length;

    playSong(nextIndex);
}

function previousSong() {
    if (currentSongIndex === -1) {
        playSong(0);
        return;
    }

    // Restart current song if it has played for more than 3 seconds.
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    const previousIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;

    playSong(previousIndex);
}

// ========================================
// SEARCH SONGS
// Both search boxes stay synchronized
// ========================================

function searchSongs(query) {
    const searchTerm = query.trim().toLowerCase();

    const filteredSongs = songs.filter((song) => {
        return (
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm)
        );
    });

    renderSongs(filteredSongs);

    $("searchInput").value = query;
    $("bookSearchInput").value = query;
}

$("searchInput").addEventListener("input", (event) => {
    searchSongs(event.target.value);
});

$("bookSearchInput").addEventListener("input", (event) => {
    searchSongs(event.target.value);
});

// ========================================
// PLAYER EVENT LISTENERS
// ========================================

$("playButton").addEventListener("click", togglePlay);
$("miniPlay").addEventListener("click", togglePlay);

$("nextButton").addEventListener("click", nextSong);
$("miniNext").addEventListener("click", nextSong);

$("previousButton").addEventListener("click", previousSong);
$("miniPrevious").addEventListener("click", previousSong);

$("backButton").addEventListener("click", closeBook);

// ========================================
// PLAYLIST TOGGLE
// ========================================

$("playlistToggle").addEventListener("click", () => {
    const panel = $("playlistPanel");

    panel.hidden = !panel.hidden;
});

// ========================================
// PROGRESS BAR
// ========================================

audio.addEventListener("loadedmetadata", () => {
    $("duration").textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    $("currentTime").textContent = formatTime(audio.currentTime);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        $("progressBar").value =
            (audio.currentTime / audio.duration) * 100;
    } else {
        $("progressBar").value = 0;
    }
});

$("progressBar").addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (Number($("progressBar").value) / 100) * audio.duration;
    }
});

// ========================================
// VOLUME
// ========================================

audio.volume = Number($("volumeBar").value);

$("volumeBar").addEventListener("input", () => {
    audio.volume = Number($("volumeBar").value);
});

// ========================================
// AUDIO PLAYBACK EVENTS
// ========================================

audio.addEventListener("play", updatePlayButtons);
audio.addEventListener("pause", updatePlayButtons);

audio.addEventListener("ended", () => {
    nextSong();
});

audio.addEventListener("error", () => {
    console.warn(
        "Audio file could not be loaded. Check the filename inside the songs folder:",
        currentSongIndex >= 0 ? songs[currentSongIndex].file : ""
    );
});

// ========================================
// INITIALIZE THE WEBSITE
// ========================================

renderSongs();
renderPlaylist();

$("miniPlayer").hidden = true;
$("playlistPanel").hidden = true;

$("progressBar").value = 0;
$("currentTime").textContent = "0:00";
$("duration").textContent = "0:00";

updatePlayButtons();
