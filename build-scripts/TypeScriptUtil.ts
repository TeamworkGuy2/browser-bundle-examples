import child_process = require("child_process");
import gutil = require("gulp-util");

module TypeScriptUtil {
    // taken from TypeScript package: typescript/lib/tsserver.js
    export var staticHelpers = {
        extendsHelper: "\nvar __extends = (this && this.__extends) || function (d, b) {\n    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];\n    function __() { this.constructor = d; }\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n};",
        decorateHelper: "\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};",
        metadataHelper: "\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};",
        paramHelper: "\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};",
        awaiterHelper: "\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments)).next());\n    });\n};",
    };


    /** NOTE: typescript (i.e. 'tsc') must be installed and available via the command line
     * @param projRelativeSrcPath
     * @param callback
     */
    export function compileTypeScriptFile(tscCmd: string, projRelativeSrcPath: string, callback: (err, res) => void) {
        var child = child_process.exec(tscCmd, function (error, stdout, stderr) {
            if (stdout != null && stdout.length > 0) {
                gutil.log("TypeScript compile stdout: " + stdout);
            }
            if (stderr != null && stderr.length > 0) {
                gutil.log("TypeScript compile stderr: " + stderr);
            }
            if (error != null) {
                gutil.log("TypeScript compile error: " + error);
                callback(error, null);
            }
            else {
                callback(null, true);
            }
        });
    }

}

export = TypeScriptUtil;