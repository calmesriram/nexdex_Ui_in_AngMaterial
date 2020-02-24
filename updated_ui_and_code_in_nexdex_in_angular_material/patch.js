var fs = require("fs");
write_path = __dirname + "/node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js";
console.log("started to run patchfile please wait", process.pid);

function run() {
    try {

        fs.access(write_path, fs.F_OK, (err) => {
            if (err) {
                console.log("file does not exists");
                console.log(err)
                return process.kill(process.pid);
            }
            if (!err) {
                fs.readFile(write_path, (err, data) => {
                    if (err) {
                        console.log(err)
                        return;
                    }                    
                    if (data) {
                        fs.writeFile(write_path, JSON.parse(JSON.stringify(data.toString()).replace("node: false", "node: {crypto:true,stream:true}")), (er, da) => {
                            if (er) {
                                console.log(er)
                                return;
                            }

                            console.log("rewrite successfully completed");

                        })
                    }
                })
            }
        })

    } catch (e) {
        console.log(e)
        return process.kill(process.pid);
    } finally{
        console.log("patch file runned over !!!!");
    }
}
run();
