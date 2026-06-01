import fs from 'fs';
import https from 'https';

const url = "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc84ddce.mp3?filename=film-special-effects-sound-1-167181.mp3";

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://pixabay.com/',
  }
};

https.get(url, options, (res) => {
  if (res.statusCode === 200 || res.statusCode === 206) {
    const file = fs.createWriteStream('apps/user-website/public/sounds/slide.mp3');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download complete.');
    });
  } else {
    console.log(`Failed. Status Code: ${res.statusCode}`);
  }
}).on('error', (err) => {
  console.log(`Error: ${err.message}`);
});
