function getDateTimeObject(dateString, timeString) {
  const [hourMin, ampm] = timeString.split(" ");
  let [hours, min] = hourMin.split(":").map(Number);
  if (ampm.toLowerCase() == "pm" && hours !== 12) {
    hours += 12;
  }
  if (ampm.toLowerCase() == "am" && hours === 12) {
    hours = 0;
  }

  const date = new Date(dateString);
  date.setHours(hours);
  date.setMinutes(min);
  return date;
}
module.exports = {getDateTimeObject}