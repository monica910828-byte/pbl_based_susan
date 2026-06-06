const https = require('https');
const fs = require('fs');
const path = require('path');

const files = [
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/oedipus_wizball_highscore.mp3', dest: 'public/audio/bgm_intro.mp3' },
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', dest: 'public/audio/bgm_game.mp3' },
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/tech/bass.mp3', dest: 'public/audio/bgm_ending.mp3' },
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/SoundEffects/p-ping.mp3', dest: 'public/audio/sfx_move.mp3' },
  { url: 'https://actions.google.com/sounds/v1/crowds/applause.ogg', dest: 'public/audio/sfx_applause.ogg' },
];

async function download() {
  for (const file of files) {
    const destPath = path.resolve(__dirname, file.dest);
    console.log(`Downloading ${file.url} to ${destPath}...`);
    await new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(destPath);
      https.get(file.url, (response) => {
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
