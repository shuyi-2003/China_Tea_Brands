
"use strict";


const themeButton = document.getElementById("themeButton");

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-mode", isDark);

    if (themeButton) {
        themeButton.textContent = isDark ? "☀ Light" : "☾ Dark";
        themeButton.setAttribute("aria-pressed", String(isDark));
    }
}

let savedTheme = "light";

try {
    savedTheme = localStorage.getItem("sipChinaTheme") || "light";
} catch (error) {
    savedTheme = "light";
}

applyTheme(savedTheme);

if (themeButton) {
    themeButton.addEventListener("click", function () {
        const nextTheme = document.body.classList.contains("dark-mode")
            ? "light"
            : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("sipChinaTheme", nextTheme);
        } catch (error) {
            console.warn('Theme persistence failed; applies to current session only:', error);
        }
    });
}

const liveClock = document.getElementById("liveClock");
const greeting = document.getElementById("greeting");

function updateClock() {
    if (!liveClock || !greeting) return;

    const now = new Date();
    const hour = now.getHours();

    let message;

    if (hour >= 5 && hour < 12) {
        message = "Good morning. Start with a fresh tea.";
    } 
	else if (hour >= 12 && hour < 17) {
        message = "Good afternoon. Take a little tea break.";
    } 
	else if (hour >= 17 && hour < 21) {
        message = "Good evening. Unwind with a cup of tea.";
    } 
	else {
        message = "Slow down. Make your nights easier.";
    }

    greeting.textContent = message;

    liveClock.textContent = now.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
    });
}

updateClock();
window.setInterval(updateClock, 1000);


const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "×" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });
}


const drinkGrid = document.getElementById("drinkGrid");
const filterButtons = document.querySelectorAll(".filter-button");
const drinkSearch = document.getElementById("drinkSearch");
const drinkCount = document.getElementById("drinkCount");
const emptyMessage = document.getElementById("emptyMessage");

let currentFilter = "all";

function getDrinkCards() {
    return drinkGrid
        ? Array.from(drinkGrid.querySelectorAll(".drink-card"))
        : [];
}

function updateDrinks() {
    if (!drinkGrid) return;

    const searchTerm = drinkSearch
        ? drinkSearch.value.trim().toLowerCase()
        : "";

    let visibleCount = 0;

    getDrinkCards().forEach(function (card) {
        const brand = card.dataset.brand || "";
        const text = card.textContent.toLowerCase();

        const matchesBrand =
            currentFilter === "all" || brand === currentFilter;

        const matchesSearch = text.includes(searchTerm);
        const isVisible = matchesBrand && matchesSearch;

        card.hidden = !isVisible;

        if (isVisible) {
            visibleCount++;
        }
    });

    if (drinkCount) {
        drinkCount.textContent =
            visibleCount + (visibleCount === 1
                ? " drink to explore"
                : " drinks to explore");
    }

    if (emptyMessage) {
        emptyMessage.hidden = visibleCount !== 0;
    }
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter || "all";

        filterButtons.forEach(function (item) {
            const isActive = item === button;

            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });

        updateDrinks();
    });
});

if (drinkSearch) {
    drinkSearch.addEventListener("input", updateDrinks);
}

updateDrinks();




if (drinkGrid) {
    drinkGrid.addEventListener("click", function (event) {
        const target = event.target;

        if (!(target instanceof Element)) return;

        // Favorite button
        const favoriteButton = target.closest(".favorite-button");

        if (favoriteButton) {
            const isFavorite =
                favoriteButton.getAttribute("aria-pressed") === "true";

            const nextState = !isFavorite;

            favoriteButton.setAttribute(
                "aria-pressed",
                String(nextState)
            );

            favoriteButton.textContent = nextState
                ? "♥ Favorited"
                : "♡ Favorite";

            return;
        }

        // Remove button
        const removeButton = target.closest(".remove-button");

        if (removeButton) {
            const card = removeButton.closest(".drink-card");

            if (card) {
                card.remove();
                updateDrinks();

                if (addDrinkMessage) {
                    addDrinkMessage.textContent =
                        "Drink removed from the collection.";
                }
            }
        }
    });
}


const addDrinkForm = document.getElementById("addDrinkForm");
const addDrinkMessage = document.getElementById("addDrinkMessage");

const brandNames = {
    ama: "阿嬷手作 · AMA",
    heytea: "喜茶 · HEYTEA",
    chabaidao: "茶百道 · CHAPANDA",
    chayan: "茶颜悦色 · SEXY TEA",
    chagee: "霸王茶姬 · CHAGEE",
	mixue: "蜜雪冰城 · MIXUE"
};

const drinkImages = {
    ama: "https://resource02.ulifestyle.com.hk/ulcms/content/article/image/w600/2025/03/20250326120129_96834605d61d5a08d4d2bcda5a72c3f1a76585a4.jpg",
    heytea: "https://tb-static.uber.com/prod/image-proc/processed_images/83206fa738e83ccd9ed00fc1040432d4/30be7d11a3ed6f6183354d1933fbb6c7.jpeg",
    chabaidao: "https://tb-static.uber.com/prod/image-proc/processed_images/67fe9c9ea65c1abec1897d9e8a921c0c/6ea4f72e303000fbf403bbb36f971f85.jpeg",
    chayan: "https://tse2.mm.bing.net/th/id/OIP.8WXN5uU09kJu8uQ94ErFQAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    chagee: "https://th.bing.com/th/id/R.4077d5acf55b9bfc763a05e026d7313d?rik=ojbe1I1l3uvVFg&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20250306s%2f17%2fw1035h582%2f20250306%2f69ff-4519f468bf7f0c010b7b56194580f607.jpg&ehk=FHwiDhmueuIP9BRTJuZc6aMlY2ckF5hRCvJPWCZCRN0%3d&risl=&pid=ImgRaw&r=0",
	mixue: "https://i.pinimg.com/originals/01/2e/a7/012ea762df53b284745bb702b7039012.jpg"
};

if (addDrinkForm && drinkGrid) {
    addDrinkForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInput = document.getElementById("newDrinkName");
        const brandInput = document.getElementById("newDrinkBrand");

        const name = nameInput.value.trim();
        const brand = brandInput.value;

        if (!name || !brandNames[brand]) {
            addDrinkMessage.textContent =
                "Please enter a drink name and choose a brand.";
            return;
        }

        const card = document.createElement("article");
        card.className = "drink-card";
        card.dataset.brand = brand;

        const imageWrap = document.createElement("div");
        imageWrap.className = "drink-image";

        const img = document.createElement("img");
        img.src = drinkImages[brand];
        img.alt = name;
        img.loading = "lazy";

        const imageIndex = document.createElement("span");
        imageIndex.className = "image-index";
        imageIndex.textContent = String(getDrinkCards().length + 1).padStart(2, "0");

        imageWrap.append(img, imageIndex);

        const info = document.createElement("div");
        info.className = "drink-info";

        const brandLabel = document.createElement("p");
        brandLabel.className = "drink-brand";
        brandLabel.textContent = brandNames[brand];

        const title = document.createElement("h3");
        title.textContent = name;

        const description = document.createElement("p");
        description.textContent =
            "Your personal addition to the Sip China tea collection.";

        const actions = document.createElement("div");
        actions.className = "card-actions";

        const favorite = document.createElement("button");
        favorite.className = "favorite-button";
        favorite.type = "button";
        favorite.setAttribute("aria-pressed", "false");
        favorite.textContent = "♡ Favorite";

        const remove = document.createElement("button");
        remove.className = "remove-button";
        remove.type = "button";
        remove.setAttribute("aria-label", "Remove " + name);
        remove.textContent = "×";

        actions.append(favorite, remove);
        info.append(brandLabel, title, description, actions);
        card.append(imageWrap, info);
        drinkGrid.appendChild(card);

        addDrinkForm.reset();
        currentFilter = "all";

        filterButtons.forEach(function (button) {
            const isActive = button.dataset.filter === "all";
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        if (drinkSearch) {
            drinkSearch.value = "";
        }

        updateDrinks();

        addDrinkMessage.textContent =
            name + " was added to your collection.";
    });
}


const recommendButton = document.getElementById("recommendButton");
const recommendationText = document.getElementById("recommendationText");

if (recommendButton && recommendationText) {
    recommendButton.addEventListener("click", function () {
        const availableCards = getDrinkCards().filter(function (card) {
            return !card.hidden;
        });

        if (availableCards.length === 0) {
            recommendationText.textContent =
                "No drinks are available. Try another filter.";
            return;
        }

        const index = Math.floor(Math.random() * availableCards.length);
        const chosenCard = availableCards[index];
        const chosenName = chosenCard.querySelector("h3");

        recommendationText.textContent = chosenName
            ? "Your next sip: " + chosenName.textContent + "!"
            : "Enjoy discovering a new tea!";
    });
}


const teaSurveyForm = document.getElementById("teaSurveyForm");

if (teaSurveyForm) {
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const brandField = document.getElementById("favoriteBrand");
    const commentField = document.getElementById("comment");
    const formStatus = document.getElementById("formStatus");

    const fields = [
        {
            input: nameField,
            error: document.getElementById("nameError"),
            message: "Please enter your name."
        },
        {
            input: emailField,
            error: document.getElementById("emailError"),
            message: "Please enter a valid email address."
        },
        {
            input: brandField,
            error: document.getElementById("brandError"),
            message: "Please select your favorite brand."
        },
        {
            input: commentField,
            error: document.getElementById("commentError"),
            message: "Please share your comments."
        }
    ];

    function validateField(field) {
        const value = field.input.value.trim();
        let message = "";

        if (!value) {
            message = field.message;
        } else if (field.input.type === "email") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(value)) {
                message = "Please enter a valid email address.";
            }
        }

        field.error.textContent = message;
        field.input.setAttribute(
            "aria-invalid",
            String(message !== "")
        );

        return message === "";
    }

    fields.forEach(function (field) {
        field.input.addEventListener("input", function () {
            validateField(field);
        });

        field.input.addEventListener("change", function () {
            validateField(field);
        });
    });

    teaSurveyForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = true;

        fields.forEach(function (field) {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            formStatus.hidden = false;
            formStatus.className = "form-status error";
            formStatus.textContent =
                "Please correct the highlighted fields before submitting.";

            const firstInvalid = fields.find(function (field) {
                return field.input.getAttribute("aria-invalid") === "true";
            });

            if (firstInvalid) {
                firstInvalid.input.focus();
            }

            return;
        }

        const answers = {
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            favoriteBrand: brandField.value,
            teaType: teaSurveyForm.querySelector(
                'input[name="teaType"]:checked'
            ).value,
            comment: commentField.value.trim()
        };

        formStatus.hidden = false;
        formStatus.className = "form-status success";
        formStatus.textContent =
            "Thank you, " + answers.name +
            "! Your survey has been validated successfully.";


        teaSurveyForm.reset();

        fields.forEach(function (field) {
            field.error.textContent = "";
            field.input.setAttribute("aria-invalid", "false");
        });
    });
	
	teaSurveyForm.addEventListener("reset", function () {

        setTimeout(function () {

            nameError.textContent = "";
            emailError.textContent = "";
            brandError.textContent = "";
            commentError.textContent = "";

            formStatus.textContent = "";
            formStatus.hidden = true;
            formStatus.classList.remove("success");

        }, 0);
	});
}
