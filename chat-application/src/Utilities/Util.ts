import { USERNAME_COLORS } from "../AppConstants";

export const getLastSeen = time => {
  return calcDate(time);
};
function calcDate(time) {
  var today = new Date();
  var diff = Math.floor(today.getTime() - time);
  var sec = Math.floor(diff / 1000);
  var min = Math.floor(sec / 60);
  var hour = Math.floor(min / 60);
  var days = Math.floor(hour / 24);
  var months = Math.floor(days / 31);
  var years = Math.floor(months / 12);
  if (years > 1) {
    return years + " YRS";
  }
  if (months > 1) {
    return months + " MNS";
  }
  if (days > 1) {
    return days + " DYS";
  }
  if (hour > 1) {
    return hour + " HRS";
  }
  if (min > 1) {
    return min + " MIN";
  }
  if (min <= 1) {
    return "1 MIN";
  }
  return null;
}

export const isValidEmail = (email: string | null) => {
  if (email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
  }
  return false;
};

export const fromatTimeStamp = time => {
  console.log(time);
  var date: Date = new Date(time);
  console.log(date);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? 0 + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export const getRandomColor = () => {
  var color =
    USERNAME_COLORS[(Math.random() * 1000000) % USERNAME_COLORS.length];
  return color;
};
