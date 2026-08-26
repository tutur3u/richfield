export type AdminTheme = "dark" | "light" | "system";

export const ADMIN_THEME_STORAGE_KEY = "richfield-admin-theme";

/**
 * Runs in the system layout's <head>, before the body can paint.
 *
 * The admin shell used to restore the preference from inside its own markup.
 * That was too late: the parent route loading boundary had already painted a
 * cream body, producing a bright full-page flash for dark-mode editors.
 */
export const ADMIN_THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  ADMIN_THEME_STORAGE_KEY,
)});if(t!=="light"&&t!=="dark"&&t!=="system"){t="system"}var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-admin-theme",t);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;
