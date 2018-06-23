let config = require('./config')
let utils = require('./utils')
let combine = require('./combine')

let {loadImage} = require('canvas')

async function task () {
  let bgImage = await loadImage(config.bgImage)
  config.xgap = 50
  config.ygap = 50
  return combine.placeImages(10, bgImage, config)
}

task().then(() => {
  console.log('Done')
}).catch(err => {
  console.log(err)
})