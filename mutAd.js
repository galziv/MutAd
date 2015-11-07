(function (window, document) {

    window.mutAd = {
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

        if (!window.mutAd.mutedText) {
            var text1 = window.mutAd.getAriaText(), text2;
            window.mutAd.muteToggle();
            text2 = window.mutAd.getAriaText();
            window.mutAd.muteToggle();


            if (!text1 || !text2) {
                return;
            }

            window.mutAd.mutedText = text1.length > text2.length ? text1 : text2;
            console.log(window.mutAd.mutedText);
        }

        switch (window.mutAd.nextAction) {
            case "findAd":
                var ad = window.mutAd.getAd();

                if (ad) {
                    window.mutAd.wasMuted = window.mutAd.getAriaText() == window.mutAd.mutedText;
                    window.mutAd.currentUrl = window.location.href;

                    if (!window.mutAd.wasMuted) {
                        window.mutAd.muteToggle();
                    }

                    window.mutAd.nextAction = "pressSkip";
                }
                break;
            case "pressSkip":
                var skip = document.querySelector(".videoAdUiSkipButton");

                if (skip) {
                    skip.click();
                    window.mutAd.nextAction = "verifyNoAd";
                } else if (!window.mutAd.getAd()) {
                    window.mutAd.nextAction = "verifyNoAd";
                }
                break;
            case "verifyNoAd":
                if (!document.querySelector(".videoAdUiAttribution")) {
                    window.mutAd.nextAction = "unmute";
                } else {
                    window.mutAd.nextAction = "pressSkip";
                }
                break;
            case "unmute":
                var unmute = document.querySelector(".ytp-mute-button");

                if (unmute) {
                    if (!window.mutAd.wasMuted) {
                        window.mutAd.muteToggle();
                    }
                    window.mutAd.nextAction = "findAd";
                }

                break;
        }

    }, 100);
}(window, document));