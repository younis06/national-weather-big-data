import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  MapPin, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Radio, 
  Upload,
  CheckCircle2
} from 'lucide-react';
import { verifyReportWithAI, checkDuplicate } from '../../services/aiVerificationEngine';

export default function CitizenReportModal({ 
  isOpen, 
  onClose, 
  t, 
  lang, 
  onAddReport, 
  existingReports 
}) {
  const [category, setCategory] = useState('rainfall');
  const [severity, setSeverity] = useState('moderate');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [lat, setLat] = useState(19.0760);
  const [lng, setLng] = useState(72.8777);
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      // Run AI Verification & Cross-Referencing
      const aiResult = verifyReportWithAI({
        text: description || `${severity} ${category} observed in ${city}`,
        category,
        lat,
        lng,
        claimedIntensity: severity
      });

      // Deduplication check
      const dupCheck = checkDuplicate({
        lat,
        lng,
        category: aiResult.detectedCategory,
        existingReports
      });

      const newReport = {
        id: `BD-CR-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        source: 'citizen',
        sourceHandle: 'Citizen Observer (Jan-Mausam)',
        sourcePlatform: 'Jan-Mausam Crowdsource',
        text: description || `${severity.toUpperCase()} ${category} recorded in ${city}.`,
        city,
        state,
        lat,
        lng,
        eventCategory: aiResult.detectedCategory,
        mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&auto=format&fit=crop&q=80',
        hasMedia: !!mediaUrl,
        verificationStatus: aiResult.status,
        aiConfidenceScore: aiResult.confidenceScore,
        nearestSensor: aiResult.nearestSensor,
        clusterCount: dupCheck.isDuplicate ? 2 : 1,
        tags: ['#JanMausam', '#CitizenReport', `#${category}`]
      };

      onAddReport(newReport);
      setIsProcessing(false);
      setSubmissionResult({
        report: newReport,
        aiResult,
        dupCheck
      });
    }, 900);
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setDescription('');
    setMediaUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-300 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-[#0b2545] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-serif">
                {t.reportModalTitle}
              </h3>
              <p className="text-xs text-slate-300">
                National Weather Big Data Ingestion Service
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {!submissionResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-200">
                {t.reportModalDesc}
              </p>

              {/* Event Category Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {t.eventTypeLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'rainfall', label: 'Rainfall', icon: '🌧️' },
                    { id: 'flooding', label: 'Flooding', icon: '🌊' },
                    { id: 'thunderstorm', label: 'Thunderstorm', icon: '⚡' },
                    { id: 'strong_winds', label: 'Strong Winds', icon: '💨' },
                    { id: 'heatwave', label: 'Heatwave', icon: '🔥' },
                    { id: 'fog', label: 'Dense Fog', icon: '🌫️' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-2 rounded-lg border flex items-center gap-1.5 font-semibold text-left transition ${
                        category === cat.id
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t.severityLabel}
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="light">Light / Minor</option>
                    <option value="moderate">Moderate / Noticeable</option>
                    <option value="heavy">Heavy / Severe</option>
                    <option value="extreme">Extreme / Disastrous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    City / Location
                  </label>
                  <select
                    value={city}
                    onChange={(e) => {
                      const c = e.target.value;
                      setCity(c);
                      if (c === 'Mumbai') { setLat(19.0760); setLng(72.8777); setState('Maharashtra'); }
                      else if (c === 'New Delhi') { setLat(28.6139); setLng(77.2090); setState('Delhi (NCT)'); }
                      else if (c === 'Kolkata') { setLat(22.5726); setLng(88.3639); setState('West Bengal'); }
                      else if (c === 'Bengaluru') { setLat(12.9716); setLng(77.5946); setState('Karnataka'); }
                      else if (c === 'Puri') { setLat(19.8135); setLng(85.8312); setState('Odisha'); }
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Mumbai">Mumbai (Maharashtra)</option>
                    <option value="New Delhi">New Delhi (NCR)</option>
                    <option value="Kolkata">Kolkata (West Bengal)</option>
                    <option value="Bengaluru">Bengaluru (Karnataka)</option>
                    <option value="Puri">Puri (Odisha)</option>
                  </select>
                </div>
              </div>

              {/* Description Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t.commentsLabel}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Waterlogging 2 feet deep near railway underpass, traffic blocked, intense rainfall for last 45 minutes."
                  rows={3}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Media URL / Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t.mediaLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://... (or image URL)"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaUrl('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-2 rounded-lg border border-slate-300 font-medium"
                  >
                    Sample Photo
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#134074] hover:bg-[#0b2545] disabled:bg-slate-400 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{isProcessing ? t.submitting : t.submitReport}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Post-Submission AI Feedback */
            <div className="space-y-4 text-center py-2 animate-in fade-in zoom-in duration-150">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 font-serif">
                  Report Successfully Ingested!
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned ID: <span className="font-mono font-bold text-slate-800">{submissionResult.report.id}</span>
                </p>
              </div>

              {/* AI Verification Assessment Card */}
              <div className={`p-4 rounded-xl border text-left ${
                submissionResult.report.verificationStatus === 'verified'
                  ? 'bg-emerald-50 border-emerald-300'
                  : submissionResult.report.verificationStatus === 'fake'
                  ? 'bg-red-50 border-red-300'
                  : 'bg-amber-50 border-amber-300'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-700" />
                    AI Verification Engine Feedback
                  </span>
                  <span className="font-mono text-sm">
                    {submissionResult.report.aiConfidenceScore}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {submissionResult.report.nearestSensor?.matchAssessment}
                </p>
                <div className="text-[11px] text-slate-600 mt-2 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Matched with nearby weather data where available.</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-[#0b2545] hover:bg-[#13315c] text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition"
              >
                Close and Return to Map
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
