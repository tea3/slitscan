"use strict";

const util     = require('./util.js')
const assign   = require('object-assign')
const path     = require('path')
const exec     = require('child_process').exec
const RES_SIZE = 0.9

// trim movie
module.exports.trimMov = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      // http://qiita.com/kitar/items/d293e3962ade087fd850
      if( fileObj.config.movToImg && fileObj.config.movToImg.interpolate ){
        let commandArr
        let outputFilePath = path.join(fileObj.tempDir , "interpolate" , (path.basename(fileObj.path , path.extname(fileObj.path)) + "-trim" + path.extname(fileObj.path)) )
        
        commandArr = [
          'ffmpeg' ,
          '-ss' ,
          fileObj.config.movToImg.movieStatTime ,
          '-i' ,
          '"' + fileObj.path + '"' ,
          '-t' ,
          fileObj.config.movToImg.movieLength + 1
        ]
        
        // 4Kの場合は切り取りしつつ、90％にリサイズする(ffmpegの_minterpolate_0エラーを避けるため)
        if(fileObj.width >= 3840 || fileObj.height >= 2160){
          commandArr.push(
            '-vf' ,
            '"scale=' + resizePx(fileObj.width , RES_SIZE) + ':' + resizePx(fileObj.height , RES_SIZE) + ',pad=' + resizePx(fileObj.width , RES_SIZE) + ':' + resizePx(fileObj.height , RES_SIZE) + ':0:0:black"'
          )
        }
        
        commandArr.push(
              '-c:v mpeg4' ,
              '-q:v 1' ,
              '-an' ,
              '-y' ,
              '"' + outputFilePath + '"'
        )
        
        util.progressLog( path.basename(outputFilePath) , "Movie triming" )
        
        exec( commandArr.join(" ") , (err, stdout, stderr) => {
          if (err) reject( new Error(err) )
          else {
            resolve( fileObj )
          }
        })
      }
      else resolve( fileObj )
    })
  ))
  
  
  
let resizePx = (inSize , inRate) => Math.floor( inSize * inRate )