// 计算测试结果准确率

let path = require('path')
let fs = require('fs')
let utils = require('./utils')
let calResult = fs.readFileSync(utils.resolve('./results/txt/test-res5.txt')).toString()
// readFileSync方法默认返回buffer对象

let formattedRes = {}
let lines = calResult.split('\r\n').map(line => line.trim() && line.split(','))
let resultItems = 0
for (let line of lines) {
  if (line) {
    let imgName = line.shift()
    formattedRes[imgName] = line.map(type => Number(type.trim()))
    resultItems++
  }
}
// console.log(formattedRes)

let answers = fs.readFileSync(utils.resolve('./results/txt/results.txt')).toString()
lines = answers.split('\n').map(line => line.trim() && line.split(' '))
let correct = incorrect = answerItems = 0
console.log(lines)
let incorrectItems = []
for (let line of lines) {
  if (line) {
    if (formattedRes[line[0]]) {
      if (utils.arrayEquals(
        formattedRes[line[0]], 
        line[1].split(',').map(type => Number(type))
      )) {
        correct++
      } else {
        incorrect++
        incorrectItems.push([line[0], ...formattedRes[line[0]]].join(','))
      }
    }
    answerItems++
  }
}

console.log(`测试结果条目数量：${resultItems}, 标准答案数量：${answerItems}`)
console.log(`测试结果中和标准答案匹配的有${correct}个，不正确的有${incorrect}个，找不到对应答案有${resultItems-correct-incorrect}个，匹配的准确率达${(correct/(correct + incorrect)).toFixed(4)}`)
console.log(`标准答案中存在${answerItems-correct-incorrect}条答案没有对应的测试结果`)

fs.writeFileSync(utils.resolve('./results/txt/incorrect-predict.txt'), incorrectItems.join('\r\n'))
