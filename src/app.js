import { sessions } from "./data.js";
import { renderDashboard } from "./dashboard.js";
import { registerPrintAction } from "./print.js";

renderDashboard(sessions);
registerPrintAction(document.querySelector("#print-dashboard"), () => window.print());

