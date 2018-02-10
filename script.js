(function() {

    console.log('We we are Netflixed');
    
    const removeCCSubs = true;
    const removeMusicSubs = true;
    const postplayFullscreen = true;

    function callback(mutationsList) {
        if (removeCCSubs || removeMusicSubs) {
            const subs = document.querySelectorAll('.player-timedtext-text-container *');
            if (subs) {
                subs.forEach(sub => {
                    const before = sub.innerHTML;
                    let after = before;
                    if (removeCCSubs) {
                        after = before
                            .replace(/\[.*]/g, "")
                            .replace(/^\[.*/g, "")
                            .replace(/.*]$/g, "")
                            .trim()
                            .replace(/<br>$/g, "")
                            .replace(/^-$/g, "");
                    }
                    if (removeMusicSubs) {
                        if (after && after.charCodeAt(0) == 0x266a) {
                            after = "";
                        }
                        if (after && after.charCodeAt(after.length-1) == 0x266a) {
                            after = "";
                        }
                    }
                    if (before != after) {
                        console.log(before, " => ", after);
                        sub.innerHTML = after;
                    }
                });
            }
        }

        if (postplayFullscreen) {
            const postplay = document.querySelector('.postplay video');
            if (postplay) {
                postplay.click();
                console.log("Postplay!");
            }
        }
    };

    var observer = new MutationObserver(callback);
    observer.observe(document.body, { subtree: true, attributes: false, childList: true });

})();
