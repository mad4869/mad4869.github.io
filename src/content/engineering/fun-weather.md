---
title: Fun Weather
description: A simple weather app built using Laravel Breeze, Inertia, and Vue.
date: 2024-06-07
image: ./assets/fun-weather/fun-weather.png
categories: ['Laravel', 'Vue', 'Web Development']
repo: https://github.com/mad4869/fun-weather
---

## Setup

I used Laravel Herd to initialize a new Laravel project with Laravel Breeze and the Inertia+Vue template.

## Weather API

To get weather data, I used free weather API from [WeatherAPI.com](https://www.weatherapi.com) by signing up for a free account and getting an API key.

## Laravel Action

I set up a new Action, `GetWeatherData`, to handle the data fetching process and assigned it to the home route.

```php
class GetWeatherData
{
    use AsAction;

    public function handle(string $location)
    {
        $WEATHER_API_KEY = env('WEATHER_API_KEY');
        $WEATHER_URL = 'http://api.weatherapi.com/v1/current.json';

        $response = Http::get($WEATHER_URL, [
            'key' => $WEATHER_API_KEY,
            'q' => $location,
        ]);

        if ($response->successful()) {
            $weatherData = $response->json();
            return $weatherData;
        } else {
            return null;
        }
    }

    public function asController(Request $request)
    {
        $weatherData = $this->handle(
            $request->input('location', 'London')
        );

        return Inertia::render('Home', [
            'weatherData' => $weatherData,
        ]);
    }
}
```

```php
Route::get('/', GetWeatherData::class)->name('home');
Route::post('/', GetWeatherData::class)->name('home.post');
```

## Vue

After setting up the backend, the next step is to build the UI components using Vue. Here there are two primary features:

1. User can get weather data for their current location after granting permission to access their location.
2. User can get weather data for some other locations by inputting a location into the input field.

### Getting current location's weather data

![Asking permission to access location](./assets/fun-weather/ss%20(2).png)
![Getting weather data after granting permission](./assets/fun-weather/ss%20(3).png)
![Weather details](./assets/fun-weather/ss%20(4).png)

The Geolocation browser API can only be accessed in a secure connection so I disabled a Chrome flag temporarily.

### Getting other location's weather data

![Getting weather data after inputting a location](./assets/fun-weather/ss%20(5).png)
![Weather details](./assets/fun-weather/ss%20(1).png)

## Conclusion

With the backend and frontend components in place, the Fun Weather app is ready to provide users with up-to-date weather information.
