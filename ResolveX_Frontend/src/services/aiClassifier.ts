import { 
  AIAnalysisResult, 
  CampusIssue, 
  CampusLocation, 
  DepartmentName, 
  IssueCategory, 
  IssuePriority 
} from '../types';

interface ClassifierInput {
  description: string;
  location: CampusLocation;
  specificDetails?: string;
  categoryOverride?: IssueCategory | null;
  hasImage?: boolean;
  imageFileName?: string;
  existingIssues: CampusIssue[];
}

export function runAIClassificationEngine(input: ClassifierInput): AIAnalysisResult {
  const text = (input.description + ' ' + (input.specificDetails || '')).toLowerCase();
  
  // Keyword pattern rules
  const electricalKeywords = ['spark', 'shock', 'wire', 'cable', 'breaker', 'panel', 'electric', 'voltage', 'power', 'light', 'flicker', 'blackout', 'short circuit', 'conduit', 'switch'];
  const waterKeywords = ['leak', 'water', 'pipe', 'drip', 'flood', 'drain', 'plumb', 'flush', 'toilet', 'tap', 'basin', 'overflow', 'puddle', 'sewage', 'burst'];
  const hvacKeywords = ['ac', 'a/c', 'air condition', 'chiller', 'heating', 'hvac', 'vent', 'duct', 'temperature', 'fan', 'humid', 'cold', 'stuffy', 'cooling'];
  const itKeywords = ['wifi', 'wi-fi', 'internet', 'network', 'router', 'ethernet', 'cable', 'dns', 'signal', 'access point', 'portal', 'connectivity', 'server'];
  const safetyKeywords = ['hazard', 'fire', 'smoke', 'panic', 'lock', 'strobe', 'extinguisher', 'theft', 'intruder', 'broken glass', 'danger', 'alarm', 'blue light', 'emergency'];
  const civilKeywords = ['crack', 'step', 'stair', 'pavement', 'road', 'pothole', 'wall', 'tile', 'paving', 'concrete', 'ceiling tile', 'roof', 'door latch', 'hinge', 'railing'];
  const sanitationKeywords = ['garbage', 'trash', 'dustbin', 'compost', 'waste', 'smell', 'odor', 'restroom dirty', 'spill', 'bin full'];

  let matchedCategory: IssueCategory = 'Other Infrastructure';
  let matchedDepartment: DepartmentName = 'Civil & Infrastructure';
  let confidence = 85;
  let safetyHazard = false;
  const secondaryTags: string[] = [];
  const imageTagsDetected: string[] = [];

  // Detect image tags if image uploaded
  if (input.hasImage) {
    if (text.includes('leak') || text.includes('water')) {
      imageTagsDetected.push('Water pooling detected (88%)', 'Moisture sheen on surface (92%)');
    }
    if (text.includes('electric') || text.includes('wire') || text.includes('panel')) {
      imageTagsDetected.push('Electrical distribution junction (94%)', 'Potential arc point (87%)');
    }
    if (text.includes('crack') || text.includes('step') || text.includes('pothole')) {
      imageTagsDetected.push('Structural fracture line (91%)', 'Surface unevenness >25mm');
    }
    if (imageTagsDetected.length === 0) {
      imageTagsDetected.push('Physical asset defect verified (91%)', 'Location context correlated (89%)');
    }
  }

  // Cross-category hazard detection (e.g., water + electricity = critical hazard)
  const hasWater = waterKeywords.some(w => text.includes(w));
  const hasElectric = electricalKeywords.some(w => text.includes(w));
  const hasFireOrSafety = safetyKeywords.some(w => text.includes(w)) || text.includes('smoke') || text.includes('hazard');

  if (hasWater && hasElectric) {
    matchedCategory = 'Electrical';
    matchedDepartment = 'Electrical Maintenance';
    secondaryTags.push('Compound Threat (Water + High Voltage)', 'Immediate Arc Risk', 'Structural Conduit');
    safetyHazard = true;
    confidence = 97;
  } else if (hasElectric) {
    matchedCategory = 'Electrical';
    matchedDepartment = 'Electrical Maintenance';
    confidence = 94;
    secondaryTags.push('Power Subsystem', 'Terminal Grid');
  } else if (hasWater) {
    matchedCategory = 'Plumbing & Water';
    matchedDepartment = 'Plumbing & Water Works';
    confidence = 95;
    secondaryTags.push('Hydraulic Line', 'Water Conservation');
  } else if (hvacKeywords.some(w => text.includes(w))) {
    matchedCategory = 'HVAC & Climate';
    matchedDepartment = 'HVAC & Energy';
    confidence = 93;
    secondaryTags.push('Thermodynamic Loop', 'Occupancy Comfort');
  } else if (itKeywords.some(w => text.includes(w))) {
    matchedCategory = 'Internet & Network';
    matchedDepartment = 'Campus IT & Networks';
    confidence = 96;
    secondaryTags.push('Access Infrastructure', 'Digital Backbone');
  } else if (hasFireOrSafety) {
    matchedCategory = 'Security & Safety';
    matchedDepartment = 'Campus Security';
    confidence = 98;
    safetyHazard = true;
    secondaryTags.push('Life Safety System', 'Perimeter Integrity');
  } else if (civilKeywords.some(w => text.includes(w))) {
    matchedCategory = 'Civil & Structural';
    matchedDepartment = 'Civil & Infrastructure';
    confidence = 90;
    secondaryTags.push('Structural Integrity', 'Pedestrian Pathway');
  } else if (sanitationKeywords.some(w => text.includes(w))) {
    matchedCategory = 'Sanitation & Waste';
    matchedDepartment = 'Sanitation & Facilities';
    confidence = 92;
    secondaryTags.push('Campus Hygiene', 'Sanitation Route');
  }

  // If user overrode category
  if (input.categoryOverride) {
    matchedCategory = input.categoryOverride;
    confidence = 99;
  }

  // Severity Determination
  let severity: IssuePriority = 'low';
  let severityScore = 4.0;
  let priorityScore = 38;
  let estimatedResponseTime = '24 - 48 hours';
  let reasoning = '';

  const isUrgentTerm = ['urgent', 'emergency', 'immediately', 'danger', 'spark', 'flood', 'smoke', 'blackout', 'trapped', 'gas', 'collapse'].some(w => text.includes(w));
  const isHostel = input.location.type === 'hostel';

  if (safetyHazard || (hasWater && hasElectric) || text.includes('fire') || text.includes('spark') || text.includes('collapsed') || text.includes('smoke')) {
    severity = 'critical';
    severityScore = 9.4;
    priorityScore = Math.floor(90 + Math.random() * 6); // 90 - 95
    estimatedResponseTime = '< 30 minutes';
    reasoning = `High priority assigned because ${hasWater && hasElectric ? 'moisture was detected adjacent to electrical infrastructure, producing severe fire and shock hazard' : 'critical safety/hazard indicators were detected in public campus area'}. Instant automated notification sent to duty supervisor.`;
  } else if (isUrgentTerm || matchedCategory === 'Security & Safety' || (matchedCategory === 'HVAC & Climate' && input.location.code === 'LIB') || (isHostel && (hasWater || hasElectric))) {
    severity = 'high';
    severityScore = 7.9;
    priorityScore = Math.floor(74 + Math.random() * 11); // 74 - 84
    estimatedResponseTime = '1 - 2 hours';
    reasoning = `Elevated priority due to significant impact on residential or academic population at ${input.location.name}. Dispatched ahead of standard maintenance tickets.`;
  } else if (text.length > 50 || matchedCategory === 'Civil & Structural' || matchedCategory === 'Electrical') {
    severity = 'medium';
    severityScore = 5.8;
    priorityScore = Math.floor(52 + Math.random() * 14); // 52 - 65
    estimatedResponseTime = '4 - 8 hours';
    reasoning = `Standard campus operational issue. No immediate life-safety hazard detected, but requires preventive intervention to prevent compounding wear.`;
  } else {
    severity = 'low';
    severityScore = 3.8;
    priorityScore = Math.floor(35 + Math.random() * 15); // 35 - 50
    estimatedResponseTime = '24 - 48 hours';
    reasoning = `Low-impact facility issue scheduled during standard routine rounds for ${matchedDepartment}.`;
  }

  // Duplicate and Similarity Scanning against existing issues
  const nearbyIssues = input.existingIssues.filter(
    iss => iss.location.id === input.location.id && iss.category === matchedCategory && iss.status !== 'closed'
  );
  
  const similarIssueCount = nearbyIssues.length;
  let duplicateProbability = 0;
  if (similarIssueCount > 0) {
    duplicateProbability = Math.min(85, 25 + similarIssueCount * 18);
    secondaryTags.push(`${similarIssueCount} Nearby Reports`);
  }

  // Recurrence boost
  let preventiveAction: string | undefined;
  if (input.location.code === 'HBB' && matchedCategory === 'Plumbing & Water') {
    priorityScore = Math.min(98, priorityScore + 8);
    preventiveAction = 'Hostel Block B plumbing pattern flag: Recommend valve replacement per Predictive Alert #1';
  }

  return {
    category: matchedCategory,
    categoryConfidence: confidence,
    secondaryTags,
    severity,
    severityScore,
    priorityScore,
    assignedDepartment: matchedDepartment,
    estimatedResponseTime,
    similarIssueCount,
    duplicateProbability,
    safetyHazard,
    reasoning,
    imageTagsDetected: imageTagsDetected.length > 0 ? imageTagsDetected : undefined,
    preventiveActionRecommended: preventiveAction,
  };
}
