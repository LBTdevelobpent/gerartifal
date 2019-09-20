const sharp = require('sharp');

exports.compressImage = (file, sizeX, sizeY) => {
  return sharp(file.path)
    .resize(sizeX, sizeY)
    .toFormat('webp')
    .webp({
      quality: 50,
    })
    .toBuffer()
    .then((data) => { return data; });
};
