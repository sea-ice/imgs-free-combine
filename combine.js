let fs = require('fs')
let path = require('path')
let utils = require('./utils')
let {createCanvas, loadImage} = require('canvas')

/**
 * 
 * @param {*} n 表示组合生成的图的数量
 */
async function placeImages (n, bgImage, config) {
  let {width, height} = bgImage
  let canvas = createCanvas(width, height)
  let ctx = canvas.getContext('2d')

  let imgDir = utils.resolve(config.composeDir)
  let files = fs.readdirSync(imgDir)
  files = files.filter(img => img.match(/\.(png|jpe?g|bmp)$/))
  // load all images
  let allImages = await utils.loadImages(
    files.map(filename => path.resolve(imgDir, filename))
  )

  let {
    areaTop, 
    areaBottom, 
    areaLeft, 
    areaRight, 
    xgap = 0, 
    ygap = 0
  } = config
  // one image
  // let areas = [
  //   [[areaLeft, areaTop], [width - areaRight, height - areaBottom]]
  // ]

  // two images
  // let areas = [
  //   [[areaLeft, areaTop], [areaLeft + (width - areaRight - areaLeft) / 2, height - areaBottom]],
  //   [[areaLeft + (width - areaRight - areaLeft) / 2, areaTop], [width - areaRight, height - areaBottom]]
  // ]

  // three images
  // let areas = [
  //   [[areaLeft, areaTop], [areaLeft + (width - areaRight - areaLeft) / 2, areaTop + (height - areaBottom - areaTop) / 2]],
  //   [[areaLeft, areaTop + (height - areaBottom - areaTop) / 2], [areaLeft + (width - areaRight - areaLeft) / 2, height - areaBottom]],
  //   [[areaLeft + (width - areaRight - areaLeft) / 2, areaTop], [width - areaRight, height - areaBottom]]
  // ]

  // four images
  let areas = [
    [[areaLeft, areaTop], [areaLeft + (width - areaRight - areaLeft) / 2, areaTop + (height - areaBottom - areaTop) / 2]],
    [[areaLeft, areaTop + (height - areaBottom - areaTop) / 2], [areaLeft + (width - areaRight - areaLeft) / 2, height - areaBottom]],
    [[areaLeft + (width - areaRight - areaLeft) / 2, areaTop], [width - areaRight, areaTop + (height - areaBottom - areaTop) / 2]],
    [[areaLeft + (width - areaRight - areaLeft) / 2, areaTop + (height - areaBottom - areaTop) / 2], [width - areaRight, height - areaBottom]]
  ]

  let resultFile = fs.openSync(path.resolve(config.outputDir, './txt/results.txt'), 'a')
  for (let i = 0; i < n; i++) {
    while (true) {
      let rotateAngles = utils.getRandomArrayEles([0, 90, 180, 270], areas.length)
      // 最终绘制的图像旋转方向为逆时针方向
      let imgs = utils.getRandomArrayEles(allImages, areas.length)
      let imgTooBig = false
      for (let j = 0, len = areas.length; j < len; j++) {
        let rotateArea = utils.areaRotate(areas[j], rotateAngles[j])
        let areaWidth = rotateArea[1][0] - rotateArea[0][0]
        let areaHeight = rotateArea[1][1] - rotateArea[0][1]
        if (
          areaWidth + 2 * xgap < imgs[j].width || 
          areaHeight + 2 * ygap < imgs[j].height
        ) {
          imgTooBig = true
          break
        } else {
          if (
            areaWidth > imgs[j].width &&
            areaHeight > imgs[j].height
          ) {
            imgs[j].startPointArea = [
              rotateArea[0],
              [
                rotateArea[0][0] + areaWidth - imgs[j].width, 
                rotateArea[0][1] + areaHeight - imgs[j].height
              ]
            ]
          } else {
            imgs[j].startPoint = rotateArea[0]
          }
          imgs[j].rotateAngle = rotateAngles[j]
        }
      }

      if (!imgTooBig) {
        utils.drawImage(ctx, bgImage, 0, 0)
        for (let img of imgs) {
          let [startX, startY] = img.startPoint ? img.startPoint : utils.getRandomPoint(...img.startPointArea)
          ctx.save()
          ctx.rotate((360 - img.rotateAngle) * Math.PI / 180)
          console.log(img.src)
          console.log(img.rotateAngle)
          utils.drawImage(ctx, img, startX, startY)
          ctx.restore()
        }
        let saveImgName = `${Date.now()}.png`
        console.log(saveImgName)
        utils.saveImageTo(canvas, path.resolve(config.outputDir, `./test/${saveImgName}`))
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let types = targets.map(filename => filename.match(/dish-(\d+)\.png/)[1]).join(',')
        fs.writeSync(resultFile, `${saveImgName} ${types}\n`)
        break
      }
    }
  }
}

module.exports = {
  placeImages
}