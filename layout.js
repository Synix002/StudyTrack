/* STUDY TRACK - НЭГ HTML ХУУДАСНЫ НАВИГАЦИ */

const menuItems = [
    ["⌂", "Нүүр", "home"],
    ["✎", "Миний тэмдэглэл", "diary"],
    ["▤", "Хичээлүүд", "classes"],
    ["◷", "Цаг хэмжигч", "timer"],
    ["✧", "Миний зорилгууд", "goals"],
    ["▥", "Статистик", "statistics"],
    ["▣", "Цээжлэх картууд", "flashcards"],
    ["⚙", "Тохиргоо", "settings"]
];

const pageNames = {
    home: "НҮҮР",
    diary: "МИНИЙ ТЭМДЭГЛЭЛ",
    classes: "ХИЧЭЭЛҮҮД",
    timer: "ЦАГ ХЭМЖИГЧ",
    goals: "МИНИЙ ЗОРИЛГУУД",
    statistics: "СТАТИСТИК",
    flashcards: "ЦЭЭЖЛЭХ КАРТУУД",
    settings: "ТОХИРГОО"
};

/* SIDEBAR ҮҮСГЭХ */

const sidebar = document.createElement("aside");
sidebar.className = "sidebar";

sidebar.innerHTML = `
    <div class="logo">
        <div class="logo-icon">✦</div>
        <div>
            <h2>STUDY TRACK</h2>
            <p>Суралцах аялал</p>
        </div>
    </div>

    <nav class="navigation"></nav>

    <div class="sidebar-footer">
        <p>Мэдлэг бол хүч юм.</p>
        <span>© 2026 STUDY TRACK</span>
    </div>
`;

const navigation = sidebar.querySelector(".navigation");

menuItems.forEach(item => {
    const link = document.createElement("a");

    link.href = "#" + item[2];
    link.className = "nav-link";
    link.dataset.page = item[2];

    link.innerHTML = `
        <span class="nav-icon">${item[0]}</span>
        <span>${item[1]}</span>
    `;

    navigation.appendChild(link);
});

const app = document.querySelector(".app");

if (app && !document.querySelector(".sidebar")) {
    app.prepend(sidebar);
}

/* ОГНОО */

const todayElement = document.getElementById("today");

if (todayElement) {
    todayElement.textContent = new Date().toLocaleDateString(
        "mn-MN",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}

/* ХУУДАСНЫ НАВИГАЦИ */

const pageOrder = [
    "home",
    "diary",
    "classes",
    "timer",
    "goals",
    "statistics",
    "flashcards",
    "settings"
];

let currentPageIndex = 0;

function showPage(pageId) {
    const newIndex = pageOrder.indexOf(pageId);

    if (newIndex === -1) return;

    const pages = document.querySelectorAll(".page-view");

    pages.forEach(page => {
        page.classList.remove("active", "exit-left", "exit-right");

        if (page.id === pageId) {
            page.classList.add("active");
        }
    });

    currentPageIndex = newIndex;

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.page === pageId
        );
    });

    const title = document.getElementById("pageTitle");

    if (title) {
        title.textContent = "STUDY TRACK / " + pageNames[pageId];
    }

    const pageNumber = document.getElementById("pageNumber");

    if (pageNumber) {
        pageNumber.textContent =
            `${currentPageIndex + 1} / ${pageOrder.length}`;
    }

    document.getElementById("previousPage").disabled =
        currentPageIndex === 0;

    document.getElementById("nextPage").disabled =
        currentPageIndex === pageOrder.length - 1;

    history.replaceState(null, "", "#" + pageId);
}

/* SIDEBAR CLICK */

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        showPage(link.dataset.page);
    });
});

/* NEXT BUTTON */

const nextButton = document.getElementById("nextPage");

if (nextButton) {
    nextButton.addEventListener("click", () => {
        if (currentPageIndex < pageOrder.length - 1) {
            showPage(pageOrder[currentPageIndex + 1]);
        }
    });
}

/* PREVIOUS BUTTON */

const previousButton = document.getElementById("previousPage");

if (previousButton) {
    previousButton.addEventListener("click", () => {
        if (currentPageIndex > 0) {
            showPage(pageOrder[currentPageIndex - 1]);
        }
    });
}

/* HOME BUTTON */

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.go);
    });
});

/* ЭХНИЙ ХУУДАС */

const startingPage = window.location.hash.replace("#", "");

showPage(
    pageOrder.includes(startingPage)
        ? startingPage
        : "home"
);