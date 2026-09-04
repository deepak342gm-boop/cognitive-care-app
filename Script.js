(function () {

  "use strict";


  /* =========================
     DEFAULT DATA
  ========================= */

  let data = JSON.parse(
    localStorage.getItem("cognitiveCareData")
  ) || {
    patient: {
      name: "",
      age: "",
      language: "en"
    },

    games: 0,
    bestScore: 0,
    reminders: [],
    streak: 0
  };


  let currentNumber = "";
  let gameDifficulty = 3;
  let currentScore = 0;


  /* =========================
     ELEMENTS
  ========================= */

  const loginScreen =
    document.getElementById("loginScreen");

  const mainApp =
    document.getElementById("mainApp");

  const nameInput =
    document.getElementById("loginName");

  const ageInput =
    document.getElementById("loginAge");

  const continueBtn =
    document.getElementById("continueBtn");

  const languageButtons =
    document.querySelectorAll(".language-btn");


  /* =========================
     LANGUAGE
  ========================= */

  let selectedLanguage =
    data.patient.language || "en";


  languageButtons.forEach(button => {

    button.addEventListener("click", function () {

      languageButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      this.classList.add("active");

      selectedLanguage =
        this.dataset.language;

    });

  });


  /* =========================
     LOGIN
  ========================= */

  continueBtn.addEventListener(
    "click",
    function () {

      const name =
        nameInput.value.trim();

      const age =
        ageInput.value.trim();


      if (!name) {

        alert(
          selectedLanguage === "hi"
            ? "Kripya patient ka naam enter karein."
            : "Please enter the patient name."
        );

        nameInput.focus();

        return;
      }


      if (!age || age < 1 || age > 120) {

        alert(
          selectedLanguage === "hi"
            ? "Kripya valid age enter karein."
            : "Please enter a valid age."
        );

        ageInput.focus();

        return;
      }


      data.patient.name = name;
      data.patient.age = age;
      data.patient.language =
        selectedLanguage;


      saveData();

      showMainApp();

    }
  );


  /* =========================
     SHOW APP
  ========================= */

  function showMainApp() {

    loginScreen.classList.add("hidden");

    mainApp.classList.remove("hidden");

    updatePatientInfo();

    updateDashboard();

    renderReminders();

    applyLanguage();

  }


  /* =========================
     PATIENT INFO
  ========================= */

  function updatePatientInfo() {

    document.getElementById(
      "patientName"
    ).textContent =
      data.patient.name || "Patient";


    document.getElementById(
      "patientAge"
    ).textContent =
      data.patient.age || "--";


    document.getElementById(
      "carePatientName"
    ).textContent =
      data.patient.name || "Patient";

  }


  /* =========================
     PROFILE BUTTON
  ========================= */

  document.getElementById(
    "changeProfileBtn"
  ).addEventListener(
    "click",
    function () {

      loginScreen.classList.remove("hidden");

      mainApp.classList.add("hidden");

      nameInput.value =
        data.patient.name;

      ageInput.value =
        data.patient.age;

      selectedLanguage =
        data.patient.language || "en";


      languageButtons.forEach(btn => {

        btn.classList.toggle(
          "active",
          btn.dataset.language ===
          selectedLanguage
        );

      });

    }
  );


  /* =========================
     NAVIGATION
  ========================= */

  window.openPage =
    function (pageName) {

      document.querySelectorAll(".tab")
        .forEach(tab => {

          tab.classList.remove("active");

          if (
            tab.dataset.page ===
            pageName
          ) {
            tab.classList.add("active");
          }

        });


      document.querySelectorAll(".page")
        .forEach(page => {

          page.classList.remove("active");

        });


      const page =
        document.getElementById(pageName);


      if (page) {

        page.classList.add("active");

      }

    };


  document.querySelectorAll(".tab")
    .forEach(tab => {

      tab.addEventListener(
        "click",
        function () {

          openPage(
            this.dataset.page
          );

        }
      );

    });


  /* =========================
     NUMBER MEMORY GAME
  ========================= */

  window.startNumberGame =
    function () {

      const length =
        gameDifficulty + 2;


      currentNumber = "";


      for (
        let i = 0;
        i < length;
        i++
      ) {

        currentNumber +=
          Math.floor(
            Math.random() * 10
          );

      }


      document.getElementById(
        "gameTitle"
      ).textContent =
        "🔢 Number Memory";


      const content =
        document.getElementById(
          "gameContent"
        );


      content.innerHTML = `

        <p>
          Remember this number:
        </p>

        <div class="number-display">
          ${currentNumber}
        </div>

        <p>
          Remember carefully...
        </p>

      `;


      setTimeout(
        function () {

          content.innerHTML = `

            <div class="game-question">
              What was the number?
            </div>

            <input
              id="numberAnswer"
              type="number"
              inputmode="numeric"
              placeholder="Enter number"
              style="
                padding:15px;
                font-size:20px;
                border-radius:10px;
                border:1px solid #ccc;
                width:220px;
              "
            >

            <br>

            <button
              class="primary"
              onclick="checkNumberAnswer()"
            >
              Check Answer
            </button>

          `;

        },
        2500
      );

    };


  window.checkNumberAnswer =
    function () {

      const answer =
        document.getElementById(
          "numberAnswer"
        ).value;


      if (
        answer === currentNumber
      ) {

        currentScore = 10;

        increaseDifficulty();

        gameResult(
          "🎉 Excellent!",
          "You remembered the number correctly."
        );

      } else {

        currentScore = 2;

        decreaseDifficulty();

        gameResult(
          "🙂 Good Try!",
          "Let's try again."
        );

      }


      recordGame();

    };


  /* =========================
     MEMORY MATCH
  ========================= */

  window.startMemoryGame =
    function () {

      const symbols = [
        "🍎",
        "🌸",
        "⭐",
        "🐟"
      ];


      let cards = [
        ...symbols,
        ...symbols
      ];


      cards.sort(
        () => Math.random() - 0.5
      );


      let first = null;
      let second = null;

      let locked = false;

      let matched = 0;


      document.getElementById(
        "gameTitle"
      ).textContent =
        "🃏 Memory Match";


      const area =
        document.getElementById(
          "gameContent"
        );


      area.innerHTML = `

        <p>
          Find all matching pairs.
        </p>

        <div
          id="memoryBoard"
          style="
            display:grid;
            grid-template-columns:
              repeat(4,70px);
            gap:10px;
            justify-content:center;
            margin:20px;
          "
        >
        </div>

      `;


      const board =
        document.getElementById(
          "memoryBoard"
        );


      cards.forEach(symbol => {

        const button =
          document.createElement(
            "button"
          );


        button.className =
          "option-btn";


        button.style.height =
          "70px";


        button.style.fontSize =
          "28px";


        button.textContent =
          "❓";


        button.dataset.symbol =
          symbol;


        button.addEventListener(
          "click",
          function () {

            if (
              locked ||
              this.classList.contains(
                "matched"
              ) ||
              this === first
            ) {
              return;
            }


            this.textContent =
              symbol;


            if (!first) {

              first = this;

              return;

            }


            second = this;

            locked = true;


            if (
              first.dataset.symbol ===
              second.dataset.symbol
            ) {

              first.classList.add(
                "matched"
              );

              second.classList.add(
                "matched"
              );


              matched++;


              first = null;

              second = null;

              locked = false;


              if (
                matched ===
                symbols.length
              ) {

                currentScore = 10;

                increaseDifficulty();

                gameResult(
                  "🎉 Wonderful!",
                  "You found all matching pairs."
                );

                recordGame();

              }

            } else {

              setTimeout(
                function () {

                  first.textContent =
                    "❓";

                  second.textContent =
                    "❓";

                  first = null;

                  second = null;

                  locked = false;

                },
                800
              );

            }

          }
        );


        board.appendChild(button);

      });

    };


  /* =========================
     PATTERN GAME
  ========================= */

  window.startPatternGame =
    function () {

      const patterns = [

        {
          sequence:
            "🔴 🔵 🔴 🔵",
          answer: "🔴"
        },

        {
          sequence:
            "⭐ 🌙 ⭐ 🌙",
          answer: "⭐"
        },

        {
          sequence:
            "🟢 🟡 🟢 🟡",
          answer: "🟢"
        }

      ];


      const selected =
        patterns[
          Math.floor(
            Math.random() *
            patterns.length
          )
        ];


      document.getElementById(
        "gameTitle"
      ).textContent =
        "🔷 Pattern Recognition";


      document.getElementById(
        "gameContent"
      ).innerHTML = `

        <div class="game-question">
          Complete the pattern
        </div>

        <div style="
          font-size:35px;
          margin:25px;
        ">
          ${selected.sequence} ❓
        </div>

        <div class="game-options">

          <button
            class="option-btn"
            onclick="checkPattern('🔴',
            '${selected.answer}')">
            🔴
          </button>

          <button
            class="option-btn"
            onclick="checkPattern('🔵',
            '${selected.answer}')">
            🔵
          </button>

          <button
            class="option-btn"
            onclick="checkPattern('⭐',
            '${selected.answer}')">
            ⭐
          </button>

          <button
            class="option-btn"
            onclick="checkPattern('🟢',
            '${selected.answer}')">
            🟢
          </button>

        </div>

      `;

    };


  window.checkPattern =
    function (answer, correct) {

      if (answer === correct) {

        currentScore = 10;

        increaseDifficulty();

        gameResult(
          "🎉 Correct!",
          "Great pattern recognition."
        );

      } else {

        currentScore = 2;

        decreaseDifficulty();

        gameResult(
          "🙂 Try Again",
          "Look carefully at the pattern."
        );

      }


      recordGame();

    };


  /* =========================
     GAME RESULT
  ========================= */

  function gameResult(
    title,
    message
  ) {

    document.getElementById(
      "gameContent"
    ).innerHTML = `

      <div
        style="
          padding:30px;
          text-align:center;
        "
      >

        <div style="
          font-size:55px;
        ">
          🌟
        </div>

        <h2>
          ${title}
        </h2>

        <p>
          ${message}
        </p>

        <button
          class="primary"
          onclick="startNumberGame()"
        >
          Play Again
        </button>

      </div>

    `;

  }


  /* =========================
     ADAPTIVE DIFFICULTY
  ========================= */

  function increaseDifficulty() {

    if (gameDifficulty < 8) {

      gameDifficulty++;

    }

  }


  function decreaseDifficulty() {

    if (gameDifficulty > 2) {

      gameDifficulty--;

    }

  }


  /* =========================
     RECORD GAME
  ========================= */

  function recordGame() {

    data.games++;


    if (
      currentScore >
      data.bestScore
    ) {

      data.bestScore =
        currentScore;

    }


    if (
      data.streak === 0
    ) {

      data.streak = 1;

    }


    saveData();

  }


  /* =========================
     REMINDERS
  ========================= */

  window.addReminder =
    function () {

      const text =
        document.getElementById(
          "reminderText"
        ).value.trim();


      const time =
        document.getElementById(
          "reminderTime"
        ).value;


      if (!text || !time) {

        alert(
          "Please enter reminder and time."
        );

        return;

      }


      data.reminders.push({
        text: text,
        time: time
      });


      document.getElementById(
        "reminderText"
      ).value = "";


      document.getElementById(
        "reminderTime"
      ).value = "";


      saveData();

      renderReminders();

    };


  window.deleteReminder =
    function (index) {

      data.reminders.splice(
        index,
        1
      );

      saveData();

      renderReminders();

    };


  function renderReminders() {

    const list =
      document.getElementById(
        "reminderList"
      );


    if (
      !data.reminders.length
    ) {

      list.innerHTML = `

        <div class="empty-game">

          ⏰

          <p>
            No reminders added yet.
          </p>

        </div>

      `;

      return;

    }


    list.innerHTML = "";


    data.reminders.forEach(
      (item, index) => {

        const div =
          document.createElement(
            "div"
          );


        div.className =
          "reminder-item";


        div.innerHTML = `

          <div>

            <strong>
              ⏰ ${item.time}
            </strong>

            <div>
              ${item.text}
            </div>

          </div>

          <button
            class="delete-btn"
            onclick="
              deleteReminder(${index})
            "
          >
            Delete
          </button>

        `;


        list.appendChild(div);

      }
    );

  }


  /* =========================
     DASHBOARD
  ========================= */

  function updateDashboard() {

    document.getElementById(
      "gamesPlayed"
    ).textContent =
      data.games;


    document.getElementById(
      "bestScore"
    ).textContent =
      data.bestScore;


    document.getElementById(
      "streak"
    ).textContent =
      data.streak;


    document.getElementById(
      "careGames"
    ).textContent =
      data.games;


    document.getElementById(
      "careScore"
    ).textContent =
      data.bestScore;


    document.getElementById(
      "careReminders"
    ).textContent =
      data.reminders.length;


    const engagement =
      Math.min(
        data.games * 5,
        100
      );


    document.getElementById(
      "careEngagement"
    ).textContent =
      engagement + "%";


    document.getElementById(
      "progressFill"
    ).style.width =
      engagement + "%";


    document.getElementById(
      "progressText"
    ).textContent =
      engagement +
      "% cognitive engagement based on activity.";

  }


  /* =========================
     VOICE
  ========================= */

  window.speakWelcome =
    function () {

      if (
        !("speechSynthesis" in window)
      ) {

        alert(
          "Voice assistance is not supported."
        );

        return;

      }


      let text;


      if (
        data.patient.language ===
        "hi"
      ) {

        text =
          "नमस्ते " +
          data.patient.name +
          "। कॉग्निटिव केयर में आपका स्वागत है। आप मेमोरी गेम खेल सकते हैं और अपने रिमाइंडर देख सकते हैं।";

      } else {

        text =
          "Hello " +
          data.patient.name +
          ". Welcome to Cognitive Care. You can play memory games and check your reminders.";

      }


      const speech =
        new SpeechSynthesisUtterance(
          text
        );


      speech.lang =
        data.patient.language ===
        "hi"
          ? "hi-IN"
          : "en-IN";


      speech.rate = 0.8;


      speechSynthesis.cancel();

      speechSynthesis.speak(
        speech
      );

    };


  /* =========================
     LANGUAGE UI
  ========================= */

  function applyLanguage() {

    if (
      data.patient.language ===
      "hi"
    ) {

      document.getElementById(
        "headerSubtitle"
      ).textContent =
        "AI आधारित संज्ञानात्मक सहायता";


      document.getElementById(
        "welcomeText"
      ).textContent =
        "आज अपने दिमाग को सक्रिय रखें।";


      document.getElementById(
        "homeTitle"
      ).textContent =
        "अपने दिमाग को सक्रिय रखें";


      document.getElementById(
        "homeDescription"
      ).textContent =
        "सरल cognitive games खेलें, दैनिक गतिविधियों को याद रखें और अपनी दिनचर्या पर नज़र रखें।";

    } else {

      document.getElementById(
        "headerSubtitle"
      ).textContent =
        "AI-Powered Cognitive Assistance";


      document.getElementById(
        "welcomeText"
      ).textContent =
        "Let's keep your mind active today.";


      document.getElementById(
        "homeTitle"
      ).textContent =
        "Keep Your Mind Active";


      document.getElementById(
        "homeDescription"
      ).textContent =
        "Play simple cognitive games, remember daily activities and stay on track with your routine.";

    }

  }


  /* =========================
     SAVE
  ========================= */

  function saveData() {

    localStorage.setItem(
      "cognitiveCareData",
      JSON.stringify(data)
    );

  }


  /* =========================
     INITIAL START
  ========================= */

  if (
    data.patient.name &&
    data.patient.age
  ) {

    showMainApp();

  } else {

    loginScreen.classList.remove(
      "hidden"
    );

    mainApp.classList.add(
      "hidden"
    );

  }

})();