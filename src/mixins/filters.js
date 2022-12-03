const filters = {
  filters: {
    formatTime(timeStamp) {
      const date = new Date(timeStamp * 1000)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
  }
}

export default filters
