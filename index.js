const fs = require("fs")

const config = require("./config.json");

let imageJSON = {
    "compName": config.compName,
    "code": config.code,
    "webDir": config.webDir,
    "imgExt": config.imgExt,
    "subfolder": []
};

console.log(`Going to read directory ${config.galleryDir}`);

main();

function main() {
    nestedSearch(config.galleryDir, imageJSON.subfolder, config.code);

    setTimeout(function () {
        let data = JSON.stringify(imageJSON, null, 2);

        fs.writeFile('imageJSON-3.json', data, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    }, 10000);
}

function nestedSearch(dir, p, dirend) {
    let files = fs.readdirSync(dir);

    for (let i = 0; i < files.length; i++) {
        if (files[i] === "thumb") {
            let imgArr = [];
            fs.readdirSync(`${dir}\\${files[i]}\\`).forEach(f => {
                imgArr.push(f);
            });
            p.push({ "title": files[i], "subtitle": "", "images": imgArr });
        } else if (files[i] !== "large") {
            fs.stat(dir + '\\' + files[i], function (err, stat) {
                if (stat && stat.isDirectory()) {
                    let imgArr = [];
                    let f = fs.readdirSync(`${dir}\\${files[i]}\\`);
                    for (let j = 0; j < f.length; j++) {
                        if (f[j] === "thumb" || f[j] === "large") {
                            fs.readdirSync(`${dir}\\${files[i]}\\${f[j]}\\`).forEach(f => {
                                imgArr.push(f.substr(0, f.length - 4));
                            });
                            p.push({ "title": files[i], "subtitle": "", "images": imgArr, "location": `${dirend}/${files[i]}` });
                            return;
                        }
                    }
                    p.push({ "title": files[i], "subtitle": "", "subfolder": [], "location": `${dirend}/${files[i]}` });
                    nestedSearch(dir + '\\' + files[i], p[p.length - 1].subfolder, `${dirend}/${files[i]}`);
                }
            });
        }
    }
}
