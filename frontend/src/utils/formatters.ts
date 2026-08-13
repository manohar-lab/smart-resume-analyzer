// Format utility functions

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatScore = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    VERIFIED: '#4CAF50',
    SUPPORTED: '#2196F3',
    CLAIMED: '#FF9800',
    UNCERTAIN: '#9E9E9E',
    BEGINNER: '#FF9800',
    INTERMEDIATE: '#2196F3',
    ADVANCED: '#4CAF50',
  };
  return colors[status] || '#9E9E9E';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    VERIFIED: 'Verified',
    SUPPORTED: 'Supported',
    CLAIMED: 'Claimed',
    UNCERTAIN: 'Uncertain',
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
  };
  return labels[status] || status;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const pluralize = (count: number, singular: string, plural: string): string => {
  return count === 1 ? singular : plural;
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    languages: 'Programming Languages',
    frameworks: 'Frameworks & Libraries',
    cloud: 'Cloud & DevOps',
    databases: 'Databases',
    tools: 'Tools & Version Control',
    'soft_skills': 'Soft Skills',
  };
  return labels[category] || category;
};
