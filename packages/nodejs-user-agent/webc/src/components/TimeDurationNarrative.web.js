export default class TimeDurationSpanElement extends HTMLSpanElement {
  static MINUTE = 60;
  static HOUR = TimeDurationSpanElement.MINUTE * 60;
  static DAY = TimeDurationSpanElement.HOUR * 24;
  static WEEK = TimeDurationSpanElement.DAY * 7;
  static MONTH = TimeDurationSpanElement.DAY * 30;
  static YEAR = TimeDurationSpanElement.DAY * 365;

  static durationNarrative = (start, end) => {
    const secondsAgo = Math.round((end - start) / 1000);
    let divisor = null;
    let unit = null;

    if (secondsAgo < TimeDurationSpanElement.MINUTE) {
      return secondsAgo + " seconds";
    } else if (secondsAgo < TimeDurationSpanElement.HOUR) {
      [divisor, unit] = [TimeDurationSpanElement.MINUTE, "minute"];
    } else if (secondsAgo < TimeDurationSpanElement.DAY) {
      [divisor, unit] = [TimeDurationSpanElement.HOUR, "hour"];
    } else if (secondsAgo < TimeDurationSpanElement.WEEK) {
      [divisor, unit] = [TimeDurationSpanElement.DAY, "day"];
    } else if (secondsAgo < TimeDurationSpanElement.MONTH) {
      [divisor, unit] = [TimeDurationSpanElement.WEEK, "week"];
    } else if (secondsAgo < TimeDurationSpanElement.YEAR) {
      [divisor, unit] = [TimeDurationSpanElement.MONTH, "month"];
    } else if (secondsAgo > TimeDurationSpanElement.YEAR) {
      [divisor, unit] = [TimeDurationSpanElement.YEAR, "year"];
    }

    const count = Math.floor(secondsAgo / divisor);
    return `${count} ${unit}${count > 1 ? "s" : ""}`;
  };

  static get observedAttributes() {
    return ["start", "finish"];
  }

  connectedCallback() {
    this.innerHTML = TimeDurationSpanElement.durationNarrative(
      new Date(this.getAttribute("start")),
      new Date(this.getAttribute("finish")),
    );
  }
}

/**
 * Create a custom element which will take any date and show long ago it was.
 * Usage in HTML:
 *     <span is="time-duration" start="valid Date string" finish="valid Date string"/>
 * `start` and `finish` are Javascript Date strings that will be passed into new Date(text)
 */
customElements.define("time-duration", TimeDurationSpanElement, {
  extends: "span",
});
