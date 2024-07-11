const loggedPrayers = {};

function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const currentDateTimeMilady = now.toLocaleString("en-US", options);
  document.querySelector("#dateTimeMilady").textContent = currentDateTimeMilady;

  const currentDateTimeHijri = now.toLocaleString("en-SA", options);
  document.querySelector("#dateTimeHijry").textContent = currentDateTimeHijri;

  const playSound = function () {
    const sound = new Audio("azanIslam.mp3");
    sound.play();
  };

  const prayerTimesList = document.getElementById("prayer-times");
  const items = prayerTimesList.querySelectorAll(".prayer-time-box");
  items.forEach((item) => {
    const time = item.getAttribute("data-time");
    const prayer = item.getAttribute("data-prayer");
    const timeDifference = calculateTimeDifference(time, prayer);
    const differenceSpan = item.querySelector(".time-difference");
    differenceSpan.textContent = timeDifference.message;

    if (
      timeDifference.isPrayerTime &&
      !loggedPrayers[prayer] &&
      prayer !== "Sunrise"
    ) {
      console.log(`It is time for the ${prayer} prayer`);
      loggedPrayers[prayer] = true;
      playSound();
    }
  });
}

function calculateTimeDifference(prayerTime, prayer) {
  const now = new Date();
  const [hours, minutes] = prayerTime.split(":").map(Number);
  const prayerDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );

  const difference = prayerDate - now;

  if (difference <= 0 && difference > -60000) {
    return { message: `Time for ${prayer}`, isPrayerTime: true };
  } else if (prayerDate < now) {
    return { message: "Time has passed", isPrayerTime: false };
  }

  const diffHours = Math.floor(difference / (1000 * 60 * 60));
  const diffMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  return {
    message: `${diffHours}h ${diffMinutes}m left`,
    isPrayerTime: false,
  };
}

function formatTimeTo12Hour(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

fetch("prayer_times.json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById(
      "location"
    ).innerText = `Prayer Times for ${data.city}, ${data.country}`;

    const prayerTimesList = document.getElementById("prayer-times");
    for (const [prayer, time] of Object.entries(data.prayer_times)) {
      const formattedTime = formatTimeTo12Hour(time);

      const prayerBox = document.createElement("div");
      prayerBox.className = "prayer-time-box";
      prayerBox.setAttribute("data-time", time);
      prayerBox.setAttribute("data-prayer", prayer);

      const prayerName = document.createElement("div");
      prayerName.className = "prayer-name";
      prayerName.textContent = prayer;

      const prayerTime = document.createElement("div");
      prayerTime.className = "prayer-time";
      prayerTime.textContent = formattedTime;

      const differenceSpan = document.createElement("span");
      differenceSpan.className = "time-difference";
      differenceSpan.textContent = calculateTimeDifference(
        time,
        prayer
      ).message;

      prayerBox.appendChild(prayerName);
      prayerBox.appendChild(prayerTime);
      prayerBox.appendChild(differenceSpan);
      prayerTimesList.appendChild(prayerBox);
    }
  })
  .catch((error) => console.error("Error fetching prayer times:", error));

setInterval(updateDateTime, 1000);
