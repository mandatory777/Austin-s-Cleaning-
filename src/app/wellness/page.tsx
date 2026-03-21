'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MoodEntry, SleepLog, MOOD_EMOJIS, BREATHING_TECHNIQUES,
  saveMoodEntry, loadMoodEntries, saveBreathingSession,
  saveSleepLog, loadSleepLogs, getMoodTrend,
} from '@/lib/wellness';
import {
  loadStats, saveStats, checkAndUnlockAchievements, updateStreak,
} from '@/lib/achievements';

type Tab = 'breathe' | 'mood' | 'sleep';

export default function WellnessPage() {
  const [activeTab, setActiveTab] = useState<Tab>('breathe');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  // Breathing state
  const [breathingActive, setBreathingActive] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState(BREATHING_TECHNIQUES[0]);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [breathTimer, setBreathTimer] = useState(0);
  const [breathCycle, setBreathCycle] = useState(0);
  const [breathComplete, setBreathComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mood form state
  const [mood, setMood] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);
  const [stress, setStress] = useState<number>(3);
  const [moodNote, setMoodNote] = useState('');
  const [moodSaved, setMoodSaved] = useState(false);

  // Sleep form state
  const [hoursSlept, setHoursSlept] = useState('7');
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [sleepSaved, setSleepSaved] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setMoodEntries(loadMoodEntries());
    setSleepLogs(loadSleepLogs());
  }, []);

  // Breathing exercise logic
  const startBreathing = useCallback(() => {
    setBreathingActive(true);
    setBreathComplete(false);
    setBreathCycle(0);
    setBreathPhase('inhale');
    setBreathTimer(selectedTechnique.inhale);
  }, [selectedTechnique]);

  const stopBreathing = useCallback(() => {
    setBreathingActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!breathingActive) return;

    intervalRef.current = setInterval(() => {
      setBreathTimer(prev => {
        if (prev <= 1) {
          // Move to next phase
          setBreathPhase(currentPhase => {
            const t = selectedTechnique;
            if (currentPhase === 'inhale') {
              if (t.hold1 > 0) { setBreathTimer(t.hold1); return 'hold1'; }
              setBreathTimer(t.exhale); return 'exhale';
            }
            if (currentPhase === 'hold1') { setBreathTimer(t.exhale); return 'exhale'; }
            if (currentPhase === 'exhale') {
              if (t.hold2 > 0) { setBreathTimer(t.hold2); return 'hold2'; }
              // New cycle
              setBreathCycle(c => {
                if (c + 1 >= t.cycles) {
                  // Done!
                  setBreathingActive(false);
                  setBreathComplete(true);
                  if (intervalRef.current) clearInterval(intervalRef.current);

                  // Save session
                  const totalSeconds = t.cycles * (t.inhale + t.hold1 + t.exhale + t.hold2);
                  saveBreathingSession({
                    id: `breath-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    technique: t.name,
                    durationSeconds: totalSeconds,
                    completedAt: new Date().toISOString(),
                  });

                  // Update stats
                  const stats = loadStats();
                  stats.totalBreathingSessions += 1;
                  stats.xp += 15;
                  const updated = updateStreak(stats, new Date().toISOString().split('T')[0]);
                  saveStats(updated);
                  const achievements = checkAndUnlockAchievements(updated);
                  if (achievements.length > 0) {
                    setNewAchievement(`${achievements[0].emoji} ${achievements[0].title}`);
                    setTimeout(() => setNewAchievement(null), 3000);
                  }

                  return c + 1;
                }
                setBreathTimer(t.inhale);
                return c + 1;
              });
              return 'inhale';
            }
            // hold2 → new cycle
            setBreathCycle(c => {
              if (c + 1 >= t.cycles) {
                setBreathingActive(false);
                setBreathComplete(true);
                if (intervalRef.current) clearInterval(intervalRef.current);
                return c + 1;
              }
              setBreathTimer(t.inhale);
              return c + 1;
            });
            return 'inhale';
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [breathingActive, selectedTechnique]);

  const handleSaveMood = () => {
    const entry: MoodEntry = {
      id: `mood-${Date.now()}`,
      date: today,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      mood: mood as MoodEntry['mood'],
      energy: energy as MoodEntry['energy'],
      stress: stress as MoodEntry['stress'],
      note: moodNote,
      loggedAt: new Date().toISOString(),
    };
    saveMoodEntry(entry);
    setMoodEntries([entry, ...moodEntries]);

    // Update stats
    const stats = loadStats();
    stats.totalMoodCheckins += 1;
    stats.xp += 10;
    const updated = updateStreak(stats, today);
    saveStats(updated);
    const achievements = checkAndUnlockAchievements(updated);
    if (achievements.length > 0) {
      setNewAchievement(`${achievements[0].emoji} ${achievements[0].title}`);
      setTimeout(() => setNewAchievement(null), 3000);
    }

    setMoodSaved(true);
    setMoodNote('');
    setTimeout(() => setMoodSaved(false), 2000);
  };

  const handleSaveSleep = () => {
    const log: SleepLog = {
      id: `sleep-${Date.now()}`,
      date: today,
      hoursSlept: parseFloat(hoursSlept),
      quality: sleepQuality as SleepLog['quality'],
      bedtime,
      wakeTime,
      loggedAt: new Date().toISOString(),
    };
    saveSleepLog(log);
    setSleepLogs([log, ...sleepLogs.filter(l => l.date !== today)]);
    setSleepSaved(true);
    setTimeout(() => setSleepSaved(false), 2000);
  };

  const moodTrend = getMoodTrend(moodEntries);
  const todaySleep = sleepLogs.find(l => l.date === today);

  const phaseLabel = breathPhase === 'inhale' ? 'Breathe In' :
                     breathPhase === 'exhale' ? 'Breathe Out' : 'Hold';

  // Circle animation scale
  const phaseProgress = (() => {
    const t = selectedTechnique;
    const total = breathPhase === 'inhale' ? t.inhale :
                  breathPhase === 'hold1' ? t.hold1 :
                  breathPhase === 'exhale' ? t.exhale : t.hold2;
    return total > 0 ? 1 - (breathTimer / total) : 0;
  })();

  const circleScale = breathPhase === 'inhale' ? 0.6 + (phaseProgress * 0.4) :
                      breathPhase === 'exhale' ? 1 - (phaseProgress * 0.4) : 1;

  return (
    <div className="min-h-screen bg-[#e0e5ec] pb-28">
      <div className="max-w-lg md:max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {/* Achievement toast */}
        {newAchievement && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-5 py-3 rounded-2xl shadow-lg animate-bounce text-sm font-bold">
            🏆 Achievement Unlocked: {newAchievement}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-5 -mx-4 px-4">
          <h1 className="text-2xl font-bold text-indigo-700">🧘 Wellness</h1>
          <p className="text-sm text-gray-500">Breathe, reflect, rest — your mental health matters</p>
        </div>

        {/* Tabs */}
        <div className="neu-pressed rounded-xl p-1 flex">
          {[
            { key: 'breathe' as Tab, label: '🫁 Breathe' },
            { key: 'mood' as Tab, label: '🪞 Mood' },
            { key: 'sleep' as Tab, label: '😴 Sleep' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.key ? 'bg-[#e0e5ec] text-indigo-600' : 'text-gray-400'
              }`}
              style={activeTab === tab.key ? { boxShadow: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff' } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== BREATHE TAB ===== */}
        {activeTab === 'breathe' && (
          <div className="space-y-4">
            {!breathingActive && !breathComplete && (
              <>
                {/* Technique cards */}
                <div className="grid grid-cols-2 gap-3">
                  {BREATHING_TECHNIQUES.map(tech => (
                    <button
                      key={tech.id}
                      onClick={() => setSelectedTechnique(tech)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        selectedTechnique.id === tech.id ? 'neu-pressed' : 'neu-flat'
                      }`}
                    >
                      <div className="text-2xl mb-1">{tech.emoji}</div>
                      <div className={`text-sm font-bold ${selectedTechnique.id === tech.id ? 'text-indigo-600' : 'text-gray-700'}`}>
                        {tech.name}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{tech.description}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={startBreathing}
                  className="w-full py-3.5 font-semibold text-base rounded-xl text-white"
                  style={{ background: `linear-gradient(145deg, ${selectedTechnique.color}, ${selectedTechnique.color}dd)`, boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' }}
                >
                  Start {selectedTechnique.name}
                </button>
              </>
            )}

            {/* Active breathing */}
            {breathingActive && (
              <div className="neu-flat p-8 text-center" style={{ background: `linear-gradient(135deg, #e0e5ec 0%, ${selectedTechnique.color}15 100%)` }}>
                <div className="text-xs text-gray-400 mb-2 font-medium">
                  Cycle {breathCycle + 1} of {selectedTechnique.cycles}
                </div>

                {/* Animated circle */}
                <div className="flex justify-center my-8">
                  <div
                    className="rounded-full flex items-center justify-center transition-transform duration-1000 ease-in-out"
                    style={{
                      width: 160,
                      height: 160,
                      transform: `scale(${circleScale})`,
                      background: `radial-gradient(circle, ${selectedTechnique.color}30, ${selectedTechnique.color}10)`,
                      border: `3px solid ${selectedTechnique.color}50`,
                    }}
                  >
                    <div className="text-center">
                      <div className="text-4xl font-bold" style={{ color: selectedTechnique.color }}>
                        {breathTimer}
                      </div>
                      <div className="text-sm font-semibold text-gray-500 mt-1">{phaseLabel}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={stopBreathing}
                  className="neu-btn text-sm px-6"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Complete */}
            {breathComplete && (
              <div className="neu-flat p-8 text-center" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #d1fae5 100%)' }}>
                <div className="text-5xl mb-3">🌿</div>
                <h3 className="text-xl font-bold text-green-600">Session Complete!</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Great job. You completed {selectedTechnique.cycles} cycles of {selectedTechnique.name}.
                </p>
                <p className="text-xs text-indigo-500 mt-2 font-medium">+15 XP earned</p>
                <button
                  onClick={() => setBreathComplete(false)}
                  className="neu-btn mt-4 text-sm px-6"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== MOOD TAB ===== */}
        {activeTab === 'mood' && (
          <div className="space-y-4">
            {/* Mood trend card */}
            {moodEntries.length >= 2 && (
              <div className="neu-flat-purple p-4 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-gray-700">7-Day Mood</span>
                  <p className="text-xs text-gray-400">
                    {moodTrend.trend === 'up' ? 'Trending up! 📈' :
                     moodTrend.trend === 'down' ? 'Trending down 📉' : 'Staying steady ➡️'}
                  </p>
                </div>
                <div className="text-3xl">{MOOD_EMOJIS[Math.round(moodTrend.avg) - 1]}</div>
              </div>
            )}

            {/* Quick mood check-in */}
            <div className="neu-flat p-5" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #ede9fe 100%)' }}>
              <h3 className="text-sm font-bold text-gray-700 mb-4">How are you feeling?</h3>

              {/* Mood slider */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 font-medium">Mood</label>
                <div className="flex justify-between mt-2">
                  {MOOD_EMOJIS.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => setMood(i + 1)}
                      className={`text-2xl p-2 rounded-xl transition-all ${
                        mood === i + 1 ? 'neu-pressed scale-110' : 'opacity-50 hover:opacity-75'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy slider */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 font-medium">Energy Level</label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Low</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={energy}
                    onChange={e => setEnergy(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-400">High</span>
                </div>
              </div>

              {/* Stress slider */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 font-medium">Stress Level</label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Calm</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={stress}
                    onChange={e => setStress(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-400">Stressed</span>
                </div>
              </div>

              {/* Note */}
              <textarea
                value={moodNote}
                onChange={e => setMoodNote(e.target.value)}
                placeholder="What's on your mind? (optional)"
                className="neu-input resize-none h-16 text-sm mb-3"
              />

              <button
                onClick={handleSaveMood}
                className="neu-btn-accent w-full py-3 font-semibold"
              >
                {moodSaved ? '✓ Saved!' : 'Log Mood +10 XP'}
              </button>
            </div>

            {/* Recent mood entries */}
            {moodEntries.length > 0 && (
              <div className="neu-flat p-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Check-ins</h3>
                <div className="space-y-2">
                  {moodEntries.slice(0, 5).map(entry => (
                    <div key={entry.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/30">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{MOOD_EMOJIS[entry.mood - 1]}</span>
                        <div>
                          <div className="text-xs text-gray-500">{entry.time} · {entry.date}</div>
                          {entry.note && <div className="text-xs text-gray-400 italic mt-0.5">{entry.note}</div>}
                        </div>
                      </div>
                      <div className="text-right text-[10px] text-gray-400">
                        <div>Energy: {entry.energy}/5</div>
                        <div>Stress: {entry.stress}/5</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== SLEEP TAB ===== */}
        {activeTab === 'sleep' && (
          <div className="space-y-4">
            {/* Today's sleep status */}
            {todaySleep && (
              <div className="neu-flat p-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #dbeafe 100%)' }}>
                <div className="text-4xl">😴</div>
                <div>
                  <div className="text-lg font-bold text-gray-700">{todaySleep.hoursSlept}h sleep</div>
                  <div className="text-xs text-gray-400">
                    Quality: {'⭐'.repeat(todaySleep.quality)} · {todaySleep.bedtime} → {todaySleep.wakeTime}
                  </div>
                </div>
              </div>
            )}

            {/* Sleep log form */}
            <div className="neu-flat p-5" style={{ background: 'linear-gradient(135deg, #e0e5ec 0%, #dbeafe 100%)' }}>
              <h3 className="text-sm font-bold text-gray-700 mb-4">Log Last Night&apos;s Sleep</h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Bedtime</label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={e => setBedtime(e.target.value)}
                    className="neu-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Wake Time</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={e => setWakeTime(e.target.value)}
                    className="neu-input text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-500 font-medium block mb-1">Hours Slept</label>
                <input
                  type="number"
                  value={hoursSlept}
                  onChange={e => setHoursSlept(e.target.value)}
                  step="0.5"
                  min="0"
                  max="14"
                  className="neu-input text-lg font-bold"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-500 font-medium block mb-1">Sleep Quality</label>
                <div className="flex justify-between mt-1">
                  {[1, 2, 3, 4, 5].map(q => (
                    <button
                      key={q}
                      onClick={() => setSleepQuality(q)}
                      className={`text-xl p-2 rounded-xl transition-all ${
                        sleepQuality === q ? 'neu-pressed' : 'opacity-40 hover:opacity-70'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveSleep}
                className="neu-btn-blue w-full py-3 font-semibold"
              >
                {sleepSaved ? '✓ Saved!' : 'Log Sleep'}
              </button>
            </div>

            {/* Sleep history */}
            {sleepLogs.length > 0 && (
              <div className="neu-flat p-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Sleep History</h3>
                <div className="space-y-2">
                  {sleepLogs.slice(0, 7).map(log => (
                    <div key={log.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/30">
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          {new Date(log.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-gray-400">{log.bedtime} → {log.wakeTime}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-600">{log.hoursSlept}h</div>
                        <div className="text-[10px]">{'⭐'.repeat(log.quality)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
