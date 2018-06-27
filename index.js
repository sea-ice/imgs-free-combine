let config = require('./config')
let utils = require('./utils')
let combine = require('./combine')

let {loadImage} = require('canvas')

async function allTasks () {
  let bgImage = await loadImage(config.bgImage)
  config.xgap = 50
  config.ygap = 50

  let {
    width,
    height
  } = bgImage
  let {
    areaTop, 
    areaBottom, 
    areaLeft, 
    areaRight
  } = config
  task([
    [[areaLeft, areaTop], [width - areaRight, height - areaBottom]]
  ], bgImage, 100).then(() => {
    return task([
      [[areaLeft, areaTop], [areaLeft + (width - areaRight - areaLeft) / 2, height - areaBottom]],
      [[areaLeft + (width - areaRight - areaLeft) / 2, areaTop], [width - areaRight, height - areaBottom]]
    ], bgImage, 700)
  }).then(() => {
    return task([
      [[areaLeft, areaTop], [areaLeft + (width - areaRight - areaLeft) / 2, areaTop + (height - areaBottom - areaTop) / 2]],
      [[areaLeft, areaTop + (height - areaBottom - areaTop) / 2], [areaLeft + (width - areaRight - areaLeft) / 2, height - areaBottom]],
      [[areaLeft + (width - areaRight - areaLeft) / 2, areaTop], [width - areaRight, height - areaBottom]]
    ], bgImage, 1200)
  }).then(() => {
    return task([
      [[areaLeft, areaTop], [areaLeft + (width - areaRight - areaLeft) / 2, areaTop + (height - areaBottom - areaTop) / 2]],
      [[areaLeft, areaTop + (height - areaBottom - areaTop) / 2], [areaLeft + (width - areaRight - areaLeft) / 2, height - areaBottom]],
      [[areaLeft + (width - areaRight - areaLeft) / 2, areaTop], [width - areaRight, areaTop + (height - areaBottom - areaTop) / 2]],
      [[areaLeft + (width - areaRight - areaLeft) / 2, areaTop + (height - areaBottom - areaTop) / 2], [width - areaRight, height - areaBottom]]
    ], bgImage, 2000)
  }).then(() => {
    console.log('Done')
  }).catch(err => {
    console.log(err)
  })
}

async function task (areas, bgImage, count) {
  config.areas = areas

  return combine.placeImages(count, bgImage, config)
}

allTasks()