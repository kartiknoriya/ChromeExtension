console.log("background is running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message reading ", message);

  if (message.type === `SELECTED_TEXT`) {
    console.log(message.payload, "selected text");

    //       const resume = await chrome.storage.local.get(["resume"])

    //       console.log(resume , "selected resume base 64")

    callApi(message , sendResponse) // calling callApi 

    return true;
  }
});

async function callApi(message , sendResponse) {
  console.log(message, "data coming from content to background");

 
  const body = {
    resumeInBase64: message.payload.resume.content,
    jd: message.payload.jd,
  };
  console.log(body, "body");
 

  fetch(`http://localhost:4000/get-ats`, 
    
    {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  })
    .then((data) => data.json())
    .then((response) => {
      console.log(response, "data from api");
      sendResponse(response.data.ats);
    })

    .catch(err=> {
      console.log(err, "err from fetch");
      sendResponse("something went wrong");
    });
}
