// import {resolve} from './utils'
let utils = require('./utils')

module.exports = {
  bgImage: utils.resolve('./assets/images/background.png'),
  composeDir: utils.resolve('./assets/images/dish-types'),
  outputDir: utils.resolve('./results'),
  areaTop: 100,
  areaBottom: 130,
  areaLeft: 140,
  areaRight: 270
}