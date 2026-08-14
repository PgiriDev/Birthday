// ======================================================
// CONFIG
// ======================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbyjduPf9bP81ZpJyjTjHyyKdjpZmOoP-KeQVERAColHR2JP8hf0cHwM30XluqBCLKVgwQ/exec";


// ======================================================
// INITIAL LOAD
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadWishes();

    setupCharacterCounter();

    setupSubmitHandler();

  }
);


// ======================================================
// LOAD APPROVED WISHES
// ======================================================

function loadWishes() {

  const callbackName =
    "birthdayWishesCallback";

  window[callbackName] =
    function (response) {

      if (
        !response ||
        !response.success
      ) {

        showError();

        return;
      }

      renderWishes(
        response.wishes || []
      );

    };


  const script =
    document.createElement("script");

  script.src =
    API_URL +
    "?action=wishes" +
    "&callback=" +
    callbackName +
    "&t=" +
    Date.now();

  script.onerror = function () {

    showError();

  };

  document.body.appendChild(script);
}


// ======================================================
// RENDER WISHES
// ======================================================

function renderWishes(wishes) {

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


  wishCount.textContent =
    wishes.length;

  peopleCount.textContent =
    wishes.length;


  if (!wishes.length) {

    wall.innerHTML = `
      <div class="empty">
        💌 Be the first person to leave a wish.
      </div>
    `;

    return;
  }


  wall.innerHTML =
    wishes.map(function (wish) {

      return `
        <article class="wish-card">

          <div class="wish-top">

            <div>

              <div class="wish-name">
                ${escapeHtml(wish.name)}
              </div>

              <div class="wish-relation">
                ${escapeHtml(wish.relation)}
              </div>

            </div>

            <div>
              💌
            </div>

          </div>

          <div class="wish-message">
            “${escapeHtml(wish.message)}”
          </div>

        </article>
      `;

    }).join("");
}


// ======================================================
// SUBMIT HANDLER
// ======================================================

function setupSubmitHandler() {

  const form =
    document.getElementById(
      "wishForm"
    );

  const frame =
    document.getElementById(
      "submitFrame"
    );

  const success =
    document.getElementById(
      "successMessage"
    );

  const button =
    document.getElementById(
      "submitButton"
    );


  let submitted = false;


  form.addEventListener(
    "submit",
    function () {

      submitted = true;

      button.disabled = true;

      button.textContent =
        "Sending your wish...";

    }
  );


  frame.addEventListener(
    "load",
    function () {

      if (!submitted) {
        return;
      }

      submitted = false;

      form.reset();

      document.getElementById(
        "characterCount"
      ).textContent = "0";


      button.disabled = false;

      button.textContent =
        "🎁 Send My Wish";


      success.style.display =
        "block";


      setTimeout(function () {

        success.style.display =
          "none";

      }, 7000);

    }
  );
}


// ======================================================
// CHARACTER COUNTER
// ======================================================

function setupCharacterCounter() {

  const textarea =
    document.querySelector(
      'textarea[name="message"]'
    );

  const counter =
    document.getElementById(
      "characterCount"
    );


  textarea.addEventListener(
    "input",
    function () {

      counter.textContent =
        textarea.value.length;

    }
  );
}


// ======================================================
// SCROLL
// ======================================================

function scrollToWishForm() {

  document
    .getElementById("wishSection")
    .scrollIntoView({
      behavior: "smooth"
    });

}


// ======================================================
// ERROR
// ======================================================

function showError() {

  document.getElementById(
    "wishWall"
  ).innerHTML = `
    <div class="empty">
      Unable to load wishes right now.
      Please try again later.
    </div>
  `;

}


// ======================================================
// SECURITY
// ======================================================

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

setInterval(
  loadWishes,
  60000
);
