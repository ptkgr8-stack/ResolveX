export type IssuePriority = 'critical' | 'high' | 'medium' | 'low';

export type IssueStatus = 
  | 'reported' 
  | 'ai_analyzed' 
  | 'assigned' 
  | 'in_progress' 
  | 'resolved' 
  | 'closed';

export type IssueCategory = 
  | 'Electrical'
  | 'Plumbing & Water'
  | 'HVAC & Climate'
  | 'Civil & Structural'
  | 'Internet & Network'
  | 'Sanitation & Waste'
  | 'Security & Safety'
  | 'Furniture & Fixtures'
  | 'Roads & Pathways'
  | 'Other Infrastructure';

export type DepartmentName = 
  | 'Electrical Maintenance'
  | 'Plumbing & Water Works'
  | 'Campus IT & Networks'
  | 'Sanitation & Facilities'
  | 'Civil & Infrastructure'
  | 'Campus Security'
  | 'HVAC & Energy';

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  zone: 'North Campus' | 'South Campus' | 'East Wing' | 'West Quad' | 'Central Hub';
  coordinates: { x: number; y: number }; // percentage on map [0-100]
  type: 'hostel' | 'academic' | 'facility' | 'recreational' | 'administrative';
}

export interface TimelineEvent {
  id: string;
  status: IssueStatus;
  label: string;
  timestamp: string;
  actor: string;
  notes?: string;
}

export interface AIAnalysisResult {
  category: IssueCategory;
  categoryConfidence: number; // 0-100
  secondaryTags: string[];
  severity: IssuePriority;
  severityScore: number; // 1-10
  priorityScore: number; // 0-100
  assignedDepartment: DepartmentName;
  estimatedResponseTime: string;
  similarIssueCount: number;
  duplicateProbability: number; // 0-100
  safetyHazard: boolean;
  reasoning: string;
  imageTagsDetected?: string[];
  preventiveActionRecommended?: string;
}

export interface CampusIssue {
  id: string;
  trackingNumber: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: CampusLocation;
  specificLocationDetails: string;
  reportedBy: {
    name: string;
    role: 'Student' | 'Faculty' | 'Staff' | 'Campus Security';
    email: string;
    avatar?: string;
  };
  reportedAt: string;
  updatedAt: string;
  priority: IssuePriority;
  priorityScore: number; // 0-100
  status: IssueStatus;
  assignedDepartment: DepartmentName;
  assignedTechnician?: string;
  aiAnalysis: AIAnalysisResult;
  images: string[];
  timeline: TimelineEvent[];
  isDuplicateOf?: string;
  upvotes: number;
}

export interface DepartmentMetric {
  id: string;
  name: DepartmentName;
  head: string;
  contactExtension: string;
  openIssues: number;
  criticalIssues: number;
  avgResolutionHours: number;
  slaPerformance: number; // 0-100 percentage
  currentWorkload: 'Optimal' | 'Elevated' | 'Near Capacity' | 'Critical';
  activeTechnicians: number;
}

export interface PredictiveAlert {
  id: string;
  targetLocation: string;
  category: IssueCategory;
  probability: number; // e.g., 78%
  timeframe: string; // e.g., "within 14 days"
  historicalOccurrences: number;
  trend: 'increasing' | 'stable' | 'spiking';
  rootCauseHypothesis: string;
  recommendedAction: string;
  urgency: 'high' | 'moderate' | 'scheduled';
  department: DepartmentName;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin' | 'technician';
  department?: string;
  avatar: string;
  studentId?: string;
  reportsCount: number;
}

export interface CampusKPIs {
  totalOpenIssues: number;
  criticalIssues: number;
  avgResolutionTimeHours: number;
  issuesResolvedToday: number;
  activePredictionAlerts: number;
  duplicateFilteredPercent: number;
}
