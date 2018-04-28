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

async function main() {
    nestedSearch(config.galleryDir, imageJSON.subfolder);

    let data = JSON.stringify(imageJSON, null, 2);

    fs.writeFile('imageJSON-3.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    console.log(data);
}

async function nestedSearch(dir, p) {
    await fs.readdir(dir, async function (err, files) {
        if (err) {
            return console.error(err);
        }
        for (let i = 0; i < files.length; i++) {
            if (files[i] === "thumb") {
                let imgArr = [];
                await fs.readdir(`${dir}/${files[i]}/`, function (err, f) {
                    if (f) {
                        for (let i = 0; i < f.length; i++) {
                            imgArr.push(f[i]);
                        }

                        let data = JSON.stringify(imgArr, null, 2);
                        fs.writeFile('imageJSON-2.json', data, (err) => {
                            if (err) throw err;
                            console.log('Data written to file');
                        });
                    }
                });



                p.push({ "title": files[i], "subtitle": "", "images": imgArr });

            } else {
                fs.stat(dir + '/' + files[i], function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        p.push({ "title": files[i], "subtitle": "", "subfolder": [] });
                        nestedSearch(dir + '/' + files[i], p[p.length - 1].subfolder)
                    }
                });
            }
        }
    });

    let data = JSON.stringify(imageJSON, null, 2);
    fs.writeFile('imageJSON-3.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}
