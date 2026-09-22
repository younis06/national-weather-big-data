export function getAuthenticityAssessment(item) {
  if (item.authenticityLabel && item.authenticityReason) {
    return {
      label: item.authenticityLabel,
      score: item.authenticityScore ?? item.aiConfidenceScore ?? 0,
      reason: item.authenticityReason
    };
  }

  if (item.source === 'weather_api') {
    return {
      label: 'DIRECT OBSERVATION',
      score: 95,
      reason: 'Live measurement returned directly by the Open-Meteo weather API. This confirms the observation, not a news claim.'
    };
  }

  if (item.verificationStatus === 'verified' && item.sourceCount > 1) {
    return {
      label: 'VERIFIED FOR DISPLAY',
      score: item.aiConfidenceScore ?? Math.min(90, 55 + item.sourceCount * 10),
      reason: item.authenticityReason || `${item.sourceCount} independent publishers report a matching event. This supports authenticity but cannot guarantee every detail.`
    };
  }

  return {
    label: 'HELD BACK',
    score: 0,
    reason: 'This story was withheld because it lacks enough corroborating sources or a verified publisher domain.'
  };
}
