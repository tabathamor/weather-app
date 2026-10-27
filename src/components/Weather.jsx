import { useState } from 'react'
import './Weather.css'

export default function Weather() {
    const [city, setCity] = useState('')
    const [error, setError] = useState(null)
    const [foundCity, setFoundCity] = useState(null)
    const [foundWeather, setFoundWeather] = useState(null)


    const handleSearch = () => {

        setFoundCity(null)
        setFoundWeather(null)
        setError(null)
        if (!city.trim()) return


        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
            .then((res) => {
                if (!res.ok) throw new Error("Request Fail")
                return res.json()
            })
            .then((data) => {
                if (!data.results) throw new Error('City not found')
                const place = data.results[0]
                console.log(place)
                setFoundCity(place)
                return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true`)
            })
            .then((res) => res.json())
            .then((weather) => setFoundWeather(weather.current_weather))
            .catch((error) => setError(error.message))
    }

    return (
        <main className="container">
            <h1>Weather</h1>
            <input className="search-row"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Type a city..."
            />
            <button onClick={handleSearch}>Search</button>
            {error && <p>{error}</p>}

            {foundWeather && (
                <article>
                    <h2>{foundCity.name}</h2>
                    <h3>{foundCity.country}</h3>
                    <h3>{foundCity.admin1}</h3>
                    <p>🌡️ Temperature: {foundWeather.temperature} °C</p>
                    <p>💨 Wind: {foundWeather.windspeed} km/h</p>
                </article>

            )
            }
        </main>
    )
}