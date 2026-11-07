export function registerPrintAction(button, printPage) {
  if (!button || typeof printPage !== "function") return () => {};

  const handlePrint = () => printPage();
  button.addEventListener("click", handlePrint);
  return () => button.removeEventListener("click", handlePrint);
}
