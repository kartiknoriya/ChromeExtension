import "./App.css";

function App() {
  async function getResume(e) {
    const file = e.target.files[0];
    if (!file) {
      alert("Upload resume");
      return;
    }

    const reader = new FileReader();

    reader.onload = async function (e) {
      const pdfIntoString = e.target.result;

      await chrome.storage.local.set({
        resume: { name: file.name, content: pdfIntoString },
      });
    };

    reader.readAsDataURL(file);
  }

  return (
    <>
      <div className="w-[400px] h-[400px]">
        <h1 className="text-bold text-2xl">Upload Resume</h1>

        <input
          type="file"
          accept="application/pdf"
          name="Resume"
          className="border-2 w-20 shadow-2xl"
          onChange={getResume}
        ></input>
      </div>
    </>
  );
}

export default App;
