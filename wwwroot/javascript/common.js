var mainUrl = "api/images";
var version = null;

function getVersion() {
    version = document.getElementById("version").innerHTML;
    version = version.substring(8);
}

function startUpload() {
    var name = document.getElementById("name").value;
    var description = "";

    if (version === "1.1") {
        description = document.getElementById("description").value;
    }

    if (!name || name.length < 3) {
        showError("Enter at least three characters for the title.");
        return;
    }

    if (version === "1.1" && (!description || description.length < 5)) {
        showError("Enter at least five characters for the description.");
        return;
    }

    var file = document.getElementById('fileInput').files[0];
    if (!file) {
        showError("Choose a file.");
        return;
    }

    $.ajax(`${mainUrl}?api-version=${version}`, {
        method: "POST",
        success: (data) => { startUploadSuccess(data) },
        error: showError,
        contentType: "application/json",
        processData: false,
        data: JSON.stringify({
            "Name": name,
            "Description": description
        })
    });
}

var speedSummary;

function showError(error) {
    document.getElementById("error").style.display = "block";
    document.getElementById("error").innerHTML = error;
    setTimeout(function () {
        document.getElementById("error").style.display = "none";
    }, 3000);
}

function startUploadSuccess(data) {
    var file = document.getElementById('fileInput').files[0];

    var blobService = AzureStorage.Blob.createBlobServiceWithSas(data.blobUrl, data.uploadSasToken);
    var customBlockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
    blobService.singleBlobPutThresholdInBytes = customBlockSize;

    // data.userName is the blob container (you can think of this as a folder in the storage account)
    // data.id is the blob (you can this of this as the actual file inside the container in the storage account)
    speedSummary = blobService.createBlockBlobFromBrowserFile(data.userName, data.id, file, { blockSize: customBlockSize }, function (error, result, response) {
        if (!error) {
            uploadComplete(data.id);
        }
    });
}

function uploadComplete(id) {
    $.ajax(`${mainUrl}/${id}/uploadComplete?api-version=${version}`, {
        method: "POST",
        success: refreshImages,
        error: showError
    });
}

function refreshImages() {
    $.ajax(`${mainUrl}?api-version=${version}`, {
        method: "GET",
        success: refreshImagesResult
    });
}

function purge() {
    $.ajax(`${mainUrl}?api-version=${version}`, {
        method: "Delete",
        success: purgeResult
    });
}

function purgeResult() {
    document.getElementById("images").innerHTML = "";
}

function refreshImagesResult(data) {
    var imagesDiv = document.getElementById("images");
    imagesDiv.innerHTML = '';

    // data is an array of ImageEntity
    data.forEach(addImage);
}

function addImage(image) {
    var imagesDiv = document.getElementById("images");
    var img = document.createElement("img");

    // TODO: fix img.src value
    img.src = mainUrl + "/" + image.id + "/?api-version=" + version;

    if (image.description) {
        img.title = image.description;
    }
    else {
        img.title = image.name;
    }

    img.alt = image.name;
    imagesDiv.append(img);
}

window.onload = function () {
    getVersion();
    document.getElementById("startUpload").onclick = startUpload;
    document.getElementById("refreshImages").onclick = refreshImages;
    document.getElementById("purge").onclick = purge;

    refreshImages();
};