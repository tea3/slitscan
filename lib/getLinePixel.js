"use strict";

const assign     = require('object-assign')
const fs         = require('fs')
const path       = require('path')
const util       = require('./util.js')
const Canvas     = require('canvas')
const Image      = Canvas.Image

// get exif
module.exports.getLinePixel = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      let scanImg        = []
      let scanImg_width  = 0
      let scanImg_height = 0
      let startPotision  = fileObj.config.startPosition || 0.0
      let firstImgData
      
      for(let img_elm of fileObj.imgFiles){
        
        let scanLinePx  = []
        let data        = fs.readFileSync( img_elm.path )
        
        if(!data){
          reject( new Error('img files couldn\'t open :' + path.basename(img_elm.path) ) )
        }
        else {
          
          let img         = new Image;
          img.src         = data
          let canvas      = new Canvas(img.width, img.height);
          let ctx         = canvas.getContext('2d');
          scanImg_width   = img.width
          scanImg_height  = img.height
          ctx.drawImage(img, 0, 0, img.width, img.height);
          
          // RGBの画素値の配列を取得
          let imagedata = ctx.getImageData(0, 0, img.width, img.height);
          if(!firstImgData) firstImgData = imagedata
          
          // RGBを取得
          // x scan
          if( fileObj.config.scanLine == "x" ){
            let x = !fileObj.config.inverseScan ? img_elm.index : (img.width-1 - img_elm.index)
            let startPos_x = !fileObj.config.inverseScan ? Math.floor(img.width * startPotision) : (img.width-1 - Math.floor(img.width * startPotision) )
            
            if( x < img.width ){
              for( var y = 0; y< img.height; y++ ){
                var index = ( y*imagedata.width+x )*4
                
                let r
                let g
                let b

                if( (!fileObj.config.inverseScan && x <= startPos_x) || (fileObj.config.inverseScan && x >= startPos_x) ){
                  r = firstImgData.data[index];    // R
                  g = firstImgData.data[index+1];  // G
                  b = firstImgData.data[index+2];  // B
                }else{
                  r = imagedata.data[index];    // R
                  g = imagedata.data[index+1];  // G
                  b = imagedata.data[index+2];  // B
                }
                scanLinePx.push([ r , g , b ])
              }
            }
          
          // y scan
          }else{
            let y = !fileObj.config.inverseScan ? img_elm.index : (img.height-1 - img_elm.index)
            
            let startPos_y = !fileObj.config.inverseScan ? Math.floor(img.height * startPotision) : (img.height-1 - Math.floor(img.height * startPotision) )
            
            if( y < img.height ){
              for( var x = 0; x< img.width; x++ ){
                var index = ( y*imagedata.width+x )*4
                
                let r
                let g
                let b
                
                if( (!fileObj.config.inverseScan && y <= startPos_y) || (fileObj.config.inverseScan && y >= startPos_y) ){
                  r = firstImgData.data[index];    // R
                  g = firstImgData.data[index+1];  // G
                  b = firstImgData.data[index+2];  // B
                }else{
                  r = imagedata.data[index];    // R
                  g = imagedata.data[index+1];  // G
                  b = imagedata.data[index+2];  // B
                }
                scanLinePx.push([ r , g , b ])
              }
            }
          }
          scanImg.push(scanLinePx)
          util.progressLog( path.basename(img_elm.path) , "Get Line Pixel" )
        }
      }
      
      resolve( assign( fileObj , {
          "scanPx" : {
            width   : scanImg_width ,
            height  : scanImg_height ,
            scanData: scanImg
          }
      }) )
    })
  ))
