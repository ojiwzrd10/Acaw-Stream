const API_URL = 'https://raw.githubusercontent.com/ojiwzrd10/iptv/refs/heads/main/id.json';
const container = document.getElementById('channelContainer');
const searchInput = document.getElementById('searchInput');
const playerContainer = document.getElementById('playerContainer');
const closePlayerBtn = document.getElementById('closePlayer');
const videoElement = document.getElementById('iptvPlayer');

let player = null;
let channels = [];

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    channels = data;
    renderChannels(channels);
  });

function renderChannels(list) {
  container.innerHTML = '';
  list.forEach(channel => {
    const div = document.createElement('div');
    div.className = 'channel';
    div.innerHTML = `<strong>${channel.name}</strong>`;
    div.onclick = () => {
      const url = channel.iptv_urls?.[0];
      if (url) {
        playChannel(url);
      } else {
        alert('Stream tidak tersedia');
      }
    };
    container.appendChild(div);
  });
}

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = channels.filter(ch =>
    ch.name.toLowerCase().includes(keyword)
  );
  renderChannels(filtered);
});
function playChannel(url) {
  if (player) {
    player.dispose();
    player = null;
  }

  // Hapus elemen video lama (jika ada)
  const oldVideo = document.getElementById('iptvPlayer');
  if (oldVideo) {
    oldVideo.remove();
  }

  // Buat ulang elemen video
  const newVideo = document.createElement('video');
  newVideo.id = 'iptvPlayer';
  newVideo.className = 'video-js vjs-default-skin';
  newVideo.setAttribute('controls', '');
  newVideo.setAttribute('autoplay', '');
  newVideo.setAttribute('playsinline', '');
  newVideo.setAttribute('preload', 'auto');
  playerContainer.appendChild(newVideo);

  // Inisialisasi player baru
  player = videojs('iptvPlayer', {
    sources: [{ src: url, type: 'application/x-mpegURL' }],
    autoplay: true,
    controls: true,
    fluid: true
  });

  player.on('error', () => {
    alert('Gagal memuat channel. Coba lagi.');
  });

  playerContainer.classList.remove('hidden');
}

closePlayerBtn.addEventListener('click', () => {
  if (player) {
    player.pause();
    player.dispose();
    player = null;
  }

  const video = document.getElementById('iptvPlayer');
  if (video) {
    video.remove();
  }

  playerContainer.classList.add('hidden');
});
  
