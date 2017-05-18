"use strict";

const assign  = require('object-assign')
const path    = require('path')
const nfl     = require('node-filelist')
const moment  = require('moment')

// get file list
module.exports.fileList_img_fromImg = ( inObj ) =>
  new Promise( (resolve , reject) => {
      let imgFiles = []
      let retImgs = []
      
      nfl.read( inObj.config.readDir , { "ext" : "jpg|JPG|JPEG" , "isStats":true } , results => {
          if( !results || results.length == 0 ) reject( new Error('img files not found. path:' + inObj.config.readDir ) )
          else {
            
            imgFiles = results
            
            // sort by mtime
            imgFiles.sort( (a,b) => ( moment(a.stats.mtime).diff(moment(b.stats.mtime) ) * (inObj.config.reverseScan ? -1 : 1) ))
            
            for(let i=0; i<imgFiles.length; i++){
              retImgs.push( {
                "path" : imgFiles[i].path ,
                "index": i
              } )
            }
            
            resolve([ assign( inObj , {
              "imgFiles" : retImgs
            })] )
          }
      })
    })