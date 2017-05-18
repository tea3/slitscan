"use strict";

const pg      = require('commander');
const dp      = require('./lib/debugParam.js');
const ry      = require('./lib/readYml.js')
const flm     = require('./lib/filelist-mov.js')
const fli     = require('./lib/filelist-img.js')
const flii    = require('./lib/filelist-img-fromImg.js')
const trm     = require('./lib/trimMov.js')
const gwh     = require('./lib/getWidthHeight.js')
const mti     = require('./lib/movToImg.js')
const mdi     = require('./lib/makeTempDir_movImg.js')
const mdi_ipm = require('./lib/makeTempDir_interpolate.js')
const ipm     = require('./lib/interpolateMov.js')
const glp     = require('./lib/getLinePixel.js')
const gi      = require('./lib/generateImg.js')
const rmd     = require('./lib/removeTempDir.js')

// process complate
let processComplate = (inObj) => {
  return new Promise( (resolve , reject) => {
    console.log("\u001b[35mcomplete !!\u001b[0m")
    resolve(inObj)
  })
}

// generate slitscan image from motion iamges
let generateSlitscanImg = () => {
  
  console.time('process time')
  
  ry.readConfigYAML( )
    .then( flm.fileList_mov )
    .then( mdi.makeTempDir_movImg )
    .then( mdi_ipm.makeTempDir_interpolateMov )
    .then( gwh.getWidthHeight )
    .then( trm.trimMov )
    .then( ipm.interpolateMov )
    .then( mti.movToImg )
    .then( fli.fileList_img )
    .then( glp.getLinePixel )
    .then( gi.generateImg )
    .then( rmd.removeDir )
    // .then( dp.debugParam )
    .then( processComplate )
    .then( (inObj) => {
      return new Promise( (resolve , reject) => {
        console.timeEnd("process time")
        resolve(inObj)
      })
    })
    // .catch( e => { console.error('\u001b[31m' + e + "\u001b[0m") } )
}


// generate slitscan image from motion iamges
let generateSlitscanImg_fromImg = () => {
  
  console.time('process time')
  
  ry.readConfigYAML( )
    .then( flii.fileList_img_fromImg )
    .then( glp.getLinePixel )
    .then( gi.generateImg )
    // // .then( dp.debugParam )
    .then( processComplate )
    .then( (inObj) => {
      return new Promise( (resolve , reject) => {
        console.timeEnd("process time")
        resolve(inObj)
      })
    })
    .catch( e => { console.error('\u001b[31m' + e + "\u001b[0m") } )
}


pg
  .command('generateFromMovie')
  .alias('g')
  .description('generate slitscan image from motion images')
  .action( generateSlitscanImg )
  .on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ node index.js g');
    console.log();
  });
  
pg
  .command('generatefromImg')
  .alias('i')
  .description('generate slitscan image from images')
  .action( generateSlitscanImg_fromImg )
  .on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ node index.js i');
    console.log();
  });

pg.parse(process.argv)
pg.usage('[options] <file ...>')