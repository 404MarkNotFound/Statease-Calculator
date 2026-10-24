// Team names, roles, and image paths used to build the dashboard cards.
      const TEAM_MEMBERS = [
        {
          name: "Lady Ann A. Ermita",
          role: "Team Leader",
          image: "./images/member1.jpg",
        },
        {
          name: "Monica Gaile H. Meriel",
          role: "Team Member",
          image: "./images/member2.jpg",
        },
        {
          name: "Maria Paula M. Gosorpe",
          role: "Team Member",
          image: "./images/member3.jpg",
        },
        {
          name: "Mark Niel Q. Raganit",
          role: "Team Member",
          image: "./images/member4.jpg",
        },
        {
          name: "Earl Cymhon M. Ciruela",
          role: "Team Member",
          image: "./images/member5.jpg",
        },
        {
          name: "Hardion King B. Parone",
          role: "Team Member",
          image: "./images/member6.jpg",
        },
        {
          name: "Maryll Joy A. Hita",
          role: "Team Member",
          image: "./images/member7.jpg",
        },
        {
          name: "Mark Ralph Lauren R. Macapas",
          role: "Team Member",
          image: "./images/member8.jpg",
        },
      ];

// Default avatar image used when a member does not have a photo.
      const personSvg = `

<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"

stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">

  <circle cx="12" cy="7.5" r="3.4"></circle>

  <path d="M4.8 20c.6-4.1 3.3-6.3 7.2-6.3s6.6 2.2 7.2 6.3"></path>

</svg>`;

// Find the dashboard container where the team cards will be displayed.
      const teamGrid = document.getElementById("teamGrid");
      teamGrid.classList.add("org-chart");

// Create one dashboard card from a team member object.
      function makeMemberCard(member, isLeader = false) {
        const card = document.createElement("article");
        card.className = "member-card" + (isLeader ? " leader-card" : "");

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        if (member.image) {
          const img = document.createElement("img");
          img.src = member.image;
          img.alt = member.name + " profile picture";
          img.loading = "eager";
          avatar.appendChild(img);
        } else {
          avatar.innerHTML = personSvg;
        }

        const info = document.createElement("div");
        info.className = "member-info";
        if (isLeader) {
          const kicker = document.createElement("p");
          kicker.className = "leader-kicker";
          info.appendChild(kicker);
        }

        const name = document.createElement("div");
        name.className = "member-name";
        name.textContent = member.name;

        const role = document.createElement("div");
        role.className = "member-role";
        role.textContent = member.role;

        info.append(name, role);
        card.append(avatar, info);
        return card;
      }

      teamGrid.replaceChildren();
      const leaderWrap = document.createElement("div");
      leaderWrap.className = "leader-wrap";
      leaderWrap.appendChild(makeMemberCard(TEAM_MEMBERS[0], true));
      teamGrid.appendChild(leaderWrap);

      const membersArea = document.createElement("section");
      membersArea.className = "members-area";
      membersArea.setAttribute("aria-label", "Team members");
      const membersHeading = document.createElement("div");
      membersHeading.className = "members-heading";
      const membersTitle = document.createElement("strong");
      membersTitle.textContent = "The team";
      const membersCount = document.createElement("span");
      membersCount.className = "members-count";
      membersCount.textContent = TEAM_MEMBERS.length - 1 + " members";
      membersHeading.append(membersTitle, membersCount);
      membersArea.appendChild(membersHeading);

      const firstRow = document.createElement("div");
      firstRow.className = "member-grid member-grid--three";
      TEAM_MEMBERS.slice(1, 4).forEach((member) =>
        firstRow.appendChild(makeMemberCard(member)),
      );
      membersArea.appendChild(firstRow);

      const secondRow = document.createElement("div");
      secondRow.className = "member-grid member-grid--four";
      TEAM_MEMBERS.slice(4, 8).forEach((member) =>
        secondRow.appendChild(makeMemberCard(member)),
      );
      membersArea.appendChild(secondRow);
      teamGrid.appendChild(membersArea);

      document.querySelectorAll(".nav button").forEach((button) => {
        button.addEventListener("click", () => {
          document.querySelectorAll(".nav button").forEach((item) => {
            item.classList.toggle("active", item === button);
          });

          document.querySelectorAll(".page").forEach((page) => {
            page.classList.toggle("active", page.id === button.dataset.page);
          });

          const mainContent = document.querySelector(".main");
          if (mainContent) mainContent.scrollTo({ top: 0, behavior: "auto" });
          window.scrollTo({ top: 0, behavior: "auto" });
          closeMobileMenu();
          saveAppState();
        });
      });

// Sidebar navigation and the mobile menu controls.
      const sidebarElement = document.querySelector(".sidebar");
      const mobileMenuToggle = document.getElementById("mobileMenuToggle");
      const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");

      function closeMobileMenu() {
        if (!sidebarElement || !mobileMenuToggle) return;
        sidebarElement.classList.remove("mobile-menu-open");
        document.body.classList.remove("mobile-menu-active");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        mobileMenuToggle.setAttribute("aria-label", "Open navigation menu");
      }

      if (sidebarElement && mobileMenuToggle && mobileMenuBackdrop) {
        mobileMenuToggle.addEventListener("click", () => {
          const willOpen =
            !sidebarElement.classList.contains("mobile-menu-open");
          sidebarElement.classList.toggle("mobile-menu-open", willOpen);
          document.body.classList.toggle("mobile-menu-active", willOpen);
          mobileMenuToggle.setAttribute("aria-expanded", String(willOpen));
          mobileMenuToggle.setAttribute(
            "aria-label",
            willOpen ? "Close navigation menu" : "Open navigation menu",
          );
        });
        mobileMenuBackdrop.addEventListener("click", closeMobileMenu);
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") closeMobileMenu();
        });
        window.addEventListener("resize", () => {
          if (window.innerWidth > 780) closeMobileMenu();
        });
      }

// Calculator input and current calculation history.
      const dataInput = document.getElementById("dataInput");

      const dataType = document.getElementById("dataType");

      dataType.addEventListener("change", () => {
        document.getElementById("frequencyHelp").style.display =
          dataType.value === "frequency" ? "block" : "none";
        saveAppState();
      });

      let historyItems = [];

// Key used to save this app state in the browser local storage.
      const APP_STORAGE_KEY = "statease_mstip_app_state_v1";

// Save the current page, input, settings, results, and history for the next visit.
      function saveAppState() {
        try {
          const activePage = document.querySelector(".page.active");
          const resultSection = document.getElementById("resultSection");
          const state = {
            currentPage: activePage ? activePage.id : "dashboard",
            dataInput: dataInput.value,
            dataType: dataType.value,
            rounding: document.getElementById("rounding").value,
            showSolution: document.getElementById("showSolutionSetting")
              .checked,
            showFrequency: document.getElementById("showFrequencySetting")
              .checked,
            historyItems: historyItems.slice(0, 20),
            results: {
              visible: resultSection.style.display !== "none",
              resultsHtml: document.getElementById("results").innerHTML,
              sortedData: document.getElementById("sortedData").textContent,
              solutionHtml: document.getElementById("solution").innerHTML,
              frequencyTableHtml:
                document.getElementById("frequencyTable").innerHTML,
            },
          };
          localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
          console.warn("StatEase could not save state in this browser.", error);
        }
      }

// Restore saved values when the page opens, if a saved state exists.
      function restoreAppState() {
        try {
          const raw = localStorage.getItem(APP_STORAGE_KEY);
          if (!raw) return;
          const state = JSON.parse(raw);
          if (!state || typeof state !== "object") return;

          if (typeof state.dataInput === "string")
            dataInput.value = state.dataInput;
          if (["ungrouped", "frequency"].includes(state.dataType))
            dataType.value = state.dataType;
          if (["0", "1", "2", "3", "4"].includes(String(state.rounding))) {
            document.getElementById("rounding").value = String(state.rounding);
          }
          if (typeof state.showSolution === "boolean") {
            document.getElementById("showSolutionSetting").checked =
              state.showSolution;
          }
          if (typeof state.showFrequency === "boolean") {
            document.getElementById("showFrequencySetting").checked =
              state.showFrequency;
          }

          const targetPage = document.getElementById(state.currentPage);
          if (targetPage && targetPage.classList.contains("page")) {
            document.querySelectorAll(".page").forEach((page) => {
              page.classList.toggle("active", page === targetPage);
            });
            document.querySelectorAll(".nav button").forEach((button) => {
              button.classList.toggle(
                "active",
                button.dataset.page === state.currentPage,
              );
            });
          }

          historyItems = Array.isArray(state.historyItems)
            ? state.historyItems.slice(0, 20)
            : [];
          renderHistory();

          if (state.results && typeof state.results === "object") {
            document.getElementById("results").innerHTML =
              state.results.resultsHtml || "";
            document.getElementById("sortedData").textContent =
              state.results.sortedData || "";
            document.getElementById("solution").innerHTML =
              state.results.solutionHtml || "";
            document.getElementById("frequencyTable").innerHTML =
              state.results.frequencyTableHtml || "";
            document.getElementById("resultSection").style.display = state
              .results.visible
              ? "block"
              : "none";
          }

          document.getElementById("frequencyHelp").style.display =
            dataType.value === "frequency" ? "block" : "none";
          const solution = document.getElementById("solution");
          solution.parentElement.style.display = document.getElementById(
            "showSolutionSetting",
          ).checked
            ? ""
            : "none";
          document
            .getElementById("frequencyTable")
            .closest(".panel").style.display = document.getElementById(
            "showFrequencySetting",
          ).checked
            ? ""
            : "none";
        } catch (error) {
          console.warn("StatEase could not restore saved state.", error);
        }
      }

// Round a number to the selected number of decimal places.
      function formatNumber(number, places) {
        return Number(number.toFixed(places)).toLocaleString(undefined, {
          maximumFractionDigits: places,

          minimumFractionDigits: places,
        });
      }

      // Sorted data should not force trailing .00 on whole numbers.
// Display whole-number data without adding unnecessary decimal zeros.
      function formatDataValue(number) {
        if (Number.isInteger(number)) return number.toLocaleString();
        return Number(number.toFixed(10)).toLocaleString(undefined, {
          maximumFractionDigits: 10,
        });
      }

// Read the input, calculate mean, median, and mode, then show the results.
      function calculate() {
        const error = document.getElementById("errorMessage");

        error.textContent = "";

        let pairs = [];

        if (dataType.value === "frequency") {
          const lines = dataInput.value
            .trim()

            .split(/[\n;]+/)

            .filter((line) => line.trim());

          for (const line of lines) {
            const parts = line.split(/[,\t ]+/).filter(Boolean);

            if (parts.length !== 2) {
              error.textContent =
                "Enter each frequency row as value,frequency. Example: 5,2";

              return;
            }

            const value = Number(parts[0]);

            const freq = Number(parts[1]);

            if (
              !Number.isFinite(value) ||
              !Number.isInteger(freq) ||
              freq < 1
            ) {
              error.textContent =
                "Use valid numbers and positive whole-number frequencies.";

              return;
            }

            pairs.push({ value, freq });
          }
        } else {
          const values = dataInput.value
            .trim()

            .split(/[,\s;]+/)

            .filter(Boolean)

            .map(Number);

          if (
            !values.length ||
            values.some((value) => !Number.isFinite(value))
          ) {
            error.textContent = "Please enter at least one valid number.";

            return;
          }

          const counts = new Map();

          values.forEach((value) => {
            counts.set(value, (counts.get(value) || 0) + 1);
          });

          pairs = [...counts].map(([value, freq]) => ({ value, freq }));
        }

        if (!pairs.length) {
          error.textContent = "Please enter your data first.";

          return;
        }

        const expanded = [];

        pairs.forEach((pair) => {
          for (let i = 0; i < pair.freq; i++) {
            expanded.push(pair.value);
          }
        });

        if (expanded.length > 10000) {
          error.textContent = "Please use 10,000 values or fewer.";

          return;
        }

        expanded.sort((a, b) => a - b);

        const n = expanded.length;

        const sum = expanded.reduce((a, b) => a + b, 0);

        const mean = sum / n;

        const median =
          n % 2
            ? expanded[Math.floor(n / 2)]
            : (expanded[n / 2 - 1] + expanded[n / 2]) / 2;

        const maxFrequency = Math.max(...pairs.map((pair) => pair.freq));

        const modes = pairs

          .filter((pair) => pair.freq === maxFrequency)

          .map((pair) => pair.value)

          .sort((a, b) => a - b);

        const places = Number(document.getElementById("rounding").value);

        const modeText =
          maxFrequency === 1
            ? "No mode"
            : modes.map((value) => formatNumber(value, places)).join(", ");

        document.getElementById("results").innerHTML = [
          ["Mean", formatNumber(mean, places), "Sum ÷ number of values"],

          [
            "Median",
            formatNumber(median, places),
            "Middle value of sorted data",
          ],

          [
            "Mode",
            modeText,
            maxFrequency === 1
              ? "All values occur once"
              : "Highest frequency: " + maxFrequency,
          ],
        ]
          .map(
            (item) => `

    <div class="result-card">

      <span>${item[0]}</span>

      <strong>${item[1]}</strong>

      <p>${item[2]}</p>

    </div>

  `,
          )
          .join("");

        document.getElementById("sortedData").textContent = expanded
          .map((value) => formatDataValue(value))
          .join(", ");

        let medianExplanation;

        if (n % 2 === 1) {
          medianExplanation =
            "The middle position is " +
            (Math.floor(n / 2) + 1) +
            ", so the median is " +
            formatNumber(median, places);
        } else {
          medianExplanation =
            "Average the two middle values " +
            formatNumber(expanded[n / 2 - 1], places) +
            " and " +
            formatNumber(expanded[n / 2], places) +
            ", giving " +
            formatNumber(median, places);
        }

        const solution = document.getElementById("solution");

        solution.innerHTML = `

    <p><b>Step 1 — Count (n):</b> ${n} value(s)</p>

    <p><b>Step 2 — Mean:</b> ${formatNumber(sum, places)} ÷ ${n}

      = <b>${formatNumber(mean, places)}</b></p>

    <p><b>Step 3 — Median:</b> ${medianExplanation}.</p>

    <p><b>Step 4 — Mode:</b>

      ${
        modeText === "No mode"
          ? "Every value occurs once, so there is no mode."
          : "The most frequent value(s) are " + modeText + "."
      }

    </p>

  `;

        solution.parentElement.style.display = document.getElementById(
          "showSolutionSetting",
        ).checked
          ? ""
          : "none";

        document.getElementById("frequencyTable").innerHTML = [...pairs]
          .sort((a, b) => a.value - b.value)
          .map(
            (pair) => `

      <tr>

        <td>${formatNumber(pair.value, places)}</td>

        <td>${pair.freq}</td>

      </tr>

    `,
          )
          .join("");

// Result display helpers.
        document
          .getElementById("frequencyTable")
          .closest(".panel").style.display = document.getElementById(
          "showFrequencySetting",
        ).checked
          ? ""
          : "none";

        document.getElementById("resultSection").style.display = "block";

        historyItems.unshift({
          n,
          mean: formatNumber(mean, places),
          median: formatNumber(median, places),
          mode: modeText,
          input: dataInput.value.trim(),
          time: new Date().toLocaleTimeString(),
        });
        // Keep a recent history so browser storage stays within safe limits.
        historyItems = historyItems.slice(0, 20);
        renderHistory();
        saveAppState();
      }

// Escape special characters before adding user-provided text to HTML.
      function escapeHTML(text) {
        return text.replace(
          /[&<>"']/g,
          (char) =>
            ({
              "&": "&amp;",

              "<": "&lt;",

              ">": "&gt;",

              '"': "&quot;",

              "'": "&#39;",
            })[char],
        );
      }

// Build the history list from the saved calculation entries.
      function renderHistory() {
        const historyList = document.getElementById("historyList");

        if (!historyItems.length) {
          historyList.className = "history-empty";

          historyList.textContent =
            "No calculations yet. Complete a calculation to see it here.";

          return;
        }

        historyList.className = "";

        historyList.innerHTML = historyItems
          .map(
            (item, index) => `

    <div class="history-item">

      <strong>Calculation ${historyItems.length - index}</strong>

      <small>${item.time} · ${item.n} values</small>

      <p style="font-size:13px">

        Mean: <b>${item.mean}</b> ·

        Median: <b>${item.median}</b> ·

        Mode: <b>${item.mode}</b>

      </p>

      <small>Data: ${escapeHTML(item.input)}</small>

    </div>

  `,
          )
          .join("");
      }

// Button and settings events connect page controls to their actions.
      document
        .getElementById("calculateBtn")

        .addEventListener("click", calculate);

      document.getElementById("clearBtn").addEventListener("click", () => {
        dataInput.value = "";
        document.getElementById("errorMessage").textContent = "";
        document.getElementById("resultSection").style.display = "none";
        saveAppState();
      });

      document
        .getElementById("clearHistoryBtn")
        .addEventListener("click", () => {
          historyItems = [];
          renderHistory();
          saveAppState();
        });

      document
        .getElementById("showSolutionSetting")
        .addEventListener("change", (event) => {
          if (
            document.getElementById("resultSection").style.display !== "none"
          ) {
            document.getElementById("solution").parentElement.style.display =
              event.target.checked ? "" : "none";
          }
          saveAppState();
        });

      document
        .getElementById("showFrequencySetting")
        .addEventListener("change", (event) => {
          document
            .getElementById("frequencyTable")
            .closest(".panel").style.display = event.target.checked
            ? ""
            : "none";
          saveAppState();
        });

      document.getElementById("editTeamBtn").addEventListener("click", () => {
        alert(
          "Find TEAM_MEMBERS near the top of this JavaScript code. " +
            "Replace Member 1–8 with your members' names and roles.",
        );
      });

      document.getElementById("logoutBtn").addEventListener("click", () => {
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) alert("You have been logged out.");
      });

      // Save form changes immediately; reload restores the page, input, results and history.
// Save edits as the user changes the input or rounding setting.
      dataInput.addEventListener("input", saveAppState);
      document
        .getElementById("rounding")
        .addEventListener("change", saveAppState);

// Restore saved app data after all page elements and event handlers are ready.
      restoreAppState();
