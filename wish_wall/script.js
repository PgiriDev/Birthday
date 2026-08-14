// =========================================================
// 🎂 SATYAKI PAHARI SIR — BIRTHDAY WISH WALL
// Wish Wall JavaScript
// =========================================================


// =========================================================
// CONFIGURATION
// =========================================================

// Google Apps Script Web App URL
//
// IMPORTANT:
// এখানে তোমার Apps Script Web App URL বসাবে.
//
// Example:
// https://script.google.com/macros/s/XXXXXXXX/exec

const API_URL =
    "https://script.google.com/macros/s/AKfycbzXkbCTlEDBduPacPCtwXYvgYKbK3Pm53ciV6zczSuZA6L5sp-xTHMqNmWe6Vv3amln_A/exec";


// কতক্ষণ পরপর নতুন approved wishes check করবে

const REFRESH_INTERVAL =
    30000;


// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadWishes();

        startAutoRefresh();

    }
);


// =========================================================
// LOAD APPROVED WISHES
// =========================================================

function loadWishes() {

    if (
        !API_URL ||
        API_URL ===
        "YOUR_APPS_SCRIPT_URL"
    ) {

        showConfigurationError();

        return;
    }


    const callbackName =
        "birthdayWishCallback_" +
        Date.now();


    // -----------------------------------------------------
    // JSONP CALLBACK
    // -----------------------------------------------------

    window[callbackName] =
        function (response) {

            try {

                if (
                    !response ||
                    response.success !== true
                ) {

                    showLoadError();

                    return;
                }


                const wishes =
                    Array.isArray(
                        response.wishes
                    )
                        ? response.wishes
                        : [];


                renderWishes(
                    wishes
                );


            } catch (error) {

                console.error(
                    "Wish rendering error:",
                    error
                );

                showLoadError();

            }


            // Remove callback
            try {

                delete window[
                    callbackName
                ];

            } catch (error) {

                // Ignore cleanup error
            }

        };


    // -----------------------------------------------------
    // CREATE SCRIPT REQUEST
    // -----------------------------------------------------

    const script =
        document.createElement(
            "script"
        );


    script.src =
        API_URL +
        "?action=wishes" +
        "&callback=" +
        callbackName +
        "&t=" +
        Date.now();


    script.async = true;


    // -----------------------------------------------------
    // REQUEST ERROR
    // -----------------------------------------------------

    script.onerror =
        function () {

            console.error(
                "Unable to connect to Birthday Wish API."
            );

            showLoadError();


            cleanupCallback(
                callbackName
            );

        };


    // -----------------------------------------------------
    // APPEND
    // -----------------------------------------------------

    document.body.appendChild(
        script
    );


    // -----------------------------------------------------
    // REMOVE SCRIPT AFTER REQUEST
    // -----------------------------------------------------

    setTimeout(
        function () {

            if (script.parentNode) {

                script.parentNode.removeChild(
                    script
                );

            }

        },
        15000
    );

}


// =========================================================
// RENDER WISHES
// =========================================================

function renderWishes(
    wishes
) {

    const wall =
        document.getElementById(
            "wishWall"
        );


    const wishCount =
        document.getElementById(
            "wishCount"
        );


    const peopleCount =
        document.getElementById(
            "peopleCount"
        );


    if (!wall) {

        return;
    }


    // -----------------------------------------------------
    // NORMALIZE DATA
    // -----------------------------------------------------

    const safeWishes =
        wishes
            .filter(
                function (wish) {

                    return (
                        wish &&
                        wish.name &&
                        wish.message
                    );

                }
            );


    // -----------------------------------------------------
    // UPDATE COUNTERS
    // -----------------------------------------------------

    if (wishCount) {

        animateCounter(
            wishCount,
            safeWishes.length
        );

    }


    if (peopleCount) {

        animateCounter(
            peopleCount,
            safeWishes.length
        );

    }


    // -----------------------------------------------------
    // EMPTY STATE
    // -----------------------------------------------------

    if (
        safeWishes.length === 0
    ) {

        showEmptyState();

        return;
    }


    // -----------------------------------------------------
    // BUILD CARDS
    // -----------------------------------------------------

    wall.innerHTML =
        safeWishes
            .map(
                function (
                    wish,
                    index
                ) {

                    return createWishCard(
                        wish,
                        index
                    );

                }
            )
            .join("");

}


// =========================================================
// CREATE WISH CARD
// =========================================================

function createWishCard(
    wish,
    index
) {

    const name =
        escapeHtml(
            wish.name
        );


    const relation =
        escapeHtml(
            wish.relation ||
            "Well-wisher"
        );


    const message =
        escapeHtml(
            wish.message
        );


    const date =
        formatDate(
            wish.date
        );


    const animationDelay =
        Math.min(
            index * 0.045,
            0.5
        );


    return `

        <article
            class="wish-card"
            style="
                animation-delay:
                ${animationDelay}s;
            "
        >

            <div class="wish-top">


                <div class="wish-person">

                    <div class="wish-name">

                        ${name}

                    </div>


                    <div class="wish-relation">

                        ${relation}

                    </div>

                </div>


                <div
                    class="wish-icon"
                    aria-hidden="true"
                >

                    💌

                </div>


            </div>


            <div class="wish-message">

                “${message}”

            </div>


            ${
                date
                    ? `
                        <div class="wish-date">

                            ${date}

                        </div>
                    `
                    : ""
            }

        </article>

    `;

}


// =========================================================
// EMPTY STATE
// =========================================================

function showEmptyState() {

    const wall =
        document.getElementById(
            "wishWall"
        );


    if (!wall) {

        return;
    }


    wall.innerHTML = `

        <div class="wall-empty">

            <div class="wall-empty-icon">

                💌

            </div>


            <h3>

                শুভেচ্ছার অপেক্ষায়...

            </h3>


            <p>

                এখনও কোনো approved birthday
                wish এখানে যোগ হয়নি।

                <br>

                প্রথম শুভেচ্ছাটি হয়তো আপনারই হতে পারে।

            </p>

        </div>

    `;

}


// =========================================================
// ERROR STATE
// =========================================================

function showLoadError() {

    const wall =
        document.getElementById(
            "wishWall"
        );


    if (!wall) {

        return;
    }


    wall.innerHTML = `

        <div class="wall-empty">

            <div class="wall-empty-icon">

                ⚠️

            </div>


            <h3>

                Wishes load করা যাচ্ছে না

            </h3>


            <p>

                এই মুহূর্তে birthday wishes
                load করতে সমস্যা হচ্ছে।

                <br>

                কিছুক্ষণ পরে আবার চেষ্টা করুন।

            </p>


            <button
                type="button"
                onclick="loadWishes()"
                style="
                    margin-top:18px;
                    padding:11px 17px;
                    border:0;
                    border-radius:11px;
                    background:#ffbd59;
                    color:#17110c;
                    font-weight:700;
                    cursor:pointer;
                "
            >

                ↻ Try Again

            </button>

        </div>

    `;

}


// =========================================================
// CONFIGURATION ERROR
// =========================================================

function showConfigurationError() {

    const wall =
        document.getElementById(
            "wishWall"
        );


    if (!wall) {

        return;
    }


    wall.innerHTML = `

        <div class="wall-empty">

            <div class="wall-empty-icon">

                ⚙️

            </div>


            <h3>

                Wish Wall configuration incomplete

            </h3>


            <p>

                Google Apps Script API URL
                এখনো configure করা হয়নি।

            </p>

        </div>

    `;

}


// =========================================================
// AUTO REFRESH
// =========================================================

function startAutoRefresh() {

    setInterval(
        function () {

            loadWishes();

        },
        REFRESH_INTERVAL
    );

}


// =========================================================
// COUNTER ANIMATION
// =========================================================

function animateCounter(
    element,
    target
) {

    const current =
        parseInt(
            element.textContent,
            10
        ) || 0;


    // যদি একই number হয়
    if (current === target) {

        element.textContent =
            target;

        return;
    }


    const duration =
        500;


    const startTime =
        performance.now();


    function update(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        // Ease-out
        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const value =
            Math.round(
                current +
                (
                    target -
                    current
                ) *
                eased
            );


        element.textContent =
            value;


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}


// =========================================================
// DATE FORMAT
// =========================================================

function formatDate(
    dateValue
) {

    if (!dateValue) {

        return "";
    }


    try {

        const date =
            new Date(
                dateValue
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";
        }


        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        const monthNames = [

            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",

            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"

        ];


        const month =
            monthNames[
                date.getMonth()
            ];


        const year =
            date.getFullYear();


        return (
            "Birthday wish • " +
            day +
            " " +
            month +
            " " +
            year
        );


    } catch (error) {

        return "";
    }

}


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHtml(
    value
) {

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


// =========================================================
// CALLBACK CLEANUP
// =========================================================

function cleanupCallback(
    callbackName
) {

    try {

        delete window[
            callbackName
        ];

    } catch (error) {

        // Ignore
    }

}
