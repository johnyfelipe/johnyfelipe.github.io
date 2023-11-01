src="../build/htmlAntiCopy.js"
const
    textEl = document.getElementById("text"),
    inputEl = document.getElementById("input"),
    levelEl = document.getElementById("level"),
    noCssEl = document.getElementById("noCss")
  var level = 1

  const toggleCss = () => {
    if (noCssEl.checked) textEl.querySelector("span").className += "-"
    else
      textEl.querySelector("span").className = textEl
        .querySelector("span")
        .className.replace("-", "")
  }

  inputEl.oninput = () => {
    textEl.innerHTML = antiCopy(inputEl.value, level)
    toggleCss()
    console.log(textEl.innerText)
  }
  inputEl.oninput()
  levelEl.oninput = () => {
    level = parseInt(levelEl.value)
    inputEl.oninput()
  }

  noCssEl.onclick = () => {
    toggleCss()
  }
  noCssEl.onclick()
