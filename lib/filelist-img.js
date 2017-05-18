"use strict";

const assign  = require('object-assign')
const path    = require('path')
const nfl     = require('node-filelist')

// get file list
module.exports.fileList_img = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      let imgFiles = []
      let retImgs = []
      
      nfl.read( [fileObj.tempDir] , { "ext" : "jpg|JPG|JPEG" } , results => {
          if( !results || results.length == 0 ) reject( new Error('img files not found. path:' + fileObj.tempDir) )
          else {
            for(let res of results ){
              imgFiles.push( res.path )
            }
            
            // sort by filename
            imgFiles.sort( (a,b) => ( Number(path.basename(a , path.extname(a))) - Number(path.basename(b , path.extname(b) ) )) * (fileObj.config.reverseScan ? -1 : 1) )
            
            for(let i=0; i<imgFiles.length; i++){
              retImgs.push( {
                "path" : imgFiles[i] ,
                "index": i
              } )
            }
            
            resolve( assign( fileObj , {
              "imgFiles" : retImgs
            }) )
          }
      })
    })
  ))