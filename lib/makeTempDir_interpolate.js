"use strict";

const path    = require('path')
const mkdirp  = require('mkdirp')

// make output dir
module.exports.makeTempDir_interpolateMov = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
	    if( fileObj.config.movToImg && fileObj.config.movToImg.interpolate ) mkdirp.sync( path.join(fileObj.tempDir , "interpolate") )
	    resolve(fileObj)
   	})
  ))