const https = require('https');
const fs = require('fs');
const path = require('path');

const files = [
  // Calm music for pre-test (Step 2~5)
  { url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3', dest: 'public/audio/bgm_intro.mp3' },
  // Cute/feminine music for game (Step 6)
  { url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Life%20of%20Riley.mp3', dest: 'public/audio/bgm_game.mp3' },
  // Ending music (Step 7)
  { url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Feelin%20Good.mp3', dest: 'public/audio/bgm_ending.mp3' },
];

async function download() {
  for (const file of files) {
    const destPath = path.resolve(__dirname, file.dest);
    console.log(`Downloading ${file.url} to ${destPath}...`);
    await new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(destPath);
      https.get(file.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          // Handle redirect
          https.get(response.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            res.pipe(fileStream);
            res.on('end', resolve);
          });
          return;
        }
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });
  }
  console.log('All downloads completed!');
}

download().catch(console.error);
