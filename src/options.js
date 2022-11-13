let api;

if (isChrome()) {
    api = chrome;
} else if (isFirefox()) {
    api = browser;
}

function isChrome() {
    return typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined";
}
  
function isFirefox() {
    return (
        typeof browser !== "undefined" && typeof browser.runtime !== "undefined"
    );
}

(function() {

    const optionIds = ['removeCCSubs', 'removeMusicSubs', 'postplayFullscreen'];


    function load() {
        api.storage.local.get(optionIds, function(result) {
            optionIds.forEach(optionId => {
                const checked = result[optionId] !== 'no';
                document.getElementById(optionId).checked = checked;
            });
        });
    }

    function save(event) {
        const optionId = event.target.getAttribute("id");
        const checked = event.target.checked;

        api.storage.local.set({[optionId]: checked ? 'yes' : 'no'}, function() {
            load(); // reload
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        load();
        document.querySelectorAll("input").forEach(
            element => element.addEventListener('click', save)
        );
    });


})();