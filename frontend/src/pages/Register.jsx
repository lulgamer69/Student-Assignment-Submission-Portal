import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import acadlyLogo from "../assets/icons/Acadly logo.png";

// ── TABLET ILLUSTRATION COMPONENT ──────────────────────────────────────────
function TabletIllustration({ state = "idle" }) {
  const isSuccess = state === "success";
  const isError = state === "error";
  const isIdle = state === "idle";

  const screenFill = isSuccess
    ? ["#22c55e", "#16a34a"]
    : isError
    ? ["#ef4444", "#dc2626"]
    : ["#6366f1", "#a855f7"];

  return (
    <svg
      width="100%"
      viewBox="0 0 400 500"
      style={{ maxWidth: 580, filter: "drop-shadow(0 24px 48px rgba(99,102,241,0.25))" }}
    >
      <defs>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={screenFill[0]}>
            <animate attributeName="stop-color" values={`${["#6366f1","#22c55e","#ef4444"][["idle","success","error"].indexOf(state)]};${screenFill[0]}`} dur="0.4s" fill="freeze"/>
          </stop>
          <stop offset="100%" stopColor={screenFill[1]}>
            <animate attributeName="stop-color" values={`${["#a855f7","#16a34a","#dc2626"][["idle","success","error"].indexOf(state)]};${screenFill[1]}`} dur="0.4s" fill="freeze"/>
          </stop>
        </linearGradient>
        <clipPath id="screenClip">
          <rect x="58" y="68" width="284" height="360" rx="10"/>
        </clipPath>
      </defs>

      {/* ── ambient sparkles ── */}
      <g opacity="0.8">
        <g>
          <line x1="28" y1="140" x2="28" y2="152" stroke="#f59e0b" strokeWidth="1.5"/>
          <line x1="22" y1="146" x2="34" y2="146" stroke="#f59e0b" strokeWidth="1.5"/>
          <animateTransform attributeName="transform" type="rotate" from="0 28 146" to="360 28 146" dur="5s" repeatCount="indefinite"/>
        </g>
        <g>
          <line x1="372" y1="100" x2="372" y2="110" stroke="#06b6d4" strokeWidth="1.5"/>
          <line x1="367" y1="105" x2="377" y2="105" stroke="#06b6d4" strokeWidth="1.5"/>
          <animateTransform attributeName="transform" type="rotate" from="0 372 105" to="360 372 105" dur="4s" repeatCount="indefinite"/>
        </g>
        <g>
          <line x1="36" y1="360" x2="36" y2="370" stroke="#a78bfa" strokeWidth="1.5"/>
          <line x1="31" y1="365" x2="41" y2="365" stroke="#a78bfa" strokeWidth="1.5"/>
          <animateTransform attributeName="transform" type="rotate" from="0 36 365" to="360 36 365" dur="6s" repeatCount="indefinite"/>
        </g>
        <g>
          <line x1="368" y1="340" x2="368" y2="350" stroke="#f9a8d4" strokeWidth="1.5"/>
          <line x1="363" y1="345" x2="373" y2="345" stroke="#f9a8d4" strokeWidth="1.5"/>
          <animateTransform attributeName="transform" type="rotate" from="0 368 345" to="360 368 345" dur="3.5s" repeatCount="indefinite"/>
        </g>
      </g>

      {/* ambient floating dots */}
      <circle cx="22" cy="240" r="5" fill="#bfdbfe" opacity="0.8">
        <animate attributeName="cy" values="240;228;240" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="380" cy="220" r="4" fill="#c4b5fd" opacity="0.7">
        <animate attributeName="cy" values="220;210;220" dur="5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="420" r="3" fill="#6ee7b7" opacity="0.6">
        <animate attributeName="cy" values="420;410;420" dur="3s" repeatCount="indefinite"/>
      </circle>

      {/* ── TABLET BODY ── */}
      <g style={{ animation: "tabletFloat 5s ease-in-out infinite" }}>
        {/* shadow */}
        <ellipse cx="200" cy="468" rx="120" ry="14" fill="rgba(99,102,241,0.15)"/>

        {/* body */}
        <rect x="44" y="38" width="312" height="420" rx="36" fill="#1e1b4b"/>
        <rect x="44" y="38" width="312" height="420" rx="36" fill="none" stroke="#4338ca" strokeWidth="2"/>

        {/* home bar */}
        <rect x="170" y="443" width="60" height="8" rx="4" fill="#312e81"/>

        {/* screen bg */}
        <g clipPath="url(#screenClip)">
          <rect x="58" y="68" width="284" height="360" fill="url(#screenGrad)"/>
          <rect x="58" y="68" width="284" height="140" fill="rgba(255,255,255,0.07)"/>
        </g>

        {/* ── IDLE STATE ── */}
        {isIdle && (
          <g>
            <circle cx="200" cy="145" r="30" fill="rgba(255,255,255,0.2)"/>
            <circle cx="200" cy="145" r="30" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
            <text x="200" y="152" textAnchor="middle" fontSize="18" fill="white" fontWeight="700" fontFamily="system-ui">A</text>
            {/* bar 1 */}
            <rect x="108" y="198" width="184" height="18" rx="9" fill="rgba(255,255,255,0.25)"/>
            <rect x="113" y="201" height="12" rx="6" fill="white">
              <animate attributeName="width" values="0;130;130;0" dur="3s" repeatCount="indefinite"/>
            </rect>
            {/* bar 2 */}
            <rect x="108" y="228" width="184" height="18" rx="9" fill="rgba(255,255,255,0.25)"/>
            <rect x="113" y="231" height="12" rx="6" fill="rgba(255,255,255,0.7)">
              <animate attributeName="width" values="0;130;130;0" dur="3s" begin="0.8s" repeatCount="indefinite"/>
            </rect>
            {/* button */}
            <rect x="148" y="265" width="104" height="32" rx="16" fill="rgba(255,255,255,0.3)"/>
            <rect x="148" y="265" width="104" height="32" rx="16" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
            <text x="200" y="286" textAnchor="middle" fontSize="12" fill="white" fontWeight="600" fontFamily="system-ui">Sign Up</text>
            {/* dots */}
            <circle cx="178" cy="316" r="4" fill="rgba(255,255,255,0.4)">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0s" repeatCount="indefinite"/>
            </circle>
            <circle cx="200" cy="316" r="4" fill="rgba(255,255,255,0.4)">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="222" cy="316" r="4" fill="rgba(255,255,255,0.4)">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1.2s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}

        {/* ── SUCCESS STATE ── */}
        {isSuccess && (
          <g>
            <circle cx="200" cy="175" r="42" fill="rgba(255,255,255,0.2)"/>
            <circle cx="200" cy="175" r="42" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none"/>
            <path d="M180 175 L194 190 L222 160" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="200" y="248" textAnchor="middle" fontSize="22" fill="white" fontWeight="700" fontFamily="system-ui">Welcome!</text>
            <text x="200" y="272" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.85)" fontFamily="system-ui">Login successful</text>
            <circle cx="160" cy="300" r="5" fill="rgba(255,255,255,0.7)">
              <animate attributeName="cy" values="300;288;300" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="200" cy="295" r="4" fill="rgba(255,255,255,0.5)">
              <animate attributeName="cy" values="295;283;295" dur="1.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="240" cy="300" r="5" fill="rgba(255,255,255,0.7)">
              <animate attributeName="cy" values="300;290;300" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="180" cy="320" r="3" fill="rgba(255,255,255,0.4)">
              <animate attributeName="cy" values="320;310;320" dur="1.4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="220" cy="318" r="3" fill="rgba(255,255,255,0.4)">
              <animate attributeName="cy" values="318;308;318" dur="1.6s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}

        {/* ── ERROR STATE ── */}
        {isError && (
          <g>
            <circle cx="200" cy="175" r="42" fill="rgba(255,255,255,0.2)"/>
            <circle cx="200" cy="175" r="42" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none"/>
            <line x1="183" y1="158" x2="217" y2="192" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <line x1="217" y1="158" x2="183" y2="192" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <text x="200" y="248" textAnchor="middle" fontSize="22" fill="white" fontWeight="700" fontFamily="system-ui">Try Again</text>
            <text x="200" y="272" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.85)" fontFamily="system-ui">Something went wrong</text>
            <circle cx="178" cy="306" r="4" fill="rgba(255,255,255,0.5)">
              <animate attributeName="cx" values="178;183;173;180;178" dur="0.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="200" cy="306" r="4" fill="rgba(255,255,255,0.5)">
              <animate attributeName="cx" values="200;205;195;202;200" dur="0.5s" begin="0.1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="222" cy="306" r="4" fill="rgba(255,255,255,0.5)">
              <animate attributeName="cx" values="222;227;217;224;222" dur="0.5s" begin="0.2s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}

        {/* side buttons */}
        <rect x="40" y="180" width="8" height="50" rx="4" fill="#312e81"/>
        <rect x="352" y="165" width="8" height="35" rx="4" fill="#312e81"/>
        <rect x="352" y="210" width="8" height="35" rx="4" fill="#312e81"/>
      </g>

      <style>{`
        @keyframes tabletFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </svg>
  );
}

// ── MAIN REGISTER PAGE ──────────────────────────────────────────────────────
export default function Register() {
  const { isDark } = useTheme();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    role: "student",
    rollNumber: "",
    division: "",
    year: "",
    branch: ""
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [shakeField, setShakeField] = useState("");
  const [registerState, setRegisterState] = useState("idle"); // "idle" | "success" | "error"
  const nav = useNavigate();

  const validate = () => {
    let errors = {};
    let firstErrorField = "";

    if (!form.name || form.name.trim() === "") {
      errors.name = "Name is required";
      if (!firstErrorField) firstErrorField = "name";
    }
    if (!form.email || form.email.trim() === "") {
      errors.email = "Email is required";
      if (!firstErrorField) firstErrorField = "email";
    } else if (!form.email.includes("@")) {
      errors.email = "Enter a valid email";
      if (!firstErrorField) firstErrorField = "email";
    }
    if (!form.password || form.password.trim() === "") {
      errors.password = "Password is required";
      if (!firstErrorField) firstErrorField = "password";
    } else if (form.password.length < 6) {
      errors.password = "Min 6 characters required";
      if (!firstErrorField) firstErrorField = "password";
    }

    // Validate student details if role is student
    if (form.role === "student") {
      if (!form.rollNumber || form.rollNumber.trim() === "") {
        errors.rollNumber = "Roll number is required";
        if (!firstErrorField) firstErrorField = "rollNumber";
      }
      if (!form.division || form.division.trim() === "") {
        errors.division = "Division is required";
        if (!firstErrorField) firstErrorField = "division";
      }
      if (!form.year || form.year.trim() === "") {
        errors.year = "Year is required";
        if (!firstErrorField) firstErrorField = "year";
      }
      if (!form.branch || form.branch.trim() === "") {
        errors.branch = "Branch is required";
        if (!firstErrorField) firstErrorField = "branch";
      }
    }

    setValidationErrors(errors);
    if (firstErrorField) {
      setShakeField(firstErrorField);
      setTimeout(() => setShakeField(""), 400);
    }
    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("https://student-assignment-submission-portal.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setRegisterState("success");
        setTimeout(() => nav("/login"), 1200);
      } else {
        setRegisterState("error");
        setServerError(data.message || "Registration failed");
        setTimeout(() => setRegisterState("idle"), 2000);
      }
    } catch (err) {
      setRegisterState("error");
      setServerError("Network error. Please try again.");
      setTimeout(() => setRegisterState("idle"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field) => `
    flex items-center gap-3 px-4 py-2 border-2 rounded-lg transition
    ${shakeField === field ? "shake" : ""}
    ${validationErrors[field]
      ? isDark
        ? "bg-red-900/20 border-red-700 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-300/50 error-glow"
        : "bg-red-50 border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200 error-glow"
      : isDark
        ? "bg-[#334155] border-slate-600 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-900/50"
        : "bg-gray-50/80 border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
    }
  `;

  const iconClass = (field) =>
    `w-5 h-5 ${validationErrors[field] ? (isDark ? "text-red-400" : "text-red-500") : isDark ? "text-gray-400" : "text-gray-500"}`;

  return (
    <div
      className={`h-screen flex flex-col relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950"
          : "bg-gradient-to-br from-[#e8eeff] via-[#f0f4ff] to-[#eef2ff]"
      }`}
      style={{
        animation: "pageLoadFade 700ms ease-out forwards"
      }}
    >
      {/* ── BACKGROUND PATTERNS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.12)"} 1.5px, transparent 1.5px)`,
            backgroundSize: "32px 32px",
            animation: "dotScroll 25s linear infinite",
          }}
        />

        <div className="absolute rounded-full" style={{ width: 220, height: 220, top: 60, right: 80, border: "1.5px solid rgba(99,102,241,0.15)", animation: "ringPulse 7s ease-in-out infinite" }} />
        <div className="absolute rounded-full" style={{ width: 130, height: 130, bottom: 100, left: 60, border: "1.5px solid rgba(99,102,241,0.12)", animation: "ringPulse 9s ease-in-out infinite", animationDelay: "3s" }} />
        <div className="absolute rounded-full" style={{ width: 90, height: 90, top: 200, left: 180, border: "1.5px solid rgba(167,139,250,0.15)", animation: "ringPulse 6s ease-in-out infinite", animationDelay: "1.5s" }} />

        {[
          { bg: "#6366f1", left: "12%", dur: "8s", delay: "0s" },
          { bg: "#3b82f6", left: "28%", dur: "10s", delay: "-3s" },
          { bg: "#a78bfa", left: "55%", dur: "7s", delay: "-5s" },
          { bg: "#38bdf8", left: "72%", dur: "9s", delay: "-1s" },
          { bg: "#818cf8", left: "88%", dur: "11s", delay: "-7s" },
        ].map((p, i) => (
          <div key={i} className="absolute rounded-full" style={{ width: 4, height: 4, background: p.bg, left: p.left, bottom: 0, animation: `ptRise ${p.dur} ${p.delay} linear infinite` }} />
        ))}

        <div className="absolute top-32 right-32 w-40 h-40 border-2 border-blue-400/40 rounded-full animate-spin-slow" style={{ animationDuration: "30s" }} />
        <div className="absolute bottom-40 left-32 w-32 h-32 border-2 border-purple-400/30 rounded-full animate-spin-slow" style={{ animationDelay: "5s", animationDuration: "25s" }} />

        <div className="wave-bg">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
        </div>
      </div>

      <style>{`
        @keyframes dotScroll { 0% { background-position: 0 0; } 100% { background-position: 32px 32px; } }
        @keyframes ringPulse { 0%,100% { transform:scale(1); opacity:0.5; } 50% { transform:scale(1.12); opacity:0.15; } }
        @keyframes ptRise { 0%{transform:translateY(0);opacity:0;} 10%{opacity:0.7;} 90%{opacity:0.5;} 100%{transform:translateY(-100vh);opacity:0;} }
        @keyframes pageLoadFade { 0% { opacity:0; transform:translateY(10px); } 100% { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── LOGO TOP RIGHT ── */}
      <div className="absolute top-6 right-6 z-20">
        <img src={acadlyLogo} alt="Acadly" className="h-24 w-auto opacity-90 hover:opacity-100 transition" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 items-center justify-center px-4 md:px-10 relative z-10">
        <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

          {/* LEFT — TABLET ILLUSTRATION */}
          <div className="hidden lg:flex flex-1 items-center justify-start relative lg:-ml-20">
            {/* blob behind illustration */}
            <div className="absolute left-[-80px] top-10 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none"/>
            <div className="absolute left-[80px] top-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-2xl pointer-events-none"/>
            <TabletIllustration state={registerState} />
          </div>

          {/* RIGHT — REGISTER FORM */}
          <div className="flex flex-1 justify-center w-full">
            <div className="relative z-0 w-full max-w-md lg:w-96">

              {/* blobs behind card */}
              <div className="absolute -top-24 -right-28 w-96 h-96 bg-blue-400/35 rounded-full blur-3xl animate-blob pointer-events-none" />
              <div className="absolute -bottom-20 -left-24 w-80 h-80 bg-violet-400/25 rounded-full blur-3xl animate-blob pointer-events-none" style={{ animationDelay: "3s" }} />
              <div className="absolute top-1/3 -right-12 w-60 h-60 bg-sky-300/30 rounded-full blur-2xl animate-blob pointer-events-none" style={{ animationDelay: "1.5s" }} />

              {/* ── REGISTER CARD ── */}
              <div
                className={`relative z-10 w-full p-6 md:p-8 rounded-2xl shadow-xl border ${
                  isDark
                    ? "bg-[#1e293b]/80 border-slate-700 backdrop-blur-md"
                    : "bg-white/90 border-white/80 backdrop-blur-md"
                }`}
                style={{
                  boxShadow: isDark
                    ? "0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset"
                    : "0 8px 40px rgba(99,102,241,0.12), 0 2px 8px rgba(99,102,241,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset",
                }}
              >
                <h2 className={`text-xl md:text-2xl font-bold mb-2 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                  Create your account
                </h2>
                <p className={`mb-4 md:mb-6 text-xs md:text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Join Acadly today — it only takes a minute.
                </p>

                {serverError && (
                  <div className={`px-4 md:px-5 py-3 md:py-4 rounded-lg mb-4 text-xs md:text-sm font-medium border ${isDark ? "bg-red-900/30 border-red-800 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}>
                    {serverError}
                  </div>
                )}

                {/* NAME */}
                <div className="mb-4 md:mb-6">
                  <label className={`block mb-2 text-xs md:text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>Full Name</label>
                  <div className={fieldClass("name")}>
                    <svg className={`w-5 h-5 ${validationErrors.name ? (isDark ? "text-red-400" : "text-red-500") : isDark ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={e => { setForm({ ...form, name: e.target.value }); setRegisterState("idle"); }}
                      onBlur={() => setTouched({ ...touched, name: true })}
                      className={`w-full bg-transparent outline-none border-none focus:ring-0 text-sm md:text-base ${isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}`}
                    />
                  </div>
                  {validationErrors.name && <p className="text-xs mt-1 text-red-500">{validationErrors.name}</p>}
                </div>

                {/* EMAIL */}
                <div className="mb-4 md:mb-6">
                  <label className={`block mb-2 text-xs md:text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>Email Address</label>
                  <div className={fieldClass("email")}>
                    <svg className={`w-5 h-5 ${validationErrors.email ? (isDark ? "text-red-400" : "text-red-500") : isDark ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 5l9 7 9-7" />
                    </svg>
                    <input
                      type="email"
                      placeholder="johndoe@gmail.com"
                      value={form.email}
                      onChange={e => { setForm({ ...form, email: e.target.value }); setRegisterState("idle"); }}
                      onBlur={() => setTouched({ ...touched, email: true })}
                      className={`w-full bg-transparent outline-none border-none focus:ring-0 text-sm md:text-base ${isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}`}
                    />
                  </div>
                  {validationErrors.email && <p className="text-xs mt-1 text-red-500">{validationErrors.email}</p>}
                </div>

                {/* PASSWORD */}
                <div className="mb-3">
                  <label className={`block mb-2 text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>Password</label>
                  <div className={fieldClass("password")}>
                    <svg className={iconClass("password")} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={form.password}
                      onChange={e => { setForm({ ...form, password: e.target.value }); setRegisterState("idle"); }}
                      onBlur={() => setTouched({ ...touched, password: true })}
                      className={`flex-1 bg-transparent outline-none border-none focus:ring-0 ${isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}>
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z" /></svg>
                      )}
                    </button>
                  </div>
                  {validationErrors.password && <p className="text-xs mt-1 text-red-500">{validationErrors.password}</p>}
                </div>

                {/* ROLE SELECTOR */}
                <div className="mb-4">
                  <label className={`block mb-2 text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["student", "teacher"].map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setForm({ ...form, role })}
                        className={`py-3 rounded-lg border-2 text-sm font-semibold capitalize transition ${
                          form.role === role
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500 text-white shadow-lg"
                            : isDark
                            ? "bg-[#334155] border-slate-600 text-gray-300 hover:border-blue-500"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-400"
                        }`}
                      >
                        {role === "student" ? "🎓 Student" : "📚 Teacher"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STUDENT DETAILS - ONLY SHOW IF STUDENT */}
                {form.role === "student" && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    
                    {/* ROLL NUMBER */}
                    <div>
                      <label className={`block mb-2 text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>Roll Number</label>
                      <div className={fieldClass("rollNumber")}>
                        <svg className={iconClass("rollNumber")} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M13 10H3L5.64 5.63C6.45 4.25 8.12 3.5 9.88 3.5H19C20.1 3.5 21 4.4 21 5.5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19" />
                        </svg>
                        <input
                          type="text"
                          placeholder="e.g., 001, A101"
                          value={form.rollNumber}
                          onChange={e => setForm({ ...form, rollNumber: e.target.value })}
                          className={`w-full bg-transparent outline-none border-none focus:ring-0 ${isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}`}
                        />
                      </div>
                      {validationErrors.rollNumber && <p className="text-xs mt-1 text-red-500">{validationErrors.rollNumber}</p>}
                    </div>

                    {/* DIVISION */}
                    <div>
                      <label className={`block mb-2 text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>Division</label>
                      <div className={fieldClass("division")}>
                        <svg className={iconClass("division")} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16" />
                        </svg>
                        <input
                          type="text"
                          placeholder="e.g., A, B, C, CSE"
                          value={form.division}
                          onChange={e => setForm({ ...form, division: e.target.value })}
                          className={`w-full bg-transparent outline-none border-none focus:ring-0 ${isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}`}
                        />
                      </div>
                      {validationErrors.division && <p className="text-xs mt-1 text-red-500">{validationErrors.division}</p>}
                    </div>

                    {/* YEAR */}
                    <div>
                      <label className={`block mb-2 text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>Year</label>
                      <div className={fieldClass("year")}>
                        <svg className={iconClass("year")} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="e.g., 1, 2, 3, 4"
                          value={form.year}
                          onChange={e => setForm({ ...form, year: e.target.value })}
                          className={`w-full bg-transparent outline-none border-none focus:ring-0 ${isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}`}
                        />
                      </div>
                      {validationErrors.year && <p className="text-xs mt-1 text-red-500">{validationErrors.year}</p>}
                    </div>

                    {/* BRANCH */}
                    <div>
                      <label className={`block mb-2 text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>Branch</label>
                      <div className={fieldClass("branch")}>
                        <svg className={iconClass("branch")} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2" />
                        </svg>
                        <input
                          type="text"
                          placeholder="e.g., CSE, ECE, Mechanical"
                          value={form.branch}
                          onChange={e => setForm({ ...form, branch: e.target.value })}
                          className={`w-full bg-transparent outline-none border-none focus:ring-0 ${isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}`}
                        />
                      </div>
                      {validationErrors.branch && <p className="text-xs mt-1 text-red-500">{validationErrors.branch}</p>}
                    </div>

                  </div>
                )}

                {/* REGISTER BUTTON */}
                <button
                  onClick={submit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-bold transition hover:shadow-xl hover:brightness-110 active:scale-95 shadow-lg text-base mb-3"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>

                <p className={`text-sm text-center leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Already have an account?{" "}
                  <span
                    className={`font-bold cursor-pointer transition ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                    onClick={() => nav("/login")}
                  >
                    Login
                  </span>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}