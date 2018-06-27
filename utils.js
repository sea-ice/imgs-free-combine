let path = require('path')
let fs = require('fs')
let {loadImage} = require('canvas')

function resolve(p) {
  return path.resolve(__dirname, p)
}

async function loadImages (files) {
  let imgs = []
  for (let file of files) {
    let img = await loadImage(file)
    imgs.push(img)
  }
  return imgs
}

function drawImage (ctx, file, ...startPoint) {
  let {width, height} = file
  ctx.drawImage(file, ...startPoint, width, height)
  return file
}

function saveImageTo (canvas, file) {
  let fd = fs.openSync(file, 'w')
  fs.writeSync(fd, canvas.toBuffer())
}

/**
 * 旋转给定矩形区域，返回新的矩形区域(顺时针旋转)
 * @param {*} area 矩形区域左上角和右下角两点坐标构成的数组，形如[[x1, y1], [x2, y2]]
 * @param {*} angle 旋转角度
 */
function areaRotate (area, angle) {
  let areaTop = area[0][1]
  let areaLeft = area[0][0]
  let areaRight = area[1][0]
  let areaBottom = area[1][1]
  switch (angle) {
    case 90:
      return [
        [-areaBottom, areaLeft],
        [-areaTop, areaRight]
      ]
    case 180:
      return [
        [-areaRight, -areaBottom],
        [-areaLeft, -areaTop]
      ]
    case 270:
      return [
        [areaTop, -areaRight],
        [areaBottom, -areaLeft]
      ]
    default:
      return area
  }
}

/**
 * 获取子图在背景图中的坐标信息
 * @param {*} img 
 */
function getImgPlacePos (bgw, bgh, img) {
  let {startX, startY, width, height, rotateAngle} = img
  startX = Math.abs(startX)
  startY = Math.abs(startY)
  switch (rotateAngle) {
    case 90:
      return {
        xmin: startY, 
        ymin: startX - width, 
        xmax: startY + height, 
        ymax: startX
      }
    case 180:
      return {
        xmin: startX - width, 
        ymin: startY - height, 
        xmax: startX, 
        ymax: startY
      }
    case 270:
      return {
        xmin: startY - height, 
        ymin: startX, 
        xmax: startY, 
        ymax: startX + width
      }
    default:
      return {
        xmin: startX, 
        ymin: startY,
        xmax: startX + width,
        ymax: startY + height
      }
  }
}

function getRandomArrayEles (array, n) {
  let results = []
  let len = array.length
  for (let i = 0; i < n; i++) {
    results.push(array[Math.floor(Math.random() * len)])
  }
  return results
}

function getRandomNumber (start, stop) {
  return start + Math.floor(Math.random() * (stop + 1 - start))
}

/**
 * 
 * @param {*} p1 表示目标点矩形区域的左上角坐标
 * @param {*} p2 表示目标点矩形区域的右下角坐标
 */
function getRandomPoint (p1, p2) {
  let x = getRandomNumber(p1[0], p2[0])
  let y = getRandomNumber(p1[1], p2[1])
  return [x, y]
}

function arrayEquals (a1, a2) {
  if (a1.length !== a2.length) return false
  let sortedA1 = a1.sort((a, b) => a - b) // 升序排列
  let sortedA2 = a2.sort((a, b) => a - b)
  for (let i = 0, len = sortedA1.length; i < len; i++) {
    if (sortedA1[i] !== sortedA2[i]) return false
  }
  return true
}

module.exports = {
  resolve,
  loadImages,
  drawImage,
  areaRotate,
  getImgPlacePos,
  saveImageTo,
  getRandomPoint,
  getRandomArrayEles,
  arrayEquals
}