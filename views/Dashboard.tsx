import React, { useState, useEffect } from "react";
import {
  Activity,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Clock,
  Droplets,
  Zap,
  User,
  Bell,
  Timer,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Globe,
  Maximize,
  Minimize,
} from "lucide-react";
import { PumpIntensity, Flavor, Medication, Language } from "../types";
import { translations } from "../translations";

interface DashboardProps {
  user: { username: string } | null;
  onLogout: () => void;
  lang: Language;
  toggleLang: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  lang,
  toggleLang,
}) => {
  const t = translations[lang];

  // State for Full Screen
  const [isFullScreen, setIsFullScreen] = useState(false);

  // State for Pumping
  const [isPumping, setIsPumping] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [intensity, setIntensity] = useState<PumpIntensity>(
    PumpIntensity.MEDIUM,
  );

  // State for Medications
  const [meds, setMeds] = useState<Medication[]>([
    {
      id: "1",
      name: "Alprazolam",
      dosage: "0.25mg",
      schedule: "08:00",
      day: 1,
    },
    { id: "2", name: "Lisinopril", dosage: "10mg", schedule: "21:00", day: 3 },
    { id: "3", name: "Vitamin C", dosage: "500mg", schedule: "10:00", day: 0 },
  ]);
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    schedule: "",
    day: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Calendar navigation state
  const [weekOffset, setWeekOffset] = useState(0);

  // Sync full screen state with browser events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Calendar dates logic
  const getWeekDates = (offset: number) => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    // Calculate difference to get to Monday of current week
    const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diffToMonday + offset * 7));

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        dayNum: d.getDate(),
        month: d.toLocaleString(lang === Language.EN ? "en-US" : "ar-EG", {
          month: "short",
        }),
      };
    });
  };
  const weekDates = getWeekDates(weekOffset);

  // Timer logic for pumping
  useEffect(() => {
    let interval: any;
    if (isPumping) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isPumping]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleTogglePump = async () => {
    const newState = !isPumping;
    setIsPumping(newState);

    try {
      await fetch(`http://192.168.4.1/${newState ? "on" : "off"}`);
    } catch (error) {
      console.error("Failed to connect to ESP:", error);
    }
  };

  const addMed = () => {
    if (newMed.name.trim() && newMed.dosage.trim() && newMed.schedule) {
      const med: Medication = {
        id: Math.random().toString(36).substr(2, 9),
        name: newMed.name,
        dosage: newMed.dosage,
        schedule: newMed.schedule,
        day: newMed.day,
      };
      setMeds((prev) => [...prev, med]);
      setNewMed({ name: "", dosage: "", schedule: "", day: 0 });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const removeMed = (id: string) => {
    setMeds((prev) => prev.filter((m) => m.id !== id));
  };

  const days = [
    t.monday,
    t.tuesday,
    t.wednesday,
    t.thursday,
    t.friday,
    t.saturday,
    t.sunday,
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <main className="flex-grow overflow-y-auto relative flex flex-col">
        {/* Header with Brand Logo and Identity */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-slate-200">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <BrainCircuit size={24} />
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                IMS Portal
              </h1>
            </div>
            <span className="text-slate-400 font-bold text-xs tracking-widest uppercase hidden sm:block">
              {t.dashboard}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Full Screen Toggle */}
            <button
              onClick={toggleFullScreen}
              className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-200"
              title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            >
              {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

            {/* Language Toggle in Header */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-200"
            >
              <Globe size={18} />
              <span className="hidden sm:inline">
                {lang === Language.EN ? "العربية" : "English"}
              </span>
            </button>

            <div
              className={`flex items-center gap-4 ${lang === Language.EN ? "pl-6 border-l" : "pr-6 border-r"} border-slate-200`}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">
                  {user?.username || "Guest User"}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  ID: #IMS-2025
                </p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer">
                <User size={24} />
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-all group"
            >
              <LogOut
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
              <span className="hidden sm:inline">{t.signOut}</span>
            </button>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Controls Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200 relative overflow-hidden">
                <div
                  className={`absolute top-0 ${lang === Language.EN ? "right-0" : "left-0"} p-10`}
                >
                  <div
                    className={`px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2 ${
                      isPumping
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${isPumping ? "bg-green-500 animate-ping" : "bg-slate-300"}`}
                    ></span>
                    {t.systemStatus}: {isPumping ? t.pumping : t.readyForUse}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-16 pt-6">
                  <div className="flex flex-col items-center gap-6">
                    {isPumping && (
                      <div className="text-3xl font-mono font-black text-blue-600 flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-2xl animate-in fade-in slide-in-from-top-4">
                        <Timer size={28} />
                        {formatTime(timerSeconds)}
                      </div>
                    )}
                    <button
                      onClick={handleTogglePump}
                      className={`group relative w-56 h-56 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-2xl active:scale-95 ${
                        isPumping
                          ? "bg-red-500 hover:bg-red-600 shadow-red-200 ring-[12px] ring-red-50"
                          : "bg-green-500 hover:bg-green-600 shadow-green-200"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 rounded-full border-8 border-white/20 scale-105 group-hover:scale-125 transition-transform ${isPumping ? "animate-pulse" : ""}`}
                      ></div>
                      <Activity
                        size={64}
                        className={`text-white mb-3 ${isPumping ? "animate-bounce" : ""}`}
                      />
                      <span className="text-white font-black text-2xl tracking-tighter">
                        {isPumping ? t.stop : t.start}
                      </span>
                      <span className="text-white/70 font-black text-[10px] tracking-widest">
                        {t.pumping}
                      </span>
                    </button>
                  </div>

                  <div className="flex-grow space-y-10 w-full">
                    {/* Flavor selection was removed from here */}
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        {t.intensity}
                      </label>
                      <div className="flex gap-3 p-2 bg-slate-50 rounded-3xl border border-slate-100">
                        {[
                          PumpIntensity.LOW,
                          PumpIntensity.MEDIUM,
                          PumpIntensity.HIGH,
                        ].map((i) => (
                          <button
                            key={i}
                            onClick={() => setIntensity(i)}
                            className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${
                              intensity === i
                                ? "bg-white text-blue-600 shadow-lg"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            {i === PumpIntensity.LOW
                              ? t.low
                              : i === PumpIntensity.MEDIUM
                                ? t.medium
                                : t.high}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Bio Feedback was removed from here */}
              <div className="bg-blue-600 p-8 rounded-[40px] shadow-2xl shadow-blue-200 text-white relative overflow-hidden group">
                <h3 className="font-black text-xl mb-6 flex items-center gap-3 relative z-10">
                  <Bell size={24} />
                  {t.reminders}
                </h3>
                <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                    <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest mb-1">
                      {lang === Language.EN
                        ? "Next Medication"
                        : "الدواء التالي"}
                    </p>
                    <p className="text-lg font-bold">Alprazolam @ 08:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* High Fidelity Medication Calendar */}
          <div className="bg-white rounded-[50px] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/30">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                  <CalendarIcon size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                    {t.healthSuite}
                  </h2>
                  <p className="text-slate-500 font-medium">{t.activeMeds}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setWeekOffset((prev) => prev - 1)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setWeekOffset(0)}
                  className="font-bold text-slate-700 px-2 hover:text-blue-600 transition-colors"
                >
                  {weekOffset === 0
                    ? lang === Language.EN
                      ? "This Week"
                      : "هذا الأسبوع"
                    : lang === Language.EN
                      ? "Back to Today"
                      : "العودة لليوم"}
                </button>
                <button
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {showSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-bold animate-in fade-in slide-in-from-right-4">
                  <CheckCircle2 size={20} />
                  {lang === Language.EN ? "Success" : "تم بنجاح"}
                </div>
              )}
            </div>

            <div className="p-10 overflow-x-auto">
              <div className="grid grid-cols-7 gap-6 min-w-[1000px]">
                {days.map((day, idx) => (
                  <div key={idx} className="flex flex-col gap-4">
                    <div
                      className={`flex flex-col items-center border-2 rounded-3xl p-4 shadow-sm group transition-colors ${weekOffset === 0 && new Date().getDay() === (idx === 6 ? 0 : idx + 1) ? "border-blue-500 bg-blue-50/20" : "border-slate-100 bg-white hover:border-blue-300"}`}
                    >
                      <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">
                        {day}
                      </span>
                      <span className="text-2xl font-black text-slate-800 mt-1">
                        {weekDates[idx].dayNum}
                      </span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase">
                        {weekDates[idx].month}
                      </span>
                    </div>
                    <div
                      className={`min-h-[320px] p-4 bg-slate-50/30 rounded-[32px] border-2 border-dashed transition-all duration-300 ${meds.some((m) => m.day === idx) ? "border-blue-200 bg-blue-50/10" : "border-slate-100"} space-y-4`}
                    >
                      {meds
                        .filter((m) => m.day === idx)
                        .map((m) => (
                          <div
                            key={m.id}
                            className="p-5 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-100/50 group relative hover:-translate-y-1 transition-all animate-in zoom-in-95"
                          >
                            <button
                              onClick={() => removeMed(m.id)}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-xl shadow-lg shadow-red-200 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-10"
                            >
                              <Trash2 size={16} />
                            </button>
                            <p className="font-black text-sm text-slate-800 leading-tight">
                              {m.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 font-bold">
                              {m.dosage}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg w-fit uppercase tracking-wider">
                              <Clock size={12} />
                              {m.schedule}
                            </div>
                          </div>
                        ))}
                      {meds.filter((m) => m.day === idx).length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-200 py-10">
                          <Plus size={24} className="opacity-20 mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">
                            {lang === Language.EN ? "Schedule" : "جدول"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High Fidelity Add Medication Form */}
            <div className="p-10 bg-slate-50 border-t border-slate-100">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.medName}
                  </label>
                  <input
                    value={newMed.name}
                    onChange={(e) =>
                      setNewMed({ ...newMed, name: e.target.value })
                    }
                    type="text"
                    placeholder="e.g. Lipitor"
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.dosage}
                  </label>
                  <input
                    value={newMed.dosage}
                    onChange={(e) =>
                      setNewMed({ ...newMed, dosage: e.target.value })
                    }
                    type="text"
                    placeholder="10mg"
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.time}
                  </label>
                  <input
                    value={newMed.schedule}
                    onChange={(e) =>
                      setNewMed({ ...newMed, schedule: e.target.value })
                    }
                    type="time"
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {lang === Language.EN ? "Week Day" : "يوم الأسبوع"}
                  </label>
                  <select
                    value={newMed.day}
                    onChange={(e) =>
                      setNewMed({ ...newMed, day: parseInt(e.target.value) })
                    }
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 cursor-pointer transition-all"
                  >
                    {days.map((d, i) => (
                      <option key={i} value={i}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={addMed}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 h-[60px]"
                >
                  <Plus size={20} />
                  {t.schedule}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
