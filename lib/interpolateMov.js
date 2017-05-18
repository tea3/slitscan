"use strict";


const util    = require('./util.js')
const assign  = require('object-assign')
const path    = require('path')
const exec    = require('child_process').exec

// interpolate movie
module.exports.interpolateMov = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      // http://nico-lab.net/minterpolate_with_ffmpeg/
      if( fileObj.config.movToImg && fileObj.config.movToImg.interpolate ){
        let commandArr
        let inputFilePath = path.join(fileObj.tempDir , "interpolate" , (path.basename(fileObj.path , path.extname(fileObj.path)) + "-trim" + path.extname(fileObj.path)) )
        let outputFilePath = path.join(fileObj.tempDir , "interpolate" , (path.basename(fileObj.path , path.extname(fileObj.path)) + "-interpolate" + path.extname(fileObj.path)) )
        
        commandArr = [
            'ffmpeg' ,
            '-i' ,
            '"' + inputFilePath + '"' ,
            '-vf' ,
            'minterpolate=' + fileObj.config.movToImg.interpolate + ':2:0:1:8:16:32:0:1:5' ,
            '-c:v mpeg4' ,
            '-q:v 1' ,
            '-an' ,
            '-y' ,
            '"' + outputFilePath + '"'
        ]
        
        util.progressLog( path.basename(outputFilePath) + " (Please wait several hour.)" , "Interpolating" )
        
        exec( commandArr.join(" ") , (err, stdout, stderr) => {
          if (err) reject( new Error(err) )
          else {
            resolve( assign( fileObj , {
              "interpolatingMoviePath" : outputFilePath
            }) )
          }
        })
      }
      else resolve( fileObj )
    })
  ))