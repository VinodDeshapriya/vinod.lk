/**
 * Runs in <head> before the page paints: picks the visitor's saved theme, or the
 * system theme when they haven't chosen one, so there's no flash of the wrong mode.
 */
export const THEME_KEY = "theme";

export const themeScript = `(function(){try{var s=localStorage.getItem("${THEME_KEY}");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var e=document.documentElement;e.classList.toggle("dark",d);e.classList.toggle("light",!d);e.style.colorScheme=d?"dark":"light";}catch(_){}})();`;
