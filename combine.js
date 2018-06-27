let fs = require('fs')
let path = require('path')
let xml2js = require('xml2js')
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

  let {
    xgap = 0, 
    ygap = 0,
    areas
  } = config

  let resultFile = fs.openSync(path.resolve(config.outputDir, './txt/results.txt'), 'a')

  // 如果要生成xml去掉以下注释
  // const XMLParser = new xml2js.Parser({explicitArray: false}),
  //       XMLBuilder = new xml2js.Builder({headless: true})
  // let {annotation, template} = await new Promise((resolve, reject) => {
  //   // 读取xml基本模板
  //   let t = fs.readFileSync(config.xmlTemplate)
  //   XMLParser.parseString(t, function (err, template) {
  //     let depth = 3
  //     let annotation = template.annotation
  //     annotation.folder = config.xmlFolderName
  //     annotation.size = {width, height, depth}
  //     if (err) {
  //       reject(err)
  //     } else {
  //       resolve({
  //         annotation,
  //         template
  //       })
  //     }
  //   })
  // })
  let generateCount = 0
  for (let i = 0; i < n; i++) {
    while (true) {
      let targets = utils.getRandomArrayEles(files, areas.length).map(filename => path.resolve(config.composeDir, filename))
      // 最终绘制的图像旋转方向为逆时针方向
      let imgs = await utils.loadImages(targets)
      let rotateAngles = utils.getRandomArrayEles([0, 90, 180, 270], areas.length)

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
        // 如果要生成xml去掉以下注释
        // annotation.object = []
        utils.drawImage(ctx, bgImage, 0, 0)
        for (let img of imgs) {
          let [startX, startY] = img.startPoint ? img.startPoint : utils.getRandomPoint(...img.startPointArea)

          // 如果要生成xml去掉以下注释
          // let imgPlacePos = utils.getImgPlacePos(width, height, Object.assign(img, {
          //   startX,
          //   startY
          // }))
          // annotation.object.push({
          //   name: config.getTypeName(path.basename(img.src)),
          //   pose: 'Unspecified',
          //   truncated: '0',
          //   difficult: '0',
          //   bndbox: imgPlacePos
          // })

          ctx.save()
          ctx.rotate((360 - img.rotateAngle) * Math.PI / 180)
          // console.log(img.src)
          // console.log(img.rotateAngle)
          // console.log(imgPlacePos)
          utils.drawImage(ctx, img, startX, startY)
          ctx.restore()
        }
        let now = Date.now()
        // console.log(`${now}.png`)
        utils.saveImageTo(canvas, path.resolve(config.outputDir, `./imgs/${now}.png`))
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let types = targets.map(filename => filename.match(/dish-(\d+)\.png/)[1]).join(',')
        fs.writeSync(resultFile, `${now}.png ${types}\n`)

        // 如果要生成xml去掉以下注释
        // annotation.filename = now
        
        // let xml = XMLBuilder.buildObject(template)
        // fs.writeFileSync(
        //   path.resolve(
        //     config.xmlSavePath, 
        //     `${now}.xml`
        //   ), xml
        // )
        console.log(`Generate ${++generateCount} / ${n} items`)
        break
      }
    }
  }
}

module.exports = {
  placeImages
}