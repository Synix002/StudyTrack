/* ========================================
   STUDY TRACK — ҮНДСЭН JAVASCRIPT
   Өгөгдөл localStorage-д хадгалагдана.
======================================== */

function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

const currentDate = new Date().toLocaleDateString("mn-MN");

// 1. ТЭМДЭГЛЭЛ
const diaryForm = document.getElementById("diaryForm");
const diaryList = document.getElementById("diaryList");

function showDiary() {
    if (!diaryList) return;
    const diaries = getData("studyDiary");
    diaryList.innerHTML = "";

    if (diaries.length === 0) {
        diaryList.innerHTML = '<p class="empty-state">Одоогоор тэмдэглэл байхгүй байна.</p>';
        return;
    }

    diaries.slice().reverse().forEach((diary, reverseIndex) => {
        const index = diaries.length - 1 - reverseIndex;
        const item = document.createElement("div");
        item.className = "entry-item";

        const title = document.createElement("h3");
        title.textContent = diary.title;
        const note = document.createElement("p");
        note.textContent = diary.note;
        const meta = document.createElement("div");
        meta.className = "entry-meta";
        meta.textContent = `${diary.minutes} минут • ${diary.date}`;

        const remove = document.createElement("button");
        remove.textContent = "Устгах";
        remove.className = "btn-secondary";
        remove.addEventListener("click", () => {
            diaries.splice(index, 1);
            saveData("studyDiary", diaries);
            refreshAll();
        });

        item.append(title, note, meta, remove);
        diaryList.appendChild(item);
    });
}

if (diaryForm) {
    diaryForm.addEventListener("submit", event => {
        event.preventDefault();
        const title = document.getElementById("diaryTitle").value.trim();
        const note = document.getElementById("diaryNote").value.trim();
        const minutes = Number(document.getElementById("diaryMinutes").value);

        if (!title || !note || minutes < 0) return;

        const diaries = getData("studyDiary");
        diaries.push({ title, note, minutes, date: currentDate });
        saveData("studyDiary", diaries);
        diaryForm.reset();
        refreshAll();
    });
}

// 2. ХИЧЭЭЛҮҮД
const subjectForm = document.getElementById("subjectForm");
const subjectList = document.getElementById("subjectList");

function showSubjects() {
    if (!subjectList) return;
    const subjects = getData("studySubjects");
    subjectList.innerHTML = "";

    if (subjects.length === 0) {
        subjectList.innerHTML = '<p class="empty-state">Хичээл бүртгээгүй байна.</p>';
        return;
    }

    subjects.forEach((subject, index) => {
        const item = document.createElement("div");
        item.className = "entry-item";
        const name = document.createElement("h3");
        name.textContent = subject.name;
        const description = document.createElement("p");
        description.textContent = subject.description || "Тайлбар оруулаагүй.";
        const remove = document.createElement("button");
        remove.textContent = "Устгах";
        remove.className = "btn-secondary";
        remove.addEventListener("click", () => {
            subjects.splice(index, 1);
            saveData("studySubjects", subjects);
            refreshAll();
        });
        item.append(name, description, remove);
        subjectList.appendChild(item);
    });
}

if (subjectForm) {
    subjectForm.addEventListener("submit", event => {
        event.preventDefault();
        const name = document.getElementById("subjectName").value.trim();
        const description = document.getElementById("subjectDescription").value.trim();
        if (!name) return;
        const subjects = getData("studySubjects");
        subjects.push({ name, description });
        saveData("studySubjects", subjects);
        subjectForm.reset();
        refreshAll();
    });
}

// 3. ЦАГ ХЭМЖИГЧ
const timerDisplay = document.getElementById("timerDisplay");
const timerStatus = document.getElementById("timerStatus");
const startButton = document.getElementById("startTimer");
const pauseButton = document.getElementById("pauseTimer");
const resetButton = document.getElementById("resetTimer");
const durationButtons = document.querySelectorAll(".duration-btn");

let selectedMinutes = 25;
let remainingSeconds = selectedMinutes * 60;
let timerInterval = null;
let sessionStarted = false;

function updateTimerDisplay() {
    if (!timerDisplay) return;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

function startTimer() {
    if (timerInterval || remainingSeconds <= 0) return;
    sessionStarted = true;
    if (timerStatus) timerStatus.textContent = "Хичээллэж байна. Амжилт хүсье!";
    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay();

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            if (timerStatus) timerStatus.textContent = "Хичээл дууслаа! Баяр хүргэе.";
            const diaries = getData("studyDiary");
            diaries.push({
                title: "Төвлөрсөн хичээл",
                note: "Цаг хэмжигчээр хичээллэв.",
                minutes: selectedMinutes,
                date: currentDate
            });
            saveData("studyDiary", diaries);
            sessionStarted = false;
            refreshAll();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    if (timerStatus) timerStatus.textContent = "Түр зогсоосон.";
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    remainingSeconds = selectedMinutes * 60;
    sessionStarted = false;
    updateTimerDisplay();
    if (timerStatus) timerStatus.textContent = "Дахин эхлэхэд бэлэн.";
}

if (startButton) startButton.addEventListener("click", startTimer);
if (pauseButton) pauseButton.addEventListener("click", pauseTimer);
if (resetButton) resetButton.addEventListener("click", resetTimer);

durationButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (timerInterval) return;
        selectedMinutes = Number(button.dataset.minutes);
        remainingSeconds = selectedMinutes * 60;
        durationButtons.forEach(item => item.classList.remove("selected"));
        button.classList.add("selected");
        updateTimerDisplay();
        if (timerStatus) timerStatus.textContent = `${selectedMinutes} минутын хугацаа сонголоо.`;
    });
});

// 4. ЗОРИЛГУУД
const goalForm = document.getElementById("goalForm");
const goalList = document.getElementById("goalList");

function showGoals() {
    if (!goalList) return;
    const goals = getData("studyGoals");
    goalList.innerHTML = "";

    if (goals.length === 0) {
        goalList.innerHTML = '<p class="empty-state">Одоогоор зорилго байхгүй байна.</p>';
        return;
    }

    goals.forEach((goal, index) => {
        const item = document.createElement("div");
        item.className = "entry-item";
        const name = document.createElement("h3");
        name.textContent = goal.name;
        const date = document.createElement("p");
        date.textContent = "Дуусгах хугацаа: " + goal.date;
        const remove = document.createElement("button");
        remove.textContent = "Устгах";
        remove.className = "btn-secondary";
        remove.addEventListener("click", () => {
            goals.splice(index, 1);
            saveData("studyGoals", goals);
            refreshAll();
        });
        item.append(name, date, remove);
        goalList.appendChild(item);
    });
}

if (goalForm) {
    goalForm.addEventListener("submit", event => {
        event.preventDefault();
        const name = document.getElementById("goalName").value.trim();
        const date = document.getElementById("goalDate").value;
        if (!name || !date) return;
        const goals = getData("studyGoals");
        goals.push({ name, date });
        saveData("studyGoals", goals);
        goalForm.reset();
        refreshAll();
    });
}

// 5. ЦЭЭЖЛЭХ КАРТУУД
const flashForm = document.getElementById("flashForm");
const flashList = document.getElementById("flashList");

function showFlashcards() {
    if (!flashList) return;
    const cards = getData("studyFlashcards");
    flashList.innerHTML = "";

    if (cards.length === 0) {
        flashList.innerHTML = '<p class="empty-state">Одоогоор карт байхгүй байна.</p>';
        return;
    }

    cards.forEach((card, index) => {
        const item = document.createElement("div");
        item.className = "entry-item";
        const question = document.createElement("h3");
        question.textContent = "Асуулт: " + card.question;
        const answer = document.createElement("p");
        answer.textContent = "Хариулт: " + card.answer;
        const remove = document.createElement("button");
        remove.textContent = "Устгах";
        remove.className = "btn-secondary";
        remove.addEventListener("click", () => {
            cards.splice(index, 1);
            saveData("studyFlashcards", cards);
            showFlashcards();
        });
        item.append(question, answer, remove);
        flashList.appendChild(item);
    });
}

