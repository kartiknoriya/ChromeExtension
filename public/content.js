// Has access to websites dom

console.log("Content.js is working ");

document.addEventListener("mouseup", (e) => {
  console.log(e, "event");
  const selectedText = window.getSelection().toString().trim();

  console.log(selectedText, "selected text");

  if (selectedText.length > 15) {
    createButton(selectedText);
  }
});

function createButton(selectedText) {
  const btn = document.createElement('button')
    btn.innerText = 'Get Text'
    btn.style.backgroundColor = 'red'
    btn.style.position = 'fixed'
    btn.style.color = 'white'
    btn.style.padding = '5px'
    btn.style.zIndex = 999
    btn.style.top = '100px'
    btn.style.right = '30px'

    console.log(btn ,'btn')

    btn.addEventListener("click", ()=>sendTextToBackgound(selectedText))
    
    document.body.appendChild(btn)
}

function sendTextToBackgound(text){
     chrome.runtime.sendMessage(
      {
          type: `SELECTED_TEXT`,
          payload: text
      }
     )
}


