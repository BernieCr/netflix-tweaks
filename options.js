
(function() {

    const optionIds = ['removeCCSubs', 'removeMusicSubs', 'postplayFullscreen', 'avoidPostCreditsTrailer'];


    function load() {
        chrome.storage.local.get(optionIds, function(result) {
            optionIds.forEach(optionId => {
                const checked = result[optionId] !== 'no';
                document.getElementById(optionId).checked = checked;
            });
        });
    }

    function save(event) {
        const optionId = event.target.getAttribute("id");
        const checked = event.target.checked;

        chrome.storage.local.set({[optionId]: checked ? 'yes' : 'no'}, function() {
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
