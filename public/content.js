// Has access to websites dom

console.log("Content.js is working ");

// let btn = null;
document.addEventListener("mouseup", (e) => {
  console.log(e, "event");
  const selectedText = window.getSelection().toString().trim();

  console.log(selectedText, "selected text");

  if (selectedText.length > 15) {
    createButton(selectedText);
  }
});

function createButton(selectedText) {
  // if (btn) {
  //   btn.remove();
  // }

 let btn = document.createElement("button");
  btn.innerText = "Get Text";
  btn.style.backgroundColor = "red";
  btn.style.position = "fixed";
  btn.style.color = "white";
  btn.style.padding = "5px";
  btn.style.zIndex = 999;
  btn.style.top = "100px";
  btn.style.right = "30px";

  console.log(btn, "btn");

  btn.addEventListener("click", () => sendTextToBackgound(selectedText));

  document.body.appendChild(btn);
}

 async function sendTextToBackgound(text) {

   console.log("sending message to bg.js")

   
       const storage = await chrome.storage.local.get(["resume"])

          console.log(storage, "complete storage")
        


    if(!storage.resume){
     alert("Upload resume")
     return
  }

  //  check if the resume is uploaded or not 

  chrome.runtime.sendMessage({
    type: `SELECTED_TEXT`,
    payload: text , 
  });
}
//  {selectedText : text ,  resume: storage.resume} 