import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import { ENDPOINTS } from '../../endpoints/endpoints'

type Country = {
  iso2: string
  name: string
}

type State = {
  iso2: string
  name: string
}

type City = {
  name: string
}

export const Cities = () => {
  const apiKey = import.meta.env.VITE_CSC_API_KEY as string | undefined

  const [countries, setCountries] = useState<Country[]>([])
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedCountry, setSelectedCountry] = useState('RO')
  const [selectedState, setSelectedState] = useState('')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function fetchCountries() {
      if (!apiKey) {
        setError('Lipseste cheia API. Adauga VITE_CSC_API_KEY in fisierul .env')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')

        const countriesResponse = await axios.get<Country[]>(ENDPOINTS.countries, {
          headers: {
            'X-CSCAPI-KEY': apiKey,
          },
        })

        if (!ignore) {
          const sortedCountries = [...countriesResponse.data].sort((a, b) =>
            a.name.localeCompare(b.name),
          )

          setCountries(sortedCountries)

          const hasDefaultCountry = sortedCountries.some((country) => country.iso2 === 'RO')
          if (!hasDefaultCountry && sortedCountries.length > 0) {
            setSelectedCountry(sortedCountries[0].iso2)
          }
        }
      } catch {
        if (!ignore) {
          setError('Nu am putut incarca lista de tari. Verifica cheia API.')
          setCities([])
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    fetchCountries()

    return () => {
      ignore = true
    }
  }, [apiKey])

  useEffect(() => {
    let ignore = false

    async function fetchStatesForCountry() {
      if (!apiKey || !selectedCountry) {
        setStates([])
        setSelectedState('')
        return
      }

      try {
        setIsLoading(true)
        setError('')

        const statesResponse = await axios.get<State[]>(ENDPOINTS.states(selectedCountry), {
          headers: {
            'X-CSCAPI-KEY': apiKey,
          },
        })

        if (!ignore) {
          const sortedStates = [...statesResponse.data].sort((a, b) => a.name.localeCompare(b.name))
          setStates(sortedStates)
          setSelectedState(sortedStates[0]?.iso2 ?? '')
        }
      } catch {
        if (!ignore) {
          setError('Nu am putut incarca statele pentru tara selectata.')
          setStates([])
          setSelectedState('')
          setCities([])
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    fetchStatesForCountry()

    return () => {
      ignore = true
    }
  }, [apiKey, selectedCountry])

  useEffect(() => {
    let ignore = false

    async function fetchCitiesForState() {
      if (!apiKey || !selectedCountry || !selectedState) {
        setCities([])
        return
      }

      try {
        setIsLoading(true)
        setError('')

        const citiesResponse = await axios.get<City[]>(ENDPOINTS.cities(selectedCountry, selectedState), {
          headers: {
            'X-CSCAPI-KEY': apiKey,
          },
        })

        if (!ignore) {
          const sortedCities = [...citiesResponse.data].sort((a, b) => a.name.localeCompare(b.name))
          setCities(sortedCities)
        }
      } catch {
        if (!ignore) {
          setError('Nu am putut incarca orasele pentru statul selectat.')
          setCities([])
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    fetchCitiesForState()

    return () => {
      ignore = true
    }
  }, [apiKey, selectedCountry, selectedState])

  const filteredCities = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) {
      return cities
    }

    return cities.filter((city) => city.name.toLowerCase().includes(value))
  }, [cities, search])

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginTop: 0 }}>Lista de orase</h1>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <label>
          Tara
          <select
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
            style={{ width: '100%', padding: '0.55rem', marginTop: '0.35rem' }}
          >
            {countries.map((country) => (
              <option key={country.iso2} value={country.iso2}>
                {country.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Stat / Regiune
          <select
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value)}
            disabled={!states.length}
            style={{ width: '100%', padding: '0.55rem', marginTop: '0.35rem' }}
          >
            {states.map((stateItem) => (
              <option key={stateItem.iso2} value={stateItem.iso2}>
                {stateItem.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label htmlFor="city-search" style={{ display: 'block', marginBottom: '0.5rem' }}>
        Cauta oras
      </label>
      <input
        id="city-search"
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Ex: Cluj-Napoca"
        style={{
          width: '100%',
          padding: '0.65rem 0.75rem',
          borderRadius: 8,
          border: '1px solid #c7c7c7',
          marginBottom: '1rem',
          boxSizing: 'border-box',
        }}
      />

      {isLoading && <p>Se incarca orasele...</p>}
      {!isLoading && error && <p style={{ color: '#b00020' }}>{error}</p>}

      {!isLoading && !error && (
        <>
          <p style={{ marginTop: 0 }}>
            Total orase: <strong>{filteredCities.length}</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', columns: 2 }}>
            {filteredCities.map((city) => (
              <li key={city.name} style={{ marginBottom: '0.35rem' }}>
                {city.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}


