import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${String(minutes).padStart(2, '0')} ${period}`
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function daysUntil(deadline: string | Date): number {
  const now = new Date()
  const dl = new Date(deadline)
  return Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'text-red-600 bg-red-50 border-red-200'
    case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'low': return 'text-green-600 bg-green-50 border-green-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50 border-green-200'
    case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'overdue': return 'text-red-600 bg-red-50 border-red-200'
    case 'not_started': return 'text-gray-500 bg-gray-50 border-gray-200'
    default: return 'text-gray-500 bg-gray-50 border-gray-200'
  }
}

export function getDifficultyLabel(difficulty: string): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
