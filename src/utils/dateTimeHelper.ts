// format the time:
export const getTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  // Just now (less than 60 seconds)
  if (seconds < 60) return `Updated just now`

  // Minutes (less than 60 minutes)
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `Updated ${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`
  }

  // Hours (less than 24 hours)
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    return `Updated ${hours} ${hours === 1 ? 'hr' : 'hrs'} ago`
  }

  // Days (less than 7 days)
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400)
    return `Updated ${days} ${days === 1 ? 'day' : 'days'} ago`
  }

  // Format date for older updates
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return `Updated on ${date.toLocaleDateString(undefined, options)}`
}
