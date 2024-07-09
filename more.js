 function updateDateTime() {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const currentDateTime = now.toLocaleString('en-US', options);
      document.querySelector('#datetime').textContent = currentDateTime;

      const playSound = function () {
        const sound = new Audio('azanIslam.mp3');
        sound.play();
      };

      const prayerTimesList = document.getElementById('prayer-times');
      const items = prayerTimesList.querySelectorAll('li');
      items.forEach(item => {
        const time = item.getAttribute('data-time');
        const prayer = item.getAttribute('data-prayer');
        const timeDifference = calculateTimeDifference(time);
        const differenceSpan = item.querySelector('.time-difference');
        differenceSpan.textContent = timeDifference.message;

        if (timeDifference.isPrayerTime && !loggedPrayers[prayer] && prayer !== 'Sunrise') {
          console.log(`It is time for the ${prayer} prayer`);
          loggedPrayers[prayer] = true;
          playSound();
        }
      });

      // Reset loggedPrayers at midnight
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        Object.keys(loggedPrayers).forEach(prayer => loggedPrayers[prayer] = false);
      }
    }