let api;

if (isFirefox()) {
    api = browser;
} else if (isChrome()) {
    api = chrome;
}

function isFirefox() {
    return (
        typeof browser !== "undefined" && typeof browser.runtime !== "undefined"
    );
}

function isChrome() {
    return typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined";
}

(function() {

    const extensionName = 'Netflix Tweaks extension';
    console.log(extensionName + ' - loaded');

    const optionIds = ['removeCCSubs', 'removeMusicSubs', 'postplayFullscreen'];
    const options = {};

    api.storage.local.get(optionIds, result => {
        optionIds.forEach(optionId => {
            const active = result[optionId] !== 'no';
            options[optionId] = active;
            console.log(extensionName + ' - ' + optionId + ':', active);
        });
    });

    api.storage.onChanged.addListener(function (changes, namespace) {
        for (let [optionId, { oldValue, newValue }] of Object.entries(changes)) {
            const oldValueBoolean = oldValue !== 'no';
            const newValueBoolean = newValue !== 'no';
            console.log(extensionName + ' - ' + optionId + ': ' + oldValueBoolean + ' changed to', newValueBoolean);
            options[optionId] = newValueBoolean;
        }
    });

    function callback(mutationsList) {
        if (options['removeCCSubs'] || options['removeMusicSubs']) {
            const subs = document.querySelectorAll('.player-timedtext-text-container *');
            if (subs) {
                subs.forEach(sub => {
                    const before = sub.innerHTML;
                    let after = before;
                    if (options['removeCCSubs']) {
                        after = before
                            .replace(/\[.*?]/g, "")
                            .replace(/^\[.*/g, "")
                            .replace(/.*]$/g, "")
                            .trim()
                            .replace(/<br>$/g, "")
                            .replace(/^-$/g, "")
                            .replace(/^<br>-$/g, "")
                            .replace(/^-<br>$/g, "");
                    }
                    if (options['removeMusicSubs']) {
                        if (after && after.charCodeAt(0) == 0x266a) {
                            after = "";
                        }
                        if (after && after.charCodeAt(after.length-1) == 0x266a) {
                            after = "";
                        }
                    }
                    if (before != after) {
                        console.log(extensionName, ' - replacing subtitle: ', before, " => ", after);
                        sub.innerHTML = after;
                    }
                });
            }
        }

        if (options['postplayFullscreen']) {
            const postplay = document.querySelector('.postplay video');
            if (postplay) {
                postplay.click();
                console.log(extensionName + ' - hiding postplay (promo instead of credits)');
            }
        }
    }

    var observer = new MutationObserver(callback);
    observer.observe(document.body, { subtree: true, attributes: false, childList: true });

})();
