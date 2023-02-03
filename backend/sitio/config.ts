import fs from 'fs';
import YAML from 'yaml';
const conf = fs.readFileSync('.config.yaml', 'utf8');
const config = YAML.parse(conf);

export default config;
