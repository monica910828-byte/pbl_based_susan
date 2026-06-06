const { Jimp } = require('jimp');

async function removeBackground(inputPath, outputPath) {
  const image = await Jimp.read(inputPath);
  const targetColor = { r: 255, g: 255, b: 255, a: 255 }; // White background
  const distance = (c1, c2) => {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  };
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Check if color is close to white (tolerance)
    if (distance({r, g, b}, targetColor) < 40) {
      this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
    }
  });

  await image.write(outputPath);
  console.log('Background removed:', outputPath);
}

const args = process.argv.slice(2);
if (args.length >= 2) {
  removeBackground(args[0], args[1]);
}