if (flashForm) {
    flashForm.addEventListener("submit", event => {
        event.preventDefault();
        const question = document.getElementById("question").value.trim();
        const answer = document.getElementById("answer").value.trim();
        if (!question || !answer) return;
        const cards = getData("studyFlashcards");
        cards.push({ question, answer });
        saveData("studyFlashcards", cards);
        flashForm.reset();
        showFlashcards();
    });
}

// 6. ПРОФАЙЛЫН ТОХИРГОО
const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileMessage = document.getElementById("profileMessage");

function loadProfile() {
    const savedName = localStorage.getItem("studyProfile") || "";
    if (profileName) profileName.value = savedName;
    updateAvatar(savedName);
}

function updateAvatar(name) {
    const initial = name ? name.trim().charAt(0).toUpperCase() : "S";
    const avatar = document.getElementById("avatarInitial");
    const emblem = document.getElementById("profileEmblem");
    if (avatar) avatar.textContent = initial;
    if (emblem) emblem.textContent = initial;
}

if (profileForm) {
    profileForm.addEventListener("submit", event => {
        event.preventDefault();
        const name = profileName.value.trim();
        localStorage.setItem("studyProfile", name);
        updateAvatar(name);
        if (profileMessage) profileMessage.textContent = "Мэдээлэл амжилттай хадгалагдлаа.";
    });
}

// 7. СТАТИСТИК БА НҮҮРНИЙ МЭДЭЭЛЭЛ
function updateStatistics() {
    const diaries = getData("studyDiary");
    const subjects = getData("studySubjects");
    const goals = getData("studyGoals");
    const totalMinutes = diaries.reduce((sum, diary) => sum + Number(diary.minutes || 0), 0);

    const sessionsElement = document.getElementById("statSessions");
    const minutesElement = document.getElementById("statMinutes");
    const subjectsElement = document.getElementById("statSubjects");
    const goalsElement = document.getElementById("statGoals");

    if (sessionsElement) sessionsElement.textContent = diaries.length;
    if (minutesElement) minutesElement.textContent = totalMinutes;
    if (subjectsElement) subjectsElement.textContent = subjects.length;
    if (goalsElement) goalsElement.textContent = goals.length;

    const details = document.getElementById("statisticsDetails");
    if (details) {
        details.innerHTML = "";
        const rows = [
            ["Нийт хичээллэсэн удаа", diaries.length + " удаа"],
            ["Нийт суралцсан хугацаа", totalMinutes + " минут"],
            ["Бүртгэсэн хичээл", subjects.length + " хичээл"],
            ["Төлөвлөсөн зорилго", goals.length + " зорилго"]
        ];
        rows.forEach(row => {
            const line = document.createElement("div");
            line.className = "insight-row";
            const label = document.createElement("span");
            label.textContent = row[0];
            const value = document.createElement("b");
            value.textContent = row[1];
            line.append(label, value);
            details.appendChild(line);
        });
    }
}

function updateDashboard() {
    const diaries = getData("studyDiary");
    const subjects = getData("studySubjects");
    const goals = getData("studyGoals");
    const totalMinutes = diaries.reduce((sum, diary) => sum + Number(diary.minutes || 0), 0);

    const sessionsElement = document.getElementById("sessions");
    const minutesElement = document.getElementById("minutes");
    const subjectElement = document.getElementById("subjectCount");
    const goalElement = document.getElementById("homeGoalCount");
    const recentElement = document.getElementById("recent");

    if (sessionsElement) sessionsElement.textContent = diaries.length;
    if (minutesElement) minutesElement.textContent = totalMinutes;
    if (subjectElement) subjectElement.textContent = subjects.length;
    if (goalElement) goalElement.textContent = goals.length;

    if (recentElement) {
        recentElement.innerHTML = "";
        if (diaries.length === 0) {
            recentElement.innerHTML = '<p class="empty-state">Одоогоор бүртгэл байхгүй байна.</p>';
        } else {
            diaries.slice(-4).reverse().forEach(diary => {
                const item = document.createElement("div");
                item.className = "recent-item";
                const title = document.createElement("h3");
                title.textContent = diary.title;
                const meta = document.createElement("p");
                meta.textContent = `${diary.date} • ${diary.minutes} минут`;
                item.append(title, meta);
                recentElement.appendChild(item);
            });
        }
    }
}

function refreshAll() {
    showDiary();
    showSubjects();
    showGoals();
    updateStatistics();
    updateDashboard();
}

// 8. ХУУДАСНЫ НАВИГАЦИ
const pageNames = {
    home: "STUDY TRACK / НҮҮР",
    diary: "STUDY TRACK / МИНИЙ ТЭМДЭГЛЭЛ",
    classes: "STUDY TRACK / ХИЧЭЭЛҮҮД",
    timer: "STUDY TRACK / ЦАГ ХЭМЖИГЧ",
    goals: "STUDY TRACK / МИНИЙ ЗОРИЛГУУД",
    statistics: "STUDY TRACK / СТАТИСТИК",
    flashcards: "STUDY TRACK / ЦЭЭЖЛЭХ КАРТУУД",
    settings: "STUDY TRACK / ТОХИРГОО"
};

const pageOrder = ["home", "diary", "classes", "timer", "goals", "statistics", "flashcards", "settings"];
let currentPageIndex = 0;

function updatePageControls() {
    const number = document.getElementById("pageNumber");
    const previous = document.getElementById("previousPage");
    const next = document.getElementById("nextPage");

    if (number) number.textContent = `${currentPageIndex + 1} / ${pageOrder.length}`;
    if (previous) previous.disabled = currentPageIndex === 0;
    if (next) next.disabled = currentPageIndex === pageOrder.length - 1;
}

function showPage(pageId) {
    const index = pageOrder.indexOf(pageId);
    const selectedPage = document.getElementById(pageId);
    if (index === -1 || !selectedPage) return;

    currentPageIndex = index;
    document.querySelectorAll(".page-view").forEach(page => page.classList.remove("active"));
    selectedPage.classList.add("active");

    document.querySelectorAll(".nav-link[data-page]").forEach(link => {
        link.classList.toggle("active", link.dataset.page === pageId);
    });

    const title = document.getElementById("pageTitle");
    if (title) title.textContent = pageNames[pageId];

    history.replaceState(null, "", "#" + pageId);
    updatePageControls();
}

document.querySelectorAll(".nav-link[data-page]").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        showPage(link.dataset.page);
    });
});

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.go));
});

const previousPageButton = document.getElementById("previousPage");
const nextPageButton = document.getElementById("nextPage");

if (previousPageButton) {
    previousPageButton.addEventListener("click", () => {
        if (currentPageIndex > 0) showPage(pageOrder[currentPageIndex - 1]);
    });
}

if (nextPageButton) {
    nextPageButton.addEventListener("click", () => {
        if (currentPageIndex < pageOrder.length - 1) showPage(pageOrder[currentPageIndex + 1]);
    });
}

// 9. ЭХЛЭЛИЙН ТОХИРГОО
const todayElement = document.getElementById("today");
if (todayElement) {
    todayElement.textContent = new Date().toLocaleDateString("mn-MN", {
        year: "numeric", month: "long", day: "numeric"
    });
}

loadProfile();
refreshAll();
updateTimerDisplay();

const initialPage = location.hash.replace("#", "");
showPage(pageOrder.includes(initialPage) ? initialPage : "home");
/* =====================================
   SETTINGS - ТОХИРГООНЫ ҮЙЛДЛҮҮД
===================================== */

// Хадгалсан тохиргоог ачаалах

const dailyTarget = document.getElementById("dailyTarget");
const focusDuration = document.getElementById("focusDuration");
const breakDuration = document.getElementById("breakDuration");

const savedStudySettings = JSON.parse(
    localStorage.getItem("studySettings")
) || {};

if (dailyTarget && savedStudySettings.dailyTarget) {
    dailyTarget.value = savedStudySettings.dailyTarget;
}

if (focusDuration && savedStudySettings.focusDuration) {
    focusDuration.value = savedStudySettings.focusDuration;
}

if (breakDuration && savedStudySettings.breakDuration) {
    breakDuration.value = savedStudySettings.breakDuration;
}


// Суралцах тохиргоо хадгалах

const saveStudySettings = document.getElementById("saveStudySettings");

if (saveStudySettings) {
    saveStudySettings.addEventListener("click", () => {

        const settings = {
            dailyTarget: dailyTarget.value,
            focusDuration: focusDuration.value,
            breakDuration: breakDuration.value
        };

        localStorage.setItem(
            "studySettings",
            JSON.stringify(settings)
        );

        // Цаг хэмжигчийн хугацааг шинэчлэх
        if (typeof timerInterval !== "undefined" && !timerInterval) {
            remainingSeconds = Number(focusDuration.value) * 60;
            updateTimerDisplay();
        }

        document.getElementById("studySettingsMessage").textContent =
            "Тохиргоо амжилттай хадгалагдлаа.";
    });
}


// Гадаад үзэмжийн тохиргоо

const glowToggle = document.getElementById("glowToggle");
const goldToggle = document.getElementById("goldToggle");

const savedAppearance = JSON.parse(
    localStorage.getItem("studyAppearance")
) || {};

if (glowToggle) {
    glowToggle.checked = savedAppearance.glow !== false;
}

if (goldToggle) {
    goldToggle.checked = savedAppearance.gold !== false;
}

function applyAppearance() {
    document.body.classList.toggle(
        "glow-disabled",
        !glowToggle.checked
    );

    document.body.classList.toggle(
        "gold-disabled",
        !goldToggle.checked
    );
}

applyAppearance();

const saveAppearance = document.getElementById("saveAppearance");

if (saveAppearance) {
    saveAppearance.addEventListener("click", () => {

        localStorage.setItem(
            "studyAppearance",
            JSON.stringify({
                glow: glowToggle.checked,
                gold: goldToggle.checked
            })
        );

        applyAppearance();

        document.getElementById("appearanceMessage").textContent =
            "Үзэмжийн тохиргоо хадгалагдлаа.";
    });
}


// Өгөгдлийн тоог харуулах

function updateSettingsData() {

    document.getElementById("settingsDiaryCount").textContent =
        getData("studyDiary").length;

    document.getElementById("settingsSubjectCount").textContent =
        getData("studySubjects").length;

    document.getElementById("settingsGoalCount").textContent =
        getData("studyGoals").length;

    document.getElementById("settingsFlashCount").textContent =
        getData("studyFlashcards").length;
}

updateSettingsData();


// Бүх суралцах мэдээллийг устгах

const clearStudyData = document.getElementById("clearStudyData");

if (clearStudyData) {
    clearStudyData.addEventListener("click", () => {

        const confirmDelete = confirm(
            "Та бүх тэмдэглэл, хичээл, зорилго болон цээжлэх картаа устгахдаа итгэлтэй байна уу?"
        );

        if (!confirmDelete) return;

        localStorage.removeItem("studyDiary");
        localStorage.removeItem("studySubjects");
        localStorage.removeItem("studyGoals");
        localStorage.removeItem("studyFlashcards");

        showDiary();
        showSubjects();
        showGoals();
        showFlashcards();

        updateDashboard();
        updateStatistics();
        updateSettingsData();

        alert("Суралцах мэдээллийг амжилттай устгалаа.");
    });
}


// Профайлын үсгийг шинэчлэх

const profileAvatar = document.getElementById("profileAvatar");
const profileNameInput = document.getElementById("profileName");

if (profileAvatar && profileNameInput) {

    function updateAvatar() {
        profileAvatar.textContent =
            profileNameInput.value.trim().charAt(0).toUpperCase() || "S";
    }

    updateAvatar();

    profileNameInput.addEventListener("input", updateAvatar);

    profileForm.addEventListener("submit", updateAvatar);
}