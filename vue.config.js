/*
 * @Author: chenxiaoxuan
 * @Date: 2021-09-10 09:42:16
 * @LastEditTime: 2021-09-15 15:15:50
 * @LastEditors: chenxiaoxuan
 * @Description: 
 */
let path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  transpileDependencies: ["view-design/src"],
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
  }
}