/* eslint-disable @typescript-eslint/naming-convention */

class CssFormater {
    indentation: string;
    expandBlockBreak: string;
    constructor(indentation: string = "\t", expandBlockBreak: string = "\n\n") {
        this.indentation = indentation;
        this.expandBlockBreak = expandBlockBreak;
    }

    run(code: string, action = "compact") {


        type actKey = Record<string, Function>;
        var actFuns: actKey = {
            "expand": this.expand_rules,
            "expand-bs": this.expand_rules,
            "compact": this.compact_rules,
            "compact-bs": this.compact_rules,
            "compact-ns": this.compact_ns_rules,
            "compact-bs-ns": this.compact_ns_rules,
            "compress": this.compress_rules
        };

        if (!actFuns[action]) {
            return code;
        }
        var comments: any[] = [];
        if (action === "compress") {
            code = code.replace(/\s*\/\*[\s\S]*?\*\/\s*/g, '');
        } else {
            const commentReg = /[ \t]*\/\*[\s\S]*?\*\//g;
            comments = code.match(commentReg) || [];
            code = code.replace(commentReg, "!comment!");
        }

        // Protect strings
        const stringReg = /(content\s*:|[\w-]+\s*=)\s*(([\'\"]).*?\3)\s*/g;
        const strings = code.match(stringReg) || [];
        code = code.replace(stringReg, '!string!');

        // Protect urls
        const urlReg = /((?:url|url-prefix|regexp)\([^\)]+\))/g;
        const urls = code.match(urlReg) || [];
        code = code.replace(urlReg, '!url!');

        // Pre process
        code = code.replace(/\s*([\{\}:;,])\s*/g, '$1'); // remove \s before and after characters {}:;,
        code = code.replace(/([\[\(])\s*/g, '$1'); // remove space inner [ or (
        code = code.replace(/\s*([\)\]])/g, '$1'); // remove space inner ) or ]
        // code = code.replace(/(\S+)\s*([\+>~])\s*(\S+)/g, '$1$2$3'); // remove \s before and after relationship selectors
        code = code.replace(/,[\d\s\.\#\+>~:]*\{/g, '{'); // remove invalid selectors without \w
        code = code.replace(/([;,])\1+/g, '$1'); // remove repeated ;,

        if (action !== 'compress') {
            // Group selector
            if (/-bs/.test(action)) {
                code = this.breakSelectors(code); // break after selectors' ,
            } else {
                code = code.replace(/,\s*/g, ', '); // add space after ,
            }

            // Add space
            if (/-ns/.test(action)) {
                code = code.replace(/, +/g, ','); // remove space after ,
                code = code.replace(/\s+!important/g, '!important'); // remove space before !important
            } else {
                code = code.replace(/([A-Za-z-](?:\+_?)?):([^;\{]+[;\}])/g, '$1: $2'); // add space after properties' :
                code = code.replace(/\s*!important/g, ' !important'); // add space before !important
            }
        }

        // Process action rules
        code = actFuns[action].call(this, code);

        if (action === "compress") {
            code = code.replace(/;\}/g, "}");
        } else {
            if (action === "expand-bs") {
                code = code.replace(/\}\s*/g, '}\n\n');

            }
            code = code.replace(/\s*!comment!\s*@/g, '\n\n!comment!\n@');
            code = code.replace(/\s*!comment!\s*([^\/\{\};]+?)\{/g, '\n\n!comment!\n$1{');

            code = code.replace(/\s*\n!comment!/g, '\n\n!comment!');


            for (let i = 0; i < comments.length; i++) {
                code = code.replace(/[\t]*!comment!/, comments[i]);
            }
            code = this.indentCode(code);
        }

        for (let i = 0; i < strings.length; i++) {
            code = code.replace("!string!", strings[i]);
        }

        for (let i = 0; i < urls.length; i++) {
            code = code.replace("!url!", urls[i]);
        }

        code = code.replace(/^\s*(\S+(\s+\S+)*)\s*$/g, "$1");
        console.log(/compact/.test(action));
        
        if (/compact/.test(action)) {
            code = code.replace(/^\s+/gm, "");
        }
        return code;
    }

    expand_rules(code: string) {
        code = code.replace(/\{/g, ' {\n');
        code = code.replace(/;/g, ';\n');
        code = code.replace(/;\s*([^\{\};]+?)\{/g, ';\n\n$1{');
        code = code.replace(/\s*(!comment!)\s*;\s*/g, ' $1 ;\n');
        code = code.replace(/(:[^:;]+;)\s*(!comment!)\s*/g, '$1 $2\n');
        code = code.replace(/\s*\}/g, '\n}');
        code = code.replace(/\}\s*/g, "}" + this.expandBlockBreak);
        return code;
    }

    compact_rules(code: string) {
        code = code.replace(/\{/g, " { ");
        code = code.replace(/(@[\w-]*(document|font-feature-values|keyframes|media|supports)[^;]*?\{)\s*/, '$1\n');
        code = code.replace(/;/g, "; ");
        code = code.replace(/(@(charset|import|namespace).+?;)\s*/, '$1\n');
        code = code.replace(/;\s*([^\};]+?\{)/, ';\n$1');
        code = code.replace(/\s*(!comment!)\s*;/g, ' $1 ;');
        code = code.replace(/(:[^:;]+;)\s*(!comment!)\s*/g, '$1 $2 ');
        code = code.replace(/\s*\}/g, ' }');
        code = code.replace(/\}\s*/g, '}\n');
        return code;
    }

    compact_ns_rules(code: string) {
        code = code.replace(/(@[\w-]*(document|font-feature-values|keyframes|media|supports)[^;]*?\{)\s*/g, '$1\n');
        code = code.replace(/(@(charset|import|namespace).+?;)\s*/g, '$1\n');
        code = code.replace(/;\s*([^\};]+?\{)/g, ';\n$1');
        code = code.replace(/\s*(!comment!)\s*;/g, '$1;');
        code = code.replace(/(:[^:;]+;)\s*(!comment!)\s*/g, '$1$2');
        code = code.replace(/\}\s*/g, '}\n');
        return code;
    }

    compress_rules(code: string) {
        code = code.replace(/\s*([\{\}:;,])\s*/g, '$1');
        code = code.replace(/\s+!important/g, '!important');
        code = code.replace(/((?:@charset|@import)[^;]+;)\s*/g, '$1\n');
        return code;
    }

    breakSelectors(code: string): string {
        let block: string[] = code.split('}');
        for (let i: number = 0; i < block.length; i++) {

            let b: string[] = block[i].split('{');
            let bLen: number = b.length;
            for (let j: number = 0; j < bLen; j++) {

                // eslint-disable-next-line eqeqeq
                if (j == bLen - 1) {
                    b[j] = b[j].replace(/,\s*/g, ', '); // add space after properties' ,
                } else {
                    let s: string[] = b[j].split(';');
                    let sLen: number = s.length;
                    let sLast: string = s[sLen - 1];

                    for (let k: number = 0; k < sLen - 1; k++) {
                        s[k] = s[k].replace(/,\s*/g, ', '); // add space after properties' ,
                    }

                    // For @document, @media
                    if (/\s*@(document|media)/.test(sLast)) {
                        s[sLen - 1] = sLast.replace(/,\s*/g, ', '); // add space after @media's ,
                    }

                    // For mixins
                    else if (/(\(|\))/.test(sLast)) {
                        let u: string[] = sLast.split(')');
                        for (let m: number = 0; m < u.length; m++) {
                            let v: string[] = u[m].split('(');
                            let vLen: number = v.length;
                            if (vLen < 2) {
                                continue;
                            }
                            v[0] = v[0].replace(/,\s*/g, ',\n');
                            v[1] = v[1].replace(/,\s*/g, ', '); // do not break arguments
                            u[m] = v.join('(');
                        }
                        s[sLen - 1] = u.join(')');
                    }

                    // For selectors
                    else {
                        s[sLen - 1] = sLast.replace(/,\s*/g, ',\n'); // add \n after selectors' ,
                    }

                    b[j] = s.join(';');
                }

            }
            block[i] = b.join('{');
        }

        code = block.join('}');
        return code;
    }

    indentCode(code: string): string {
        let lines = code.split('\n');
        let level = 0;
        let inComment = false;
        let outPrefix = '';
        let adjustment = 0;

        for (let i = 0; i < lines.length; i++) {
            if (!inComment) {
                // Quote level adjustment
                let validCode = lines[i].replace(/\/\*[\s\S]*?\*\//g, '');
                validCode = validCode.replace(/\/\*[\s\S]*/g, '');
                adjustment = validCode.split('{').length - validCode.split('}').length;

                // Trim
                let m = lines[i].match(/^(\s+)\/\*.*$/);
                if (m !== null) {
                    outPrefix = m[1];
                    lines[i] = lines[i].replace(new RegExp('^' + outPrefix + '(.*)\\s*$'), '$1');
                } else {
                    lines[i] = lines[i].replace(/^(\s*)(.*)\s*$/, '$2');
                }
            } else {
                // Quote level adjustment

                // Trim
                lines[i] = lines[i].replace(new RegExp('^' + outPrefix + '(.*)\\s*$'), '$1');
            }

            // Is next line in comment?
            let commentQuotes = lines[i].match(/\/\*|\*\//g) || [];
            for (let quote of commentQuotes) {
                if (inComment && quote === '*/') {
                    inComment = false;
                } else if (quote === '/*') {
                    inComment = true;
                }
            }

            // Quote level adjustment
            let nextLevel = level + adjustment;
            let thisLevel = level;
            if (adjustment > 0) {
                thisLevel = level;
            } else {
                thisLevel = nextLevel;
            }
            level = nextLevel;

            // Add indentation
            if (lines[i] !== '') {
                lines[i] = this.indentation.repeat(thisLevel) + lines[i];
            } else {
                lines[i] = '';
            }
        }

        return lines.join('\n');
    }

}

export { CssFormater };