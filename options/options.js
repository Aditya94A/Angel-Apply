let ui = {}, data, alreadySaved;

function initUI() {
    ui.angelCoverLetter = $('#angelCoverLetter');
    ui.saveButton = $('#saveButton');
    ui.statusMessage = $('#statusMessage');
}

function init() {
    updateCoverLetter();
    setListener();
}

function updateCoverLetter() {
    ui.angelCoverLetter.val(data.angelCoverLetter);
}

function setListener() {
    ui.angelCoverLetter.on('input', function (e) {
        if (e.target.value.trim()) {
            hideStatus(); //all good
            update(e.target.value);
        }
        else {
            showStatus("Cannot be empty");
            enableSave(false);
        }
    });
}

function update(text) {
    data.angelCoverLetter = text;
    enableSave(isDataChanged());
}

function showStatus(status, hideSoon) {
    if (ui.statusMessage.is(":visible") && ui.statusMessage.text() === status)
        return;
    ui.statusMessage.text(status);
    ui.statusMessage.fadeIn();
    if (hideSoon)
        hideStatus();
}

function hideStatus() {
    ui.statusMessage.fadeOut();
}

//storage
function enableSave(enable) {
    ui.saveButton.prop('disabled', !enable);
}

function saveData() {
    chrome.storage.sync.set({
        data: data
    }, function () {
        alreadySaved = clone(data);
        enableSave(false);
        showStatus("Saved", true);
        updateBackgroundScript();
    });
}

function isDataChanged() {
    return data.angelCoverLetter !== alreadySaved.angelCoverLetter;
}


function deleteData() {
    chrome.storage.sync.clear();
}

// deleteData();

function getSavedData() {
    chrome.storage.sync.get({
        data: SAMPLE_DATA,
    }, function (saved) {
        data = saved.data;
        alreadySaved = clone(data);
        initUI();
        init();
    });
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function updateBackgroundScript() {
    chrome.runtime.sendMessage({updateData: true});
}

document.addEventListener('DOMContentLoaded', getSavedData);
document.getElementById('saveButton').addEventListener('click', saveData);