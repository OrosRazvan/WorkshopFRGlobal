import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import { ENDPOINTS } from '../../endpoints/endpoints'
import type { Country, State, City as BackendCity } from '../../types/cities'

type CscCity = {
  name: string
}

export const Cities = () => {
  const apiKey = import.meta.env.VITE_CSC_API_KEY as string | undefined
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined

  const [countries, setCountries] = useState<Country[]>([])
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<CscCity[]>([])
  // managedCities: cities returned by your backend (with id, cityName)
  const [managedCities, setManagedCities] = useState<BackendCity[]>([])
  const [newCityName, setNewCityName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
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

          const defaultCountry = sortedCountries.find((country) => country.iso2 === 'RO') ?? sortedCountries[0]
          setSelectedCountry(defaultCountry?.iso2 ?? '')
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

        const citiesResponse = await axios.get<CscCity[]>(ENDPOINTS.cities(selectedCountry, selectedState), {
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

    // adapt for backend-managed cities (cityName) or CSC cities (name)
    return cities.filter((city: any) => {
      const name = (city.cityName ?? city.name ?? '').toLowerCase()
      return name.includes(value)
    })
  }, [cities, search])

  // --- Backend managed cities handlers ---------------------------------
  async function fetchManagedCities() {
    try {
      if (!backendBaseUrl) {
        setManagedCities([])
        return
      }

      const res = await axios.get<BackendCity[]>(`${backendBaseUrl}/cities`)
      setManagedCities(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      setManagedCities([])
    }
  }

  useEffect(() => {
    fetchManagedCities()
  }, [])

  async function addCity() {
    const name = newCityName.trim()
    if (!name) return
    try {
      if (!backendBaseUrl) {
        setError('Lipseste VITE_API_BASE_URL pentru backend.')
        return
      }

      await axios.post(`${backendBaseUrl}/cities/add`, { name })
      setNewCityName('')
      await fetchManagedCities()
    } catch (e) {
      setError('Eroare la adaugarea orasului.')
    }
  }

  async function deleteCity(id: string) {
    if (!confirm('Esti sigur ca vrei sa stergi orasul?')) return
    try {
      if (!backendBaseUrl) {
        setError('Lipseste VITE_API_BASE_URL pentru backend.')
        return
      }

      await axios.delete(`${backendBaseUrl}/cities/id/${id}`)
      await fetchManagedCities()
    } catch (e) {
      setError('Eroare la stergerea orasului.')
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Lista de orase
      </Typography>

      <Box sx={{ display: 'grid', gap: 2, mb: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <Box>
          <FormControl fullWidth>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tara
            </Typography>
            <Select
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
              size="small"
            >
              {countries.map((country) => (
                <MenuItem key={country.iso2} value={country.iso2}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <FormControl fullWidth>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Stat / Regiune
            </Typography>
            <Select
              value={selectedState}
              onChange={(event) => setSelectedState(event.target.value)}
              disabled={!states.length}
              size="small"
            >
              {states.map((stateItem) => (
                <MenuItem key={stateItem.iso2} value={stateItem.iso2}>
                  {stateItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TextField
        id="city-search"
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Ex: Cluj-Napoca"
        fullWidth
        label="Cauta oras"
        size="small"
        variant="outlined"
        sx={{ mb: 3 }}
      />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!isLoading && !error && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Total orase: <strong>{filteredCities.length}</strong>
          </Typography>

          <Paper variant="outlined">
            <List sx={{ columns: { xs: 1, sm: 2 }, columnGap: 2 }}>
              {filteredCities.map((city) => (
                <ListItem key={(city as any).name ?? (city as any).id} sx={{ breakInside: 'avoid' }}>
                  <ListItemText primary={(city as any).name ?? (city as any).cityName} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}

      {/* Backend-managed cities UI */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Orase gestionate (backend)
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
            label="Nume oras"
            size="small"
            fullWidth
          />
          <Button variant="contained" onClick={addCity} disableElevation>
            Adauga
          </Button>
        </Box>

        <Paper variant="outlined">
          {!backendBaseUrl ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="info">Configureaza <strong>VITE_API_BASE_URL</strong> in <strong>.env</strong> ca sa vezi si sectiunea de backend.</Alert>
            </Box>
          ) : (
            <List>
              {managedCities.map((mc) => (
                <ListItem
                  key={mc.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => deleteCity(mc.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={mc.cityName} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Container>
  )
}


