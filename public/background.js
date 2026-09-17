console.log("background.js is working");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log("message reading", message);

    if (message.type == `SELECTED_TEXT`) {
        //Call ai
        // console.log(message.payload,'selected text');
        callApi(message.payload, sendResponse);

        //keep the message port open until sendResponse is called
        return true;
    }
})

async function callApi(message, sendResponse) {

    // console.log(message,"data coming from content to background");

    const body = {
        resumeInBase64: message.resume.content,
        jd: message.jd
    }
    // console.log(body,'body');


    fetch(`http://localhost:4000/get-ats`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
    )
        .then(async (data) => {
            const response = await data.json().catch(() => ({}));

            if (!data.ok) {
                throw new Error(response.message || `Analysis request failed (${data.status})`);
            }

            return response;
        })
        .then((response) => {

            chrome.storage.local.set({
                atsResult: response
            },
            () => {
        console.log("ATS Result Saved");
        console.log(response);
    }
        );

            sendResponse({ ok: true, result: response });
        })
        // .then((response)=>{
        //     console.log(response,"data from api");
        //     sendResponse(response.data.ats)
        // })
        .catch(err => {
            console.log(err, "err from fetch");
            sendResponse({ ok: false, error: err.message });
        })


}
