(function (window, document) {

    "use strict";

    var mutAd = {
        interval: 100,
        nextAction: "findAd",
        currentUrl: null,
        wasMuted: null,
        mutedText: null,
        muteButton: null,
        muteToggle: function () {
            if (!this.muteButton) {
                this.muteButton = document.querySelector(".ytp-mute-button");

                if (!this.muteButton) {
                    return;
                }
            }

            this.muteButton.click();
        },
        getAd: function () {
            return document.querySelector(".videoAdUiAttribution");
        },
        getAriaText: function () {
            var aria = document.querySelector(".ytp-volume-panel");
            return aria && aria.getAttribute('aria-valuetext');
        }
    };

    setInterval(function () {

        if (!mutAd.mutedText) {
            var text1 = mutAd.getAriaText(), text2;
            mutAd.muteToggle();
            text2 = mutAd.getAriaText();
            mutAd.muteToggle();


            if (!text1 || !text2) {
                return;
            }

            mutAd.mutedText = text1.length > text2.length ? text1 : text2;
            console.log(mutAd.mutedText);
        }

        switch (mutAd.nextAction) {
            case "findAd":
                var ad = mutAd.getAd();

                if (ad) {
                    mutAd.wasMuted = mutAd.getAriaText() == mutAd.mutedText;
                    mutAd.currentUrl = window.location.href;

                    if (!mutAd.wasMuted) {
                        mutAd.muteToggle();
                    }

                    mutAd.nextAction = "pressSkip";
                }
                break;
            case "pressSkip":
                var skip = document.querySelector(".videoAdUiSkipButton");

                if (skip) {
                    skip.click();
                    mutAd.nextAction = "verifyNoAd";
                } else if (!mutAd.getAd()) {
                    mutAd.nextAction = "verifyNoAd";
                }
                break;
            case "verifyNoAd":
                if (!document.querySelector(".videoAdUiAttribution")) {
                    mutAd.nextAction = "unmute";
                } else {
                    mutAd.nextAction = "pressSkip";
                }
                break;
            case "unmute":
                var unmute = document.querySelector(".ytp-mute-button");

                if (unmute) {
                    if (!mutAd.wasMuted) {
                        mutAd.muteToggle();
                    }
                    mutAd.nextAction = "findAd";
                }

                break;
        }

    }.bind(this), mutAd.interval);
}(window, document));