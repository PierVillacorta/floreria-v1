import "@testing-library/jest-dom/vitest";

// jsdom no implementa <dialog>.showModal()/close(): los simulamos para poder
// probar los modales del panel de administración.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};