import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const styles = `
  @keyframes pageLoadFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .page-fade-in {
    animation: pageLoadFade 0.7s ease-out;
  }

  .input-focus {
    transition: all 0.3s ease;
  }

  .input-focus:focus {
    transform: translateY(-2px);
  }
`;

export default function Grade(){
  const { isDark } = useTheme();
  const { id } = useParams();
  const nav = useNavigate();
  const [marks, setMarks] = useState({ TS: "", OM: "", PR: "", IA: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [totalMarks, setTotalMarks] = useState(100);
  const [submissionData, setSubmissionData] = useState(null);

  // Fetch submission data on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login");
      return;
    }

    const fetchSubmission = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/submissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          nav("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          const submission = data.submission || data;
          setSubmissionData(submission);
          
          // Get totalMarks from assignment
          if (submission.assignment?.totalMarks) {
            setTotalMarks(submission.assignment.totalMarks);
          }
          
          // If already graded, populate the form
          if (submission.marks && submission.status === "evaluated") {
            setMarks({
              TS: submission.marks.TS || "",
              OM: submission.marks.OM || "",
              PR: submission.marks.PR || "",
              IA: submission.marks.IA || ""
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch submission:", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchSubmission();
  }, [id, nav]);

  const validate = () => {
    const maxPerSection = totalMarks / 4;
    
    // Check if all marks are provided
    if (!marks.TS || isNaN(marks.TS) || marks.TS < 0) {
      setError("TS (Theory Score) must be a valid number");
      return false;
    }
    if (!marks.OM || isNaN(marks.OM) || marks.OM < 0) {
      setError("OM (Oral Marks) must be a valid number");
      return false;
    }
    if (!marks.PR || isNaN(marks.PR) || marks.PR < 0) {
      setError("PR (Practical) must be a valid number");
      return false;
    }
    if (!marks.IA || isNaN(marks.IA) || marks.IA < 0) {
      setError("IA (Internal Assessment) must be a valid number");
      return false;
    }

    // Check individual marks don't exceed max per section
    const ts = parseFloat(marks.TS);
    const om = parseFloat(marks.OM);
    const pr = parseFloat(marks.PR);
    const ia = parseFloat(marks.IA);

    if (ts > maxPerSection) {
      setError(`TS cannot exceed ${maxPerSection.toFixed(2)} (total marks / 4)`);
      return false;
    }
    if (om > maxPerSection) {
      setError(`OM cannot exceed ${maxPerSection.toFixed(2)} (total marks / 4)`);
      return false;
    }
    if (pr > maxPerSection) {
      setError(`PR cannot exceed ${maxPerSection.toFixed(2)} (total marks / 4)`);
      return false;
    }
    if (ia > maxPerSection) {
      setError(`IA cannot exceed ${maxPerSection.toFixed(2)} (total marks / 4)`);
      return false;
    }

    // Check total doesn't exceed totalMarks
    const totalObtained = ts + om + pr + ia;
    if (totalObtained > totalMarks) {
      setError(`Total marks (${totalObtained.toFixed(2)}) cannot exceed ${totalMarks}`);
      return false;
    }

    setError("");
    return true;
  };

  const submit = async() => {
    if (!validate()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please login again.");
      nav("/login");
      return;
    }

    setLoading(true);
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/api/submissions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          TS: parseFloat(marks.TS),
          OM: parseFloat(marks.OM),
          PR: parseFloat(marks.PR),
          IA: parseFloat(marks.IA)
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess("✅ Grades submitted successfully!");
        setTimeout(() => nav(-1), 1500);
      } else {
        setError(data.message || "Failed to grade submission");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalObtained = parseFloat(marks.TS || 0) + parseFloat(marks.OM || 0) + parseFloat(marks.PR || 0) + parseFloat(marks.IA || 0);
  const total = totalObtained.toFixed(2);

  if (pageLoading) {
    return (
      <div className={`page-fade-in min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950' : 'bg-gradient-to-br from-[#e8eeff] via-[#f0f4ff] to-[#eef2ff]'}`}>
        <div className={`relative z-10 p-8 rounded-2xl ${isDark ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-xl`}>
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className={`mt-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading submission...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className={`page-fade-in min-h-screen flex items-center justify-center py-12 px-4 ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950' : 'bg-gradient-to-br from-[#e8eeff] via-[#f0f4ff] to-[#eef2ff]'}`}>
        
        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"/>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}/>
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }}/>
        </div>

        {/* Main Card */}
        <div className={`relative z-10 w-full max-w-lg ${isDark ? 'bg-slate-900/80 backdrop-blur-xl border-slate-700' : 'bg-white/80 backdrop-blur-xl border-gray-200'} border rounded-2xl shadow-2xl p-8`}>
          
          {/* Header */}
          <button
            onClick={() => nav(-1)}
            className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDark ? 'text-gray-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Grade Submission
          </h1>
          <p className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter marks for each category
          </p>
          {submissionData?.assignment?.title && (
            <p className={`text-sm mb-6 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              📝 {submissionData.assignment.title}
            </p>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/15 border border-red-500/30 flex gap-3 items-start" style={{ animation: 'slideUp 0.3s ease' }}>
              <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/15 border border-green-500/30 flex gap-3 items-start" style={{ animation: 'slideUp 0.3s ease' }}>
              <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Form or Already Graded Message */}
          {submissionData?.status === "evaluated" && submissionData?.marks ? (
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border-2 ${isDark ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={28} className="text-green-500" />
                  <p className={`text-xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    Grading Complete
                  </p>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  This submission has already been graded. The marks are shown below.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'TS', label: 'Theory Score', value: submissionData.marks.TS },
                  { key: 'OM', label: 'Oral Marks', value: submissionData.marks.OM },
                  { key: 'PR', label: 'Practical Marks', value: submissionData.marks.PR },
                  { key: 'IA', label: 'Internal Assessment', value: submissionData.marks.IA }
                ].map((field) => (
                  <div key={field.key} className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {field.label}
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {field.value !== undefined ? field.value : 'N/A'}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50'}`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>TOTAL MARKS</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mt-2">
                  {((submissionData.marks.TS || 0) + (submissionData.marks.OM || 0) + (submissionData.marks.PR || 0) + (submissionData.marks.IA || 0)).toFixed(2)}/{totalMarks}
                </p>
              </div>

              <button
                onClick={() => nav(-1)}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              >
                Back to Submissions
              </button>
            </div>
          ) : (
            <>
              <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}`}>
                <p className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  💡 Max marks per section: {(totalMarks / 4).toFixed(2)} (Total: {totalMarks})
                </p>
              </div>

              <div className="space-y-5 mb-8">
                {[
                  { key: 'TS', label: 'Theory Score', placeholder: 'Enter theory marks' },
                  { key: 'OM', label: 'Oral Marks', placeholder: 'Enter oral marks' },
                  { key: 'PR', label: 'Practical Marks', placeholder: 'Enter practical marks' },
                  { key: 'IA', label: 'Internal Assessment', placeholder: 'Enter IA marks' }
                ].map((field) => {
                  const maxPerSection = totalMarks / 4;
                  const currentValue = parseFloat(marks[field.key]) || 0;
                  const isExceeding = currentValue > maxPerSection;
                  
                  return (
                    <div key={field.key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {field.label}
                        </label>
                        <span className={`text-xs font-medium ${isExceeding ? 'text-red-500' : isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          {currentValue.toFixed(2)} / {maxPerSection.toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={maxPerSection}
                        step="0.5"
                        placeholder={field.placeholder}
                        value={marks[field.key]}
                        onChange={(e) => {
                          setError("");
                          const val = e.target.value;
                          if (val === "" || parseFloat(val) <= maxPerSection || parseFloat(val) < 0) {
                            setMarks({ ...marks, [field.key]: val });
                          }
                        }}
                        className={`input-focus w-full px-4 py-3 rounded-lg border-2 transition-all ${
                          isExceeding
                            ? isDark ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-red-50 border-red-500 text-red-700'
                            : isDark
                            ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                            : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        } outline-none`}
                      />
                      {isExceeding && (
                        <p className="text-xs text-red-500 mt-1">⚠️ Exceeds max marks for this section</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className={`p-6 rounded-xl mb-8 ${totalObtained > totalMarks ? 'bg-red-900/20 border border-red-500/50' : isDark ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50'}`}>
                <p className={`text-sm font-medium ${totalObtained > totalMarks ? 'text-red-400' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>TOTAL MARKS</p>
                <p className={`text-4xl font-bold mt-2 ${totalObtained > totalMarks ? 'text-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'}`}>
                  {total}/{totalMarks}
                </p>
                {totalObtained > totalMarks && (
                  <p className="text-xs text-red-400 mt-2">❌ Total exceeds maximum marks</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submit}
                  disabled={loading || totalObtained > totalMarks}
                  className={`flex-1 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    loading || totalObtained > totalMarks
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-95'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Submit Grades
                    </>
                  )}
                </button>
                <button
                  onClick={() => nav(-1)}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-gray-300 disabled:opacity-50'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50'
                  }`}
                >
                  Cancel
                </button>
              </div>

              <p className={`text-xs text-center mt-6 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                📋 Each section max: {(totalMarks / 4).toFixed(2)} | Total max: {totalMarks} marks
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}