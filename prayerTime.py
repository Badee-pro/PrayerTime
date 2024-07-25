import requests
import json
import schedule
import time



def get_prayer_times(country, city):
    url = "http://api.aladhan.com/v1/timingsByCity"
    params = {
        "country": country,
        "city": city,
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        
        timings = data['data']['timings']
        required_prayers = {prayer: timings[prayer] for prayer in ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']}
        
        result = {
            "country": country,
            "city": city,
            "prayer_times": required_prayers
        }

        with open("prayer_times.json", "w") as file:
            json.dump(result, file)
        # print(required_prayers)
        print("Prayer times have been written to prayer_times.json")
    else:
        print(f"Failed to retrieve data: {response.status_code}")

userCountry = input("Enter the country: ")
userCity = input("Enter the city: ")

get_prayer_times(userCountry, userCity)

# Schedule the job to run at midnight
schedule.every().day.at("00:00").do(get_prayer_times, country=userCountry, city=userCity)

while True:
    schedule.run_pending()
    time.sleep(1)
