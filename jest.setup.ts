import "@testing-library/jest-dom"

// jsdom does not implement HTMLDialogElement.showModal / close
if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
    this.setAttribute("open", "")
  })
  HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open")
  })
}
