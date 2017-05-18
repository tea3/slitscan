"use strict";

const path    = require('path')
const mkdirp  = require('mkdirp')

// make output dir
module.exports.makeTempDir_movImg = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
	    mkdirp.sync( fileObj.tempDir )
	    resolve(fileObj)
   	})
  ))