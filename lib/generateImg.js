"use strict";

const assign     = require('object-assign')
const fs         = require('fs')
const path       = require('path')
const util       = require('./util.js')
const mkdirp     = require('mkdirp')
const Canvas     = require('canvas')
const Image      = Canvas.Image

// get exif
module.exports.generateImg = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      let canvas      = new Canvas(fileObj.scanPx.width, fileObj.scanPx.height);
      let ctx         = canvas.getContext('2d');
      ctx.beginPath();
      ctx.rect( 0, 0, fileObj.scanPx.width, fileObj.scanPx.height);
      ctx.fillStyle = "black";
      ctx.fill();
      
      // // RGBの画素値の配列を取得
      let imagedata = ctx.getImageData(0, 0, fileObj.scanPx.width, fileObj.scanPx.height);
      
      // // RGBの平均色を取得
      // x scan
      let x = 0
      let y = 0
      let index = 0
      if( fileObj.config.scanLine == "x" ){
        for(x=0; x<imagedata.width; x++){
          if(x < fileObj.scanPx.scanData.length ){
            for(y=0; y<imagedata.height; y++){
              let scan_X = !fileObj.config.inverseScan ? x : ( fileObj.scanPx.width -1 - x )
              index = ( y*imagedata.width +  scan_X )*4
              imagedata.data[index]   = fileObj.scanPx.scanData[x][y][0]; // R
              imagedata.data[index+1] = fileObj.scanPx.scanData[x][y][1]; // G
              imagedata.data[index+2] = fileObj.scanPx.scanData[x][y][2]; // B
            }
          }
        }
      
      // y scan
      }else{
        
        for(y=0; y<imagedata.height; y++){
          if(y < fileObj.scanPx.scanData.length ){
            for(x=0; x<imagedata.width; x++){
              let scan_Y = !fileObj.config.inverseScan ? y : ( fileObj.scanPx.height -1 - y )
              index = ( scan_Y *imagedata.width +  x )*4
              imagedata.data[index]   = fileObj.scanPx.scanData[y][x][0]; // R
              imagedata.data[index+1] = fileObj.scanPx.scanData[y][x][1]; // G
              imagedata.data[index+2] = fileObj.scanPx.scanData[y][x][2]; // B
            }
          }
        }
      }
      
      // 加工したデータをセット
      ctx.putImageData(imagedata, 0, 0);
      
      let outputfileName = fileObj.path ? (path.basename(fileObj.path , path.extname(fileObj.path)) + ".png") : "slitscan.png"
      let outputPath = path.join( path.resolve(fileObj.config.distDir) , outputfileName )
      mkdirp.sync(path.resolve(fileObj.config.distDir))
      
      util.progressLog( path.basename(outputPath) , "Generate img" )
      util.canvas_save(canvas , outputPath , function(err){
        if(err) reject( new Error('img files couldn\'t generate :' + path.basename(outputPath) ) )
        else{
          util.progressLog( path.basename(outputPath) , "Generated img" )
          console.log()
          resolve( fileObj )
        }
      });
    })
  ))
