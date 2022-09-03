const fs = require('fs');
const YAML = require('yaml');
const conf = fs.readFileSync('.config.yaml', 'utf8');
const config = YAML.parse(conf);

module.exports = config;
