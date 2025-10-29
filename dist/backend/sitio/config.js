"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const conf = fs_1.default.readFileSync('.config.yaml', 'utf8');
const config = yaml_1.default.parse(conf);
exports.default = config;
//# sourceMappingURL=config.js.map