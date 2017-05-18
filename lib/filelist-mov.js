"use strict";

const assign  = require('object-assign')
const path    = require('path')
const nfl     = require('node-filelist')

// get file list
module.exports.fileList_mov = ( inObj ) =>
    new Promise( ( resolve , reject ) => {
      let retrunFileTask = []
      let readFileDir    = []
      
      for(let i of inObj.config.readDir){
        readFileDir.push( i )
      }
      
      nfl.read( readFileDir , { "ext" : "mov|MOV|mp4|MP4" } , results => {
          if( !results || results.length == 0 ) reject( new Error('Movie files not found.') )
          else {
            for(let res of results ){
              retrunFileTask.push({
                "path"                    : res.path ,
                "tempDir"                 : path.join( path.resolve(inObj.config.projectDir) , "temp" , path.basename(res.path, path.extname(res.path)) ) ,
                "config"                  : inObj.config
              })
            }
            
            resolve( retrunFileTask )
          }
      })
    })