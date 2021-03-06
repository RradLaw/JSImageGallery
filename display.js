let depth = [];
init();
let imgPointer = 0;
let depthPointer = -1;

function init() {
    depth = [];
    clearGrid();
    document.getElementById('titleSpan').innerHTML = imageJSON.compName;
    for (let i = 0; i < imageJSON.subfolder.length; i++) {
        document.getElementById('imgGrid').innerHTML += `<div class="pics img" onclick="addDepth(${i});"><h2>${imageJSON.subfolder[i].title}</h2>${imageJSON.subfolder[i].subtitle ? imageJSON.subfolder[i].subtitle : ''}</div>`;
    }
    document.getElementById('breadcrumbs').innerHTML = '<span onclick="diveDepth(-1)">Home > </span>';
}

function addDepth(d) {
    depth.push(d);
    let tag = imageJSON;
    for (let i = 0; i < depth.length; i++) {
        tag = tag.subfolder[depth[i]];
    }
    document.getElementById('breadcrumbs').innerHTML += `<span onclick="diveDepth(${depth.length - 1})">${tag.title} > </span>`;
    clearGrid();
    if (tag.subfolder) {
        for (let i = 0; i < tag.subfolder.length; i++) {
            document.getElementById('imgGrid').innerHTML += `<div class="pics img" onclick="addDepth(${i});"><h2>${tag.subfolder[i].title}</h2>${tag.subfolder[i].subtitle}</div>`;
        }
    } else {
        for (let i = 0; i < tag.images.length; i++) {
            document.getElementById('imgGrid').innerHTML += `<div class="pics img" onclick="openImage(${i})"><img src="${imageJSON.webDir}${tag.location}/thumb/${tag.images[i]}${imageJSON.imgExt}"></div>`;
        }
    }
    depthPointer = d;
}

function diveDepth(d) {
    if (d < 0) {
        init();
    } else {
        depth.length = d + 1;
        let tag = imageJSON;
        document.getElementById('breadcrumbs').innerHTML = '<span onclick="diveDepth(-1)">Home > </span>';
        for (let i = 0; i < d; i++) {
            tag = tag.subfolder[depth[i]];
            document.getElementById('breadcrumbs').innerHTML += `<span onclick="diveDepth(${i})">${tag.title} > </span>`;
        }
        addDepth(depth.pop());
    }
    depthPointer = d;
}

function clearGrid() {
    document.getElementById('imgGrid').innerHTML = '';
}

function openImage(img) {
    clearGrid();

    let tag = imageJSON;
    for (let i = 0; i < depth.length; i++) {
        tag = tag.subfolder[depth[i]];
    }

    if (img < 0) img = 0;
    if (img > tag.images.length - 1) img = tag.images.length - 1;

    document.getElementById('imgGrid').innerHTML = `<center><img class="largeImage" src="${imageJSON.webDir}${tag.location}/large/${tag.images[img]}${imageJSON.imgExt}"><br>${tag.images[img]}<br><span class="link" onclick="openImage(--imgPointer)">Previous</span>&nbsp;<span class="link" onclick="openImage(++imgPointer)">Next</span><br><span class="link" onclick="diveDepth(depthPointer)">Back</span></center>`;
    imgPointer = img;
}
document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
        // left arrow
        openImage(--imgPointer);
    }
    else if (e.keyCode == '39') {
        // right arrow
        openImage(++imgPointer);
    }

}
