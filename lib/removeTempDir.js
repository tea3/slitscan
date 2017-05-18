"use strict";

const fs      = require('fs')
const path    = require('path')
const util    = require('./util.js');
const exec    = require('child_process').exec

// remove temp Dir
module.exports.removeDir = ( inObj ) =>
  new Promise( ( resolve , reject ) => {
    let removeTempDir = path.join( path.resolve(inObj[0].config.projectDir) , "temp" )
    if(inObj[0].config.autoDeleteTmp){
	    exec( 'rm -rf "' + removeTempDir + '"' , (err, stdout, stderr) => {
	      if (err) reject( new Error('Couldn\'t remove temp directory. path: '+ removeTempDir + "\n" + err) )
	      else {
	        resolve( inObj )
	      }
	    })
	}
	else{
		resolve( inObj )
	}
  })
