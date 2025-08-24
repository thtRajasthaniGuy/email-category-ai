// lib/categories.ts
export interface CategoryMeta {
  label: string;
  icon: string;
  badge: string;
  color: string;
}

const categoryMap: Record<string, CategoryMeta> = {
  work: {
    label: 'Work',
    icon: '💼',
    badge: 'bg-blue-100 text-blue-800',
    color: 'blue'
  },
  personal: {
    label: 'Personal',
    icon: '👤',
    badge: 'bg-green-100 text-green-800',
    color: 'green'
  },
  finance: {
    label: 'Finance',
    icon: '💰',
    badge: 'bg-yellow-100 text-yellow-800',
    color: 'yellow'
  },
  shopping: {
    label: 'Shopping',
    icon: '🛒',
    badge: 'bg-purple-100 text-purple-800',
    color: 'purple'
  },
  travel: {
    label: 'Travel',
    icon: '✈️',
    badge: 'bg-indigo-100 text-indigo-800',
    color: 'indigo'
  },
  health: {
    label: 'Health',
    icon: '🏥',
    badge: 'bg-red-100 text-red-800',
    color: 'red'
  },
  education: {
    label: 'Education',
    icon: '🎓',
    badge: 'bg-teal-100 text-teal-800',
    color: 'teal'
  },
  social: {
    label: 'Social',
    icon: '👥',
    badge: 'bg-pink-100 text-pink-800',
    color: 'pink'
  },
  news: {
    label: 'News',
    icon: '📰',
    badge: 'bg-slate-100 text-slate-800',
    color: 'slate'
  },
  promotions: {
    label: 'Promotions',
    icon: '🎯',
    badge: 'bg-orange-100 text-orange-800',
    color: 'orange'
  },
  spam: {
    label: 'Spam',
    icon: '🚫',
    badge: 'bg-red-100 text-red-800',
    color: 'red'
  },
  other: {
    label: 'Other',
    icon: '📁',
    badge: 'bg-gray-100 text-gray-800',
    color: 'gray'
  },
  uncategorized: {
    label: 'Uncategorized',
    icon: '❓',
    badge: 'bg-gray-100 text-gray-600',
    color: 'gray'
  }
};

export function getCategoryMeta(category?: string): CategoryMeta {
  if (!category) {
    return categoryMap.uncategorized;
  }
  
  return categoryMap[category.toLowerCase()] || categoryMap.other;
}

export function getAllCategoryNames(): string[] {
  return Object.keys(categoryMap).filter(key => key !== 'uncategorized');
}

export function getCategoryColor(category?: string): string {
  const meta = getCategoryMeta(category);
  return meta.color;
}