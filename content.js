let data;
let alreadyTryingToPrefill = false;

function tryToPrefillCoverLetter() {
    const coverLetterTextAreas = $("div > div.container > textarea");
    if (data && coverLetterTextAreas.length > 0) {
        alreadyTryingToPrefill = false;
        if (!coverLetterTextAreas.val())
            coverLetterTextAreas.val(data.angelCoverLetter.replace("{company}", getCompanyName));
        return;
    }
    setTimeout(() => { //sometimes it takes a while because of course it does
        tryToPrefillCoverLetter()
    }, 500);
}

function setPrefillListener() {
    const links = $('a');
    if (links.length > 1)
        for (let i = 0; i < links.length; i++)
            if (links[i].innerHTML.includes("Apply") && !alreadyTryingToPrefill) {
                console.log("have link " + links[i].innerHTML);
                links.click((e) => {
                    console.log("a clicked " + e.target.innerHTML);
                    if (e.target.innerHTML.includes("Apply") && !alreadyTryingToPrefill) {
                        alreadyTryingToPrefill = true;
                        tryToPrefillCoverLetter();
                    }
                });
                return;
            }
    setTimeout(() => { //sometimes it takes a while because of course it does
        setPrefillListener()
    }, 500);
}

function init() {
    getSavedData();
    setPrefillListener();
}

init();

function getCompanyName() {
    let companyName = $('a.js-interested-button.c-button--blue.c-button--lg').text()
        .replace("Apply to", "")
        .replace("Apply Now", "").trim();
    if (companyName) return companyName;
    companyName = $('div.startup-title').text()
        .replace("\"", "")
        .replace("Apply to", "").trim();
    return companyName;
}

// document.addEventListener('DOMContentLoaded', init); why the hell does this not work

function getSavedData() {
    chrome.storage.sync.get({
        data: SAMPLE_DATA,
    }, function (saved) {
        data = saved.data;
    });
}
