const MINUTE = 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  WEEK = DAY * 7,
  MONTH = DAY * 30,
  YEAR = DAY * 365;

function getTimeAgo(date) {
  const secondsAgo = Math.round((+new Date() - date) / 1000);
  let divisor = null;
  let unit = null;

  if (secondsAgo < MINUTE) {
    return secondsAgo + " seconds ago";
  } else if (secondsAgo < HOUR) {
    [divisor, unit] = [MINUTE, "minute"];
  } else if (secondsAgo < DAY) {
    [divisor, unit] = [HOUR, "hour"];
  } else if (secondsAgo < WEEK) {
    [divisor, unit] = [DAY, "day"];
  } else if (secondsAgo < MONTH) {
    [divisor, unit] = [WEEK, "week"];
  } else if (secondsAgo < YEAR) {
    [divisor, unit] = [MONTH, "month"];
  } else if (secondsAgo > YEAR) {
    [divisor, unit] = [YEAR, "year"];
  }

  const count = Math.floor(secondsAgo / divisor);
  return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
}

export default class TimeAgoSpanElement extends HTMLSpanElement {
  static get observedAttributes() {
    return ["date"];
  }
  connectedCallback() {
    this.innerHTML = getTimeAgo(new Date(this.getAttribute("date")));
  }
}

/**
 * Create a custom element which will take any date and show long ago it was.
 * Usage in HTML:
 *     <span is="time-ago" date="valid Date string"/>
 * `date` is a Javascript Date string that will be passed into new Date(text)
 */
customElements.define("time-ago", TimeAgoSpanElement, { extends: "span" });
