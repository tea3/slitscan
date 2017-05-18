"use strict";

const fs      = require('fs')
const yaml    = require('js-yaml')


// read _config.yml
module.exports.readConfigYAML = () =>
  new Promise( (resolve , reject) => {
    try {
      let doc = yaml.safeLoad( fs.readFileSync('./_config.yml', 'utf8') )
      
      resolve( {
        "config" : doc
      } )
    } catch (e) {
      reject( new Error(e) )
    }
  })