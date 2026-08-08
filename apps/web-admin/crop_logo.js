const sharp = require('sharp');

sharp('./public/logo_raw.jpg')
  .trim()
  .toFile('./public/logo.png')
  .then(info => console.log('Cropped new logo.png created:', info))
  .catch(err => console.error('Error processing logo:', err));
