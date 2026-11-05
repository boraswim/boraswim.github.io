// Shared by every page. Load it in <head> (not deferred) so the saved theme and language apply before
// the page paints. It adds the EN/TR and light/dark switches to the end of the nav bar.
// Text is written once per language as sibling elements with lang="en" / lang="tr"; site.css hides the
// other language. A page's Turkish <title> goes in data-title-tr on <html>.
(function () {
  var root = document.documentElement;
  function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

  var theme = load("theme") === "light" ? "light" : "dark";
  var lang = load("lang") || ((navigator.language || "").toLowerCase().indexOf("tr") === 0 ? "tr" : "en");
  if (lang !== "tr") lang = "en";
  var titles = null;

  var TEXT = {
    en: { toLight: "Switch to light mode", toDark: "Switch to dark mode", language: "Language" },
    tr: { toLight: "Açık temaya geç", toDark: "Koyu temaya geç", language: "Dil" }
  };
  var SUN = '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var MOON = '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function apply() {
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-lang", lang);
    root.lang = lang;
    if (titles) document.title = titles[lang];
    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-set-lang") === lang));
    }
    var seg = document.querySelector(".seg");
    if (seg) seg.setAttribute("aria-label", TEXT[lang].language);
    var toggle = document.querySelector(".theme-btn");
    if (toggle) {
      var label = theme === "light" ? TEXT[lang].toDark : TEXT[lang].toLight;
      toggle.setAttribute("aria-label", label);
      toggle.title = label;
    }
  }
  apply();

  document.addEventListener("DOMContentLoaded", function () {
    titles = { en: document.title, tr: root.getAttribute("data-title-tr") || document.title };
    var nav = document.querySelector("nav .wrap");
    if (nav && !nav.querySelector(".switches")) {
      nav.insertAdjacentHTML("beforeend",
        '<div class="switches">' +
        '<div class="seg" role="group"><button type="button" data-set-lang="en">EN</button><button type="button" data-set-lang="tr">TR</button></div>' +
        '<button type="button" class="theme-btn">' + SUN + MOON + "</button></div>");
      nav.querySelector(".seg").addEventListener("click", function (e) {
        var target = e.target.closest("[data-set-lang]");
        if (!target) return;
        lang = target.getAttribute("data-set-lang");
        save("lang", lang);
        apply();
      });
      nav.querySelector(".theme-btn").addEventListener("click", function () {
        theme = theme === "light" ? "dark" : "light";
        save("theme", theme);
        apply();
      });
    }
    apply();
  });
})();
