(function() {

    const extensionName = 'Netflix Tweaks extension';
    console.log(extensionName + ' - loaded');

    const optionIds = ['removeCCSubs', 'removeMusicSubs', 'postplayFullscreen'];
    const options = {};

    chrome.storage.local.get(optionIds, result => {
        optionIds.forEach(optionId => {
            const active = result[optionId] !== 'no';
            options[optionId] = active;
            console.log(extensionName + ' - ' + optionId + ':', active);
        });
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
        
        if (options['avoidPostCreditsTrailer']) {
            const countDown = document.querySelector(".PromotedVideo");
            if(countDown){
                const postplay = document.querySelector('.postplay video');
                const backToBrowse = document.querySelector('a.BackToBrowse');
                if(!postplay && backToBrowse){
                    backToBrowse.click();
                    console.log(extensionName + ' - stopping trailer autoplay (trailer after final credits)');
                }
            }
        }
    }

    var observer = new MutationObserver(callback);
    observer.observe(document.body, { subtree: true, attributes: false, childList: true });

})();
