import sharp from 'sharp'
import Path from 'path'
import config from 'config'

const pathConfig = config.get('path')
const trim_size = 300
//const small_size = 64

const convertImage = (img_path) => {

  const img = sharp(img_path)

  return img
    .metadata()
    .then(metadata => {
      const width = metadata.width
      const height = metadata.height

      return img.extract({
        left: (width - trim_size)/2,
        top: (height - trim_size)/2,
        width: trim_size,
        height: trim_size
      })
    })
    .then(img => {
      const basename = Path.basename(img_path)

      const promise1 = img
        .toFile(Path.join(pathConfig.publicImages, basename), (err, info) => {
          if (err) { throw err }
        })
//      const promise2 = img.resize(small_size, small_size)
      const promise2 = img
        .toFile(Path.join(pathConfig.query, basename), (err, info) => {
          if (err) { throw err }
        })

      return Promise.all([promise1, promise2])
    })
}

module.exports.convert = convertImage
