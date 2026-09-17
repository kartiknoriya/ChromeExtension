console.log("content.js is working");

let btn = null;
let resultsPanel = null;

document.addEventListener("mouseup", (e) => {
    console.log(e, 'event of mouse up');
    const selectedText = window.getSelection().toString().trim();

    console.log(selectedText, 'selected text');

    //don't do anything if the event is triggered after clicing on button
    if (e.target.id == "btn") {
        return;
    }

    if (selectedText.length > 15) {
        createButton(selectedText);
    }

    if (selectedText.length <= 15) {
        if (btn) {
            btn.remove();
            btn = null;
        }
        return;
    }
})


function createButton(selectedText) {
    //If button was created previouslys
    if (btn) {
        btn.remove();
    }

    btn = document.createElement("button");
    
    btn.id = "btn"
    btn.innerText = `Get Score`;
    btn.style.position = "fixed";
    btn.style.zIndex = 9999;
    btn.style.top = "100px";
    btn.style.right = "40px";
    btn.style.background = "#2563eb";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.padding = "10px 16px";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "600";
    btn.style.boxShadow = "0 4px 10px rgba(0,0,0,.2)";

    console.log(btn,'btn');

    btn.addEventListener("click", () => {

        btn.innerText = "Analyzing...";
        btn.disabled = true;

        sendTextToBackground(selectedText)
    });

    document.body.appendChild(btn);
}

async function sendTextToBackground(text) {

    console.log("sending message to bg.js");

    const storage = await chrome.storage.local.get(["resume"]);
    // const successful =storage.resume? true : false;

    // console.log(successful);

    console.log(storage, "complete storage");
    // console.log(storage.resume.content, 'content of resume');

    if (!storage.resume) {
        alert("Upload resume");
        resetButton();
        return;
    }

    chrome.runtime.sendMessage(
        {
            type: `SELECTED_TEXT`,
            payload: { resume: storage.resume, jd: text }
        },
        (response) => {
            console.log(response, "response coming from bacground.js to content.js");

            if (!response || !response.ok) {
                showStatus(response?.error || "Analysis failed", true);
                return;
            }

            resetButton();
            showResults(response.result);
        }
    )
}

function resetButton() {
    if (btn) {
        btn.remove();
        btn = null;
    }
}

function showStatus(message, isError) {
    if (!btn) {
        return;
    }

    btn.disabled = false;
    btn.innerText = message;
    btn.style.background = isError ? "#dc2626" : "#16a34a";
}

function showResults(result) {
    if (resultsPanel) {
        resultsPanel.remove();
    }

    resultsPanel = document.createElement("aside");
    resultsPanel.style.position = "fixed";
    resultsPanel.style.top = "24px";
    resultsPanel.style.right = "24px";
    resultsPanel.style.width = "340px";
    resultsPanel.style.maxHeight = "calc(100vh - 48px)";
    resultsPanel.style.overflowY = "auto";
    resultsPanel.style.zIndex = "2147483647";
    resultsPanel.style.padding = "18px";
    resultsPanel.style.borderRadius = "12px";
    resultsPanel.style.background = "#ffffff";
    resultsPanel.style.color = "#111827";
    resultsPanel.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.25)";
    resultsPanel.style.fontFamily = "Arial, sans-serif";
    resultsPanel.style.fontSize = "14px";

    const closeButton = document.createElement("button");
    closeButton.innerText = "×";
    closeButton.title = "Close results";
    closeButton.style.cssText = "float:right;border:0;background:transparent;font-size:24px;line-height:18px;cursor:pointer;color:#6b7280";
    closeButton.addEventListener("click", () => {
        resultsPanel.remove();
        resultsPanel = null;
    });
    resultsPanel.appendChild(closeButton);

    const title = document.createElement("h2");
    title.innerText = "ATS Analysis";
    title.style.cssText = "margin:0 0 14px;font-size:20px";
    resultsPanel.appendChild(title);

    const score = document.createElement("p");
    score.innerText = `${result.atsScore ?? 0}%`;
    score.style.cssText = "margin:0 0 16px;text-align:center;font-size:42px;font-weight:700;color:#2563eb";
    resultsPanel.appendChild(score);

    appendSkillSection(resultsPanel, "Matching skills", result.matchingSkills, "#166534");
    appendSkillSection(resultsPanel, "Skills to improve", result.missingSkills, "#b91c1c");

    if (Array.isArray(result.suggestions) && result.suggestions.length > 0) {
        const heading = document.createElement("h3");
        heading.innerText = "Suggestions";
        heading.style.cssText = "margin:16px 0 8px;font-size:16px";
        resultsPanel.appendChild(heading);

        result.suggestions.forEach((suggestion) => {
            const item = document.createElement("p");
            item.style.cssText = "margin:0 0 8px;padding:8px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px";
            item.innerText = typeof suggestion === "string"
                ? suggestion
                : `${suggestion.skill || "Improve"}: ${suggestion.suggestion || ""}`;
            resultsPanel.appendChild(item);
        });
    }

    document.body.appendChild(resultsPanel);
}

function appendSkillSection(panel, headingText, skills, color) {
    const heading = document.createElement("h3");
    heading.innerText = headingText;
    heading.style.cssText = `margin:12px 0 8px;font-size:16px;color:${color}`;
    panel.appendChild(heading);

    const list = document.createElement("p");
    list.style.cssText = "margin:0;line-height:1.7";
    list.innerText = Array.isArray(skills) && skills.length > 0
        ? skills.join(", ")
        : "None";
    panel.appendChild(list);
}