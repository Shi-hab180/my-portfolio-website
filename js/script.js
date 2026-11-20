
var TYPED_WORDS = [
    "Software Engineering Student",
    "Problem Solver",
    "Web Developer in the making",
    "Team Player"
];

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


document.getElementById("year").textContent = new Date().getFullYear();


var root = document.documentElement;
var themeLabel = document.getElementById("theme-label");

function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeLabel.textContent = theme === "dark" ? "☀" : "☾";   // icon = the theme you can switch TO
    try { localStorage.setItem("theme", theme); } catch (e) { /* storage blocked: ignore */ }
}

var savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) { savedTheme = null; }
setTheme(savedTheme === "light" ? "light" : "dark");

document.getElementById("theme").addEventListener("click", function () {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});


var typedBox = document.getElementById("typed");
var wordIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
    var word = TYPED_WORDS[wordIndex];
    typedBox.textContent = word.substring(0, charIndex);

    var delay = deleting ? 35 : 75;
    if (!deleting && charIndex === word.length) {
        deleting = true; delay = 1500;                     // pause when the word is complete
    } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % TYPED_WORDS.length;
        delay = 400;
    } else {
        charIndex += deleting ? -1 : 1;
    }
    setTimeout(typeLoop, delay);
}

if (reduceMotion) {
    typedBox.textContent = TYPED_WORDS[0];
} else {
    typeLoop();
}


var menu = document.getElementById("menu");
var burger = document.getElementById("burger");

burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.textContent = open ? "✕" : "☰";
});

function closeMenu() {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.textContent = "☰";
}


var menuLinks = document.querySelectorAll(".menu a");
var sections = document.querySelectorAll("main section[id]");
var progress = document.getElementById("progress");

for (var m = 0; m < menuLinks.length; m++) {
    menuLinks[m].addEventListener("click", closeMenu);
}

function onScroll() {
    var line = window.innerHeight * 0.35;
    var current = sections[0].id;

    for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= line) {
            current = sections[i].id;
        }
    }
    for (var j = 0; j < menuLinks.length; j++) {
        menuLinks[j].classList.toggle("on", menuLinks[j].hash === "#" + current);
    }

    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();


var bars = document.querySelectorAll(".bars li");
for (var b = 0; b < bars.length; b++) {
    bars[b].style.setProperty("--w", bars[b].getAttribute("data-level") + "%");
}

var revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                entries[i].target.classList.add("in");
                var inside = entries[i].target.querySelectorAll(".bars li");
                for (var k = 0; k < inside.length; k++) { inside[k].classList.add("go"); }
                observer.unobserve(entries[i].target);
            }
        }
    }, { threshold: 0.12 });

    for (var r = 0; r < revealItems.length; r++) { observer.observe(revealItems[r]); }
} else {
    // old browser / reduced motion: just show everything
    for (var r2 = 0; r2 < revealItems.length; r2++) { revealItems[r2].classList.add("in"); }
    for (var b2 = 0; b2 < bars.length; b2++) { bars[b2].classList.add("go"); }
}


var tabs = document.querySelectorAll('[role="tab"]');

function openTab(chosen) {
    for (var i = 0; i < tabs.length; i++) {
        var panel = document.getElementById(tabs[i].getAttribute("aria-controls"));
        var isChosen = tabs[i] === chosen;
        tabs[i].setAttribute("aria-selected", isChosen ? "true" : "false");
        tabs[i].tabIndex = isChosen ? 0 : -1;
        panel.hidden = !isChosen;
    }
    chosen.focus();
}

function setupTab(tab, number) {
    tab.addEventListener("click", function () { openTab(tab); });
    tab.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") { openTab(tabs[(number + 1) % tabs.length]); }
        if (event.key === "ArrowLeft") { openTab(tabs[(number - 1 + tabs.length) % tabs.length]); }
    });
}
for (var t = 0; t < tabs.length; t++) { setupTab(tabs[t], t); }


var toast = document.getElementById("toast");
var toastTimer = null;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
}


var copyButtons = document.querySelectorAll(".copy");

function setupCopyButton(button) {
    button.addEventListener("click", function () {
        var text = button.getAttribute("data-copy");
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function () {
                showToast("Copied: " + text);
            }).catch(function () {
                showToast("Press and hold to copy it");
            });
        } else {
            showToast("Press and hold to copy it");
        }
    });
}
for (var c = 0; c < copyButtons.length; c++) { setupCopyButton(copyButtons[c]); }


var viewer = document.getElementById("viewer");
var viewerImage = document.getElementById("viewer-img");
var certButtons = document.querySelectorAll(".cert-open");

function setupCertButton(button) {
    button.addEventListener("click", function () {
        viewerImage.onerror = function () {
            viewerImage.onerror = null;
            viewerImage.src = "images/placeholder.svg";
        };
        viewerImage.src = button.getAttribute("data-full");
        viewer.showModal();
    });
}
for (var k = 0; k < certButtons.length; k++) { setupCertButton(certButtons[k]); }

viewer.addEventListener("click", function (event) {
    if (event.target === viewer) { viewer.close(); }
});



var contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = contactForm.elements["name"].value;
    var email = contactForm.elements["email"].value;
    var message = contactForm.elements["message"].value;
    var to = document.getElementById("mail").getAttribute("href").replace("mailto:", "");

    var subject = encodeURIComponent("Portfolio message from " + name);
    var body = encodeURIComponent(message + "\n\n" + name + " (" + email + ")");

    window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
});


console.log("%c</> Hi! Thanks for checking the console. – Shihab", "color:#3fb950;font-family:monospace;font-size:14px");
