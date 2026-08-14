// =========================================================
// 🎂 SATYAKI PAHARI SIR — DIGITAL BIRTHDAY TRIBUTE
// Main Website JavaScript
// =========================================================


// =========================================================
// CONFIGURATION
// =========================================================

// তোমার Google Apps Script Web App URL এখানে বসাও.

const API_URL =
    "https://script.google.com/macros/s/AKfycbzXkbCTlEDBduPacPCtwXYvgYKbK3Pm53ciV6zczSuZA6L5sp-xTHMqNmWe6Vv3amln_A/exec";


// Submit করার পর কত milliseconds পরে
// Wish Wall page-এ যাবে

const REDIRECT_DELAY =
    2800;


// Wish Wall URL

const WISH_WALL_URL =
    "./wish_wall/";


// =========================================================
// PAGE INITIALIZATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeHeroButton();

        initializeCharacterCounter();

        initializeWishForm();

    }
);


// =========================================================
// HERO BUTTON
// "Leave a Birthday Wish"
// =========================================================

function initializeHeroButton() {

    const button =
        document.getElementById(
            "openWishButton"
        );


    const section =
        document.getElementById(
            "wishSection"
        );


    if (!button || !section) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


// =========================================================
// CHARACTER COUNTER
// =========================================================

function initializeCharacterCounter() {

    const textarea =
        document.getElementById(
            "message"
        );


    const counter =
        document.getElementById(
            "characterCount"
        );


    if (!textarea || !counter) {
        return;
    }


    function updateCounter() {

        const length =
            textarea.value.length;


        counter.textContent =
            length + " / 1000";


        // Warning state
        if (length >= 900) {

            counter.style.color =
                "#ff9a8a";

        }

        else {

            counter.style.color =
                "";

        }

    }


    textarea.addEventListener(
        "input",
        updateCounter
    );


    updateCounter();

}


// =========================================================
// FORM INITIALIZATION
// =========================================================

function initializeWishForm() {

    const form =
        document.getElementById(
            "wishForm"
        );


    const iframe =
        document.getElementById(
            "submitFrame"
        );


    const formContainer =
        document.getElementById(
            "formContainer"
        );


    const successScreen =
        document.getElementById(
            "successScreen"
        );


    const submitButton =
        document.getElementById(
            "submitButton"
        );


    if (
        !form ||
        !iframe ||
        !formContainer ||
        !successScreen ||
        !submitButton
    ) {

        console.error(
            "Birthday form elements missing."
        );

        return;
    }


    // =====================================================
    // SUBMIT STATE
    // =====================================================

    let isSubmitting = false;


    // =====================================================
    // FORM SUBMIT
    // =====================================================

    form.addEventListener(
    "submit",
    function (event) {

        if (!validateForm()) {

            event.preventDefault();

            return;
        }


        // Prevent accidental double click
        if (isSubmitting) {

            event.preventDefault();

            return;
        }


        isSubmitting = true;


        submitButton.disabled =
            true;


        submitButton.innerHTML = `

            <span>
                ⏳
            </span>

            শুভেচ্ছা পাঠানো হচ্ছে...

        `;

    }
);

    // =====================================================
    // IFRAME LOAD
    // =====================================================

    iframe.addEventListener(
        "load",
        function () {

            // First iframe load happens
            // during page initialization.
            // Ignore it.

            if (!isSubmitting) {

                return;
            }


            // Submission completed

            isSubmitting = false;


            // =================================================
            // HIDE FORM
            // =================================================

            formContainer.style.display =
                "none";


            // =================================================
            // SHOW SUCCESS SCREEN
            // =================================================

            successScreen.style.display =
                "block";


            // =================================================
            // SCROLL TO SUCCESS MESSAGE
            // =================================================

            setTimeout(
                function () {

                    successScreen.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                },
                80
            );


            // =================================================
            // REDIRECT TO WISH WALL
            // =================================================

            setTimeout(
                function () {

                    window.location.href =
                        WISH_WALL_URL;

                },
                REDIRECT_DELAY
            );

        }
    );

}


// =========================================================
// BASIC FORM VALIDATION
// =========================================================

function validateForm() {

    const name =
        document.getElementById(
            "name"
        );


    const relation =
        document.getElementById(
            "relation"
        );


    const message =
        document.getElementById(
            "message"
        );


    if (!name || !relation || !message) {

        return false;
    }


    const nameValue =
        name.value.trim();


    const relationValue =
        relation.value.trim();


    const messageValue =
        message.value.trim();


    if (!nameValue) {

        showFieldError(
            name,
            "আপনার নাম লিখুন।"
        );

        return false;
    }


    if (!relationValue) {

        showFieldError(
            relation,
            "আপনি কে সেটি নির্বাচন করুন।"
        );

        return false;
    }


    if (!messageValue) {

        showFieldError(
            message,
            "স্যারের জন্য একটি শুভেচ্ছা লিখুন।"
        );

        return false;
    }


    if (messageValue.length < 3) {

        showFieldError(
            message,
            "আরও একটু সুন্দর করে লিখুন।"
        );

        return false;
    }


    return true;
}


// =========================================================
// FIELD ERROR
// =========================================================

function showFieldError(
    field,
    message
) {

    field.focus();

    field.style.borderColor =
        "rgba(255, 113, 142, .75)";


    setTimeout(
        function () {

            field.style.borderColor =
                "";

        },
        2500
    );


    // Browser alert নয়।
    // Mobile-friendly ছোট notification.

    showToast(
        message
    );

}


// =========================================================
// TOAST MESSAGE
// =========================================================

function showToast(message) {

    let toast =
        document.getElementById(
            "birthdayToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "birthdayToast";


        toast.style.position =
            "fixed";

        toast.style.left =
            "50%";

        toast.style.bottom =
            "22px";

        toast.style.transform =
            "translateX(-50%) translateY(20px)";

        toast.style.zIndex =
            "9999";

        toast.style.maxWidth =
            "calc(100% - 30px)";

        toast.style.padding =
            "13px 17px";

        toast.style.borderRadius =
            "12px";

        toast.style.background =
            "rgba(20,22,30,.96)";

        toast.style.border =
            "1px solid rgba(255,255,255,.12)";

        toast.style.color =
            "#ffffff";

        toast.style.fontSize =
            "13px";

        toast.style.lineHeight =
            "1.5";

        toast.style.textAlign =
            "center";

        toast.style.boxShadow =
            "0 15px 40px rgba(0,0,0,.35)";

        toast.style.opacity =
            "0";

        toast.style.transition =
            "all .25s ease";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    requestAnimationFrame(
        function () {

            toast.style.opacity =
                "1";

            toast.style.transform =
                "translateX(-50%) translateY(0)";

        }
    );


    clearTimeout(
        window.birthdayToastTimer
    );


    window.birthdayToastTimer =
        setTimeout(
            function () {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateX(-50%) translateY(20px)";

            },
            2800
        );

}


// =========================================================
// SECURITY
// =========================================================

// যদি ভবিষ্যতে এখানে কোনো dynamic text
// display করতে হয়, HTML injection আটকাবে।

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
