import React, { useState } from 'react';
import { 
  Upload, 
  MapPin, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Crosshair, 
  AlertCircle, 
  FileText, 
  X,
  Search,
  CheckCircle2,
  ChevronDown,
  Camera
} from 'lucide-react';
import { CampusIssue, CampusLocation, IssueCategory } from '../../types';
import { CAMPUS_LOCATIONS } from '../../data/mockData';
import { CampusMapViewer } from '../common/CampusMapViewer';
import { AIAnalysisSequenceModal } from './AIAnalysisSequenceModal';
import { runAIClassificationEngine } from '../../services/aiClassifier';

interface ReportIssueViewProps {
  existingIssues: CampusIssue[];
  onSubmitNewIssue: (newIssue: CampusIssue) => void;
  onCancel: () => void;
}

export const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  existingIssues,
  onSubmitNewIssue,
  onCancel,
}) => {
  const [description, setDescription] = useState('');
  const [specificDetails, setSpecificDetails] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation>(CAMPUS_LOCATIONS[0]);
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageVisionTags, setImageVisionTags] = useState<string[]>([]);
  const [imageVisionConfidence, setImageVisionConfidence] = useState<number>(0);
  const [letAIClassify, setLetAIClassify] = useState(true);
  const [categoryOverride, setCategoryOverride] = useState<IssueCategory | ''>('');
  const [showOverrideDropdown, setShowOverrideDropdown] = useState(false);
  
  // Modal state
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [formError, setFormError] = useState('');

  // Sample quick-fill templates for instant testing & demonstration
  const handleQuickFill = (type: 'electrical' | 'water' | 'hvac' | 'wifi') => {
    if (type === 'electrical') {
      setDescription('Water leakage near electrical panel in basement corridor. Water is actively dripping onto conduits with sparking sounds.');
      setSelectedLocation(CAMPUS_LOCATIONS[0]); // Hostel Block B
      setSpecificDetails('Basement utility closet B-08, next to laundry area');
      setImagePreview('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800');
      setImageVisionTags(['Exposed 415V distribution conduit', 'Moisture accumulation on wall']);
      setImageVisionConfidence(94);
    } else if (type === 'water') {
      setDescription('Main vertical riser valve ruptured. High volume water leaking across hallway floor.');
      setSelectedLocation(CAMPUS_LOCATIONS[0]);
      setSpecificDetails('2nd floor restroom shaft');
      setImagePreview('https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=800');
      setImageVisionTags(['High pressure water spray', 'Tile floor pooling']);
      setImageVisionConfidence(91);
    } else if (type === 'hvac') {
      setDescription('Air handling unit in main auditorium has stopped running. Classroom ambient temperature reached 29°C.');
      setSelectedLocation(CAMPUS_LOCATIONS[4]); // Central Library
      setSpecificDetails('Auditorium East Wing');
      setImagePreview(null);
      setImageVisionTags([]);
    } else if (type === 'wifi') {
      setDescription('Wireless access point dropped offline. All student laptops unable to resolve DNS or reach class portals.');
      setSelectedLocation(CAMPUS_LOCATIONS[4]);
      setSpecificDetails('2nd Floor Quiet Study Area');
      setImagePreview(null);
      setImageVisionTags([]);
    }
    setFormError('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // Instant simulated AI image feature tag extraction
        const descLower = description.toLowerCase();
        if (descLower.includes('water') || descLower.includes('leak')) {
          setImageVisionTags(['Water pooling detected', 'Surface moisture gradient']);
          setImageVisionConfidence(93);
        } else if (descLower.includes('electric') || descLower.includes('wire')) {
          setImageVisionTags(['Electrical distribution hazard', 'Exposed conductor point']);
          setImageVisionConfidence(94);
        } else {
          setImageVisionTags(['Physical infrastructure anomaly detected', 'Optical surface texture deviation']);
          setImageVisionConfidence(89);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Snap to Central Library or closest campus building
          setSelectedLocation(CAMPUS_LOCATIONS[4]);
          setSpecificDetails('GPS auto-pinpoint: Near Central Library quadrangle');
        },
        () => {
          setSelectedLocation(CAMPUS_LOCATIONS[4]);
          setSpecificDetails('Approximate location: Campus Central Hub');
        }
      );
    } else {
      setSelectedLocation(CAMPUS_LOCATIONS[4]);
    }
  };

  const filteredLocations = CAMPUS_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(searchLocationQuery.toLowerCase()) ||
    loc.code.toLowerCase().includes(searchLocationQuery.toLowerCase()) ||
    loc.zone.toLowerCase().includes(searchLocationQuery.toLowerCase())
  );

  const handleStartAnalysis = () => {
    if (!description.trim() || description.trim().length < 8) {
      setFormError('Please enter a descriptive summary of the problem (at least 8 characters).');
      return;
    }
    setFormError('');

    // Run AI classification engine
    const analysis = runAIClassificationEngine({
      description,
      location: selectedLocation,
      specificDetails,
      categoryOverride: (!letAIClassify && categoryOverride) ? (categoryOverride as IssueCategory) : null,
      hasImage: !!imagePreview,
      existingIssues,
    });

    setCurrentAnalysis(analysis);
    setShowAnalysisModal(true);
  };

  const handleFinalSubmit = () => {
    if (!currentAnalysis) return;

    const titleWords = description.split(' ').slice(0, 7).join(' ');
    const formattedTitle = titleWords.length < description.length ? `${titleWords}...` : titleWords;

    const newIssue: CampusIssue = {
      id: `iss-${Date.now()}`,
      trackingNumber: `CI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1),
      description,
      category: currentAnalysis.category,
      location: selectedLocation,
      specificLocationDetails: specificDetails || `${selectedLocation.name} grounds`,
      reportedBy: {
        name: 'Alex Rivera',
        role: 'Student',
        email: 'alex.rivera@university.edu',
      },
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: currentAnalysis.severity,
      priorityScore: currentAnalysis.priorityScore,
      status: 'ai_analyzed',
      assignedDepartment: currentAnalysis.assignedDepartment,
      aiAnalysis: currentAnalysis,
      images: imagePreview ? [imagePreview] : [],
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          status: 'reported',
          label: 'Report Submitted',
          timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
          actor: 'Alex Rivera (Mobile)',
        },
        {
          id: `t-${Date.now()}-2`,
          status: 'ai_analyzed',
          label: 'AI Classified & Prioritized',
          timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
          actor: 'CampusPulse AI Engine',
          notes: `Assigned Priority ${currentAnalysis.priorityScore}/100. Routed to ${currentAnalysis.assignedDepartment}.`,
        }
      ],
      upvotes: 1,
    };

    setShowAnalysisModal(false);
    onSubmitNewIssue(newIssue);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligent Ingestion</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Report a Campus Issue
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tell us what's wrong. Our AI will handle the classification, severity estimation, and department routing.
            </p>
          </div>

          {/* Quick Demo Pre-sets */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col gap-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Quick Test Templates:
            </span>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => handleQuickFill('electrical')}
                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded text-[11px] border border-red-200 transition-colors"
              >
                🔴 Leak near panel
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('water')}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded text-[11px] border border-amber-200 transition-colors"
              >
                🟠 Riser leak
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('wifi')}
                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded text-[11px] border border-blue-200 transition-colors"
              >
                🔵 Library Wi-Fi
              </button>
            </div>
          </div>
        </div>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Reporting Form */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        {/* 1. Issue Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Issue Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (formError) setFormError('');
            }}
            placeholder="Describe the problem in plain language... (e.g., Water leakage near electrical panel on ground floor, flickering lights in stairwell, broken access card reader)"
            className="w-full rounded-lg border border-slate-300 p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>The AI parses safety keywords, compound hazards, and urgency modifiers automatically.</span>
          </p>
        </div>

        {/* 2. Upload Image with AI Image Analysis preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Upload Evidence / Image (Optional)
          </label>

          {!imagePreview ? (
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/60 hover:bg-blue-50/30 transition-all group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="p-3 bg-white rounded-full border border-slate-200 text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-transform shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 mt-2">
                Click to upload or drag and drop photo
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                PNG, JPG, HEIC up to 10MB
              </span>
            </label>
          ) : (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-200">
                <img
                  src={imagePreview}
                  alt="Evidence Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageVisionTags([]);
                  }}
                  className="absolute top-1 right-1 bg-slate-900/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* AI Image Analysis Badge */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    AI Image Analysis
                  </span>
                  {imageVisionConfidence > 0 && (
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Confidence: {imageVisionConfidence}%
                    </span>
                  )}
                </div>

                <div className="mt-2 space-y-1">
                  {imageVisionTags.length > 0 ? (
                    imageVisionTags.map((tag, i) => (
                      <div key={i} className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{tag}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">
                      Visual inspection confirmed. Ready for neural risk scoring.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Location Picker */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Campus Location <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Select location on map, search building, or use current location
              </p>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors self-start"
            >
              <Crosshair className="w-3.5 h-3.5 text-blue-600" />
              <span>Use Current Location (GPS)</span>
            </button>
          </div>

          {/* Location Search Bar & Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLocationQuery}
                onChange={(e) => setSearchLocationQuery(e.target.value)}
                placeholder="Search building name or code..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <select
              value={selectedLocation.id}
              onChange={(e) => {
                const found = CAMPUS_LOCATIONS.find(l => l.id === e.target.value);
                if (found) setSelectedLocation(found);
              }}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {filteredLocations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  [{loc.code}] {loc.name} - {loc.zone}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Campus Map Stage */}
          <div className="pt-1">
            <CampusMapViewer
              issues={existingIssues}
              selectedLocationId={selectedLocation.id}
              onSelectLocation={(loc) => setSelectedLocation(loc)}
              interactiveSelectMode={true}
            />
          </div>

          {/* Room / Specific Details input */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Specific Room, Corridor, or Landmark Details (Optional)
            </label>
            <input
              type="text"
              value={specificDetails}
              onChange={(e) => setSpecificDetails(e.target.value)}
              placeholder="e.g. Ground Floor, Service Corridor B-12 next to elevator shaft"
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* 4. Category selection (Let AI classify default vs manual override) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="letAIClassify"
                checked={letAIClassify}
                onChange={(e) => {
                  setLetAIClassify(e.target.checked);
                  if (e.target.checked) setCategoryOverride('');
                }}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="letAIClassify" className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Let AI automatically classify this issue</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                setLetAIClassify(false);
                setShowOverrideDropdown(!showOverrideDropdown);
              }}
              className="text-xs text-slate-500 hover:text-blue-600 underline font-medium"
            >
              Override AI classification
            </button>
          </div>

          {!letAIClassify && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Manual Category Override:
              </label>
              <select
                value={categoryOverride}
                onChange={(e) => setCategoryOverride(e.target.value as IssueCategory)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">Select Category...</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing & Water">Plumbing &amp; Water</option>
                <option value="HVAC & Climate">HVAC &amp; Climate</option>
                <option value="Civil & Structural">Civil &amp; Structural</option>
                <option value="Internet & Network">Internet &amp; Network</option>
                <option value="Sanitation & Waste">Sanitation &amp; Waste</option>
                <option value="Security & Safety">Security &amp; Safety</option>
                <option value="Furniture & Fixtures">Furniture &amp; Fixtures</option>
                <option value="Roads & Pathways">Roads &amp; Pathways</option>
                <option value="Other Infrastructure">Other Infrastructure</option>
              </select>
            </div>
          )}
        </div>

        {/* 5. Submit CTA */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartAnalysis}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze &amp; Submit Issue</span>
          </button>
        </div>
      </div>

      {/* AI Processing Sequence Modal */}
      {currentAnalysis && (
        <AIAnalysisSequenceModal
          isOpen={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
          analysisResult={currentAnalysis}
          issueTitle={description}
          location={selectedLocation}
          hasImage={!!imagePreview}
          onConfirmSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
};
