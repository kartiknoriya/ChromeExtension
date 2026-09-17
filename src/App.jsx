import React, { useEffect, useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";

function App() {
  const [atsResult, setAtsResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);


  useEffect(() => {
    chrome.storage.local.get(["resume", "atsResult"], (result) => {
      console.log(result);
      if (result.resume) {
        setResume(result.resume);
      }

      if (result.atsResult) {
        setAtsResult(result.atsResult);
      }
    })
  }, [])

  function getResume(e) {
    const file = e.target.files[0];

    if (!file) {
      alert("upload resume");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

      const pdfIntoString = e.target.result;

      const uploadedResume = {
        name: file.name,
        content: pdfIntoString
      };

      chrome.storage.local.set({
        resume: uploadedResume
      });

      // Update React state immediately
      setResume(uploadedResume);

    }
    reader.readAsDataURL(file);
  }


  function removeResume() {

    chrome.storage.local.remove(["resume", "atsResult"], () => {

      setResume(null);
      setAtsResult(null);

    });

  }

  function getScoreColor(score) {
    if (score >= 80) return "#22c55e"; // Green
    if (score >= 60) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  }

  return (
    <div className="w-[340px] min-h-[500px] p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
      <input type="file" accept="application/pdf" name='Resume' className='border-2 shadow-2xl' onChange={getResume} />

      {
        resume && (
          <div className="mt-4 p-4 border rounded-lg shadow bg-white">

            <h2 className="text-lg font-semibold text-gray-700">
              Uploaded Resume
            </h2>

            <p className="text-sm text-gray-600 mt-2">
              📄 {resume.name}
            </p>

          </div>
        )
      }


      {
        resume && (
          <button
            onClick={removeResume}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
          >
            Remove Resume
          </button>
        )
      }


      <hr className="my-4" />

      {atsResult ? (
        <div className="flex flex-col items-center mt-6">

          <div className="w-28 h-28">
            <CircularProgressbar
              value={atsResult.atsScore}
              text={`${atsResult.atsScore}%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: getScoreColor(atsResult.atsScore),
                textColor: "#111827",
                trailColor: "#e5e7eb",
              })}
            />
          </div>

          <h2 className="mt-4 text-xl font-bold">
            ATS Score
          </h2>

        </div>
      ) : (
        <p className="text-gray-500 mt-4">
          Upload your resume and select a job description to analyze.
        </p>
      )}


      {/* matching skills */}
      {atsResult && (
        <div className="mt-6 text-left">


          <h4 className="text-lg font-bold text-green-600 flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Your Strengths
          </h4>

          <div className="flex flex-wrap gap-2 mt-3">
            {atsResult.matchingSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

        </div>
      )}


      {/* missing skills */}
      {atsResult && (
        <div className="mt-6 text-left">

          <h4 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <span className="text-red-600">✕</span>
            Skills to improve
          </h4>

          {atsResult.missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">

              {atsResult.missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium"
                >
                  {skill}
                </span>
              ))}

            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              No missing skills found.
            </p>
          )}

        </div>
      )}

      {/* suggestion */}
      {atsResult?.suggestions?.length > 0 && (
        <div className="mt-6 text-left">

          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>💡</span>
            What You Should Improve
          </h2>

          <div className="mt-3 space-y-3">

            {atsResult.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
              >

                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 text-white text-sm font-semibold flex items-center justify-center">
                  {index + 1}
                </span>


                <div className="text-sm text-gray-700 leading-5">
                  <p className="font-semibold">
                    {suggestion.skill}
                  </p>

                  <p className="mt-1">
                    {suggestion.suggestion}
                  </p>
                </div>


              </div>
            ))}

          </div>

        </div>
      )}
    </div>
  )
}

export default App