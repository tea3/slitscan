"use strict";


const util    = require('./util.js')
const assign  = require('object-assign')
const path    = require('path')
const exec    = require('child_process').exec

/*

$ ffmpeg -i 元動画.avi -ss 144 -t 148 -r 24 -f image2 %06d.jpg
-i 元動画.avi : 元動画
-ss 144 : 抜き出し始点(秒)
-t 148 : 抜き出し長さ(秒)
-r 24 : 1秒あたり何枚抜き出すか
-f image2: 動画を画像に切り出し
-qscale 1 -qmin 1 -qmax 1: 画質 (低い値の方が高画質)
%06d.jpg : jpeg で[000001.jpg]から連番で書き出し

*/

// convert movie to images
module.exports.movToImg = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      let inputFilePath = !( fileObj.config.movToImg && fileObj.config.movToImg.interpolate ) ? fileObj.path : fileObj.interpolatingMoviePath
      
      let startTime = !( fileObj.config.movToImg && fileObj.config.movToImg.interpolate ) ? fileObj.config.movToImg.movieStatTime : 0
      
      let commandArr
      commandArr = [
          'ffmpeg' ,
          '-i' ,
          '"' + inputFilePath + '"' ,
          '-ss' ,
          startTime ,
          '-t' ,
          fileObj.config.movToImg.movieLength ,
          '-f' ,
          'image2',
          // '-vcodec png' ,
          '-vcodec mjpeg' ,
          '-qscale 1 -qmin 1 -qmax 1' ,
          // '-q:v 0' ,  // -q:v 0 is highest quality  |  -q:v 31 is lowest quality
          '-r',
          fileObj.config.movToImg.frameRate ,
          '"' + path.join( fileObj.tempDir , '%06d.jpg' ) + '"'
      ]
      
      util.progressLog( path.basename(fileObj.path) , "Fetch still images from movie" )
      
      exec( commandArr.join(" ") , (err, stdout, stderr) => {
        if (err) reject( new Error(err) )
        else {
          util.progressLog( "" , "" )
          console.log(' -> mov to img : \u001b[36m' + path.basename(inputFilePath) + '\u001b[0m' )
          resolve( fileObj )
        }
      })
      
    })
  ))