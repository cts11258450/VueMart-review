export const formatDate = (dateString) => {
  if (!dateString) {
    return "未提供時間"
  }

  const date = new Date(dateString)

  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}