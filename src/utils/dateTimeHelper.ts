// format the time:
export const getTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return `Updated just now`
  if (seconds < 3600) return `Updated ${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `Updated ${Math.floor(seconds / 3600)} hrs ago`
  return `Updated on ${date.toLocaleDateString()}`
}
