"use strict";


const util    = require('./util.js')
const assign  = require('object-assign')
const path    = require('path')
const exec    = require('child_process').exec

// get width height
module.exports.getWidthHeight = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      if( fileObj.config.movToImg && fileObj.config.movToImg.interpolate ){
        let commandArr
        
        commandArr = [
            'ffprobe' ,
            '-show_streams' ,
            '-print_format' ,
            'json' ,
            '"' + fileObj.path + '"' ,
        ]
        
        util.progressLog( path.basename(fileObj.path) , "Get Width and Height" )
        
        exec( commandArr.join(" ") , (err, stdout, stderr) => {
          if (err) reject( new Error(err) )
          else {
            if(stdout){
              let movJson = JSON.parse(stdout);
              if(movJson && movJson.streams[0] && movJson.streams[0].width){
                resolve( assign( fileObj , {
                  "width" : movJson.streams[0].width ,
                  "height" : movJson.streams[0].height 
                }) )
              }else reject( new Error("Cannot get width and height in movie : " + path.basename(fileObj.path)) )
            }else reject( new Error("Cannot get info in movie: " + path.basename(fileObj.path)) )
          }
        })
      }
      else resolve( fileObj )
    })
  ))