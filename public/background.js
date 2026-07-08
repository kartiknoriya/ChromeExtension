console.log('background is running')

chrome.runtime.onMessage.addListener((message , sender , sendResponse) =>{
      if(message.type === `SELECTED_TEXT`){
          console.log(message.payload , 'payload')


    //       const resume = await chrome.storage.local.get(["resume"])

    //       console.log(resume , "selected resume base 64")
      }

      
})