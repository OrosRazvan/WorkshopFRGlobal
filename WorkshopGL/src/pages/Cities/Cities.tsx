import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
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
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import FlightIcon from '@mui/icons-material/Flight'
import BusinessIcon from '@mui/icons-material/Business'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

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

    return cities.filter((city) => city.name.toLowerCase().includes(value))
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
    

      <Box sx={{ flex: 1, px: { xs: 2, md: 6 }, py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 3.5 }}>
          <Box>
            <Typography sx={{ color: '#1D3E98', fontWeight: 800, fontSize: { xs: 34, md: 56 }, lineHeight: 1.05 }}>
              Cities Management
            </Typography>
            <Typography sx={{ color: '#5c6470', mt: 1 }}>Browse and manage available cities</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addCity}
            sx={{
              minWidth: 176,
              height: 46,
              fontWeight: 700,
              bgcolor: '#1D3E98',
              borderRadius: 2,
              boxShadow: '0 8px 16px rgba(29, 62, 152, 0.28)',
              '&:hover': { bgcolor: '#15337f' },
            }}
          >
            Add New City
          </Button>
        </Box>

        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            boxShadow: '0 10px 28px rgba(18, 28, 46, 0.09)',
            border: '1px solid #dfe5ef',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto' }, gap: 2 }}>
            <TextField
              id="city-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search flights, cities, or city names..."
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              startIcon={<FilterAltIcon />}
              sx={{
                height: 40,
                px: 3,
                fontWeight: 700,
                bgcolor: '#1D3E98',
                '&:hover': { bgcolor: '#15337f' },
              }}
            >
              Filters
            </Button>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
            }}
          >
            <FormControl fullWidth size="small">
              <Select value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)} displayEmpty>
                <MenuItem value="" disabled>
                  Select country
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <Select
                value={selectedState}
                onChange={(event) => setSelectedState(event.target.value)}
                disabled={!states.length}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select state / region
                </MenuItem>
                {states.map((stateItem) => (
                  <MenuItem key={stateItem.iso2} value={stateItem.iso2}>
                    {stateItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="New city name"
              size="small"
              fullWidth
            />
          </Box>
        </Paper>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 7 }}>
            <CircularProgress size={46} sx={{ color: '#2c75d2' }} />
          </Box>
        )}

        {!isLoading && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!isLoading && !error && (
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
            <Paper sx={{ borderRadius: 3, border: '1px solid #dfe5ef', overflow: 'hidden' }}>
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e7edf7', bgcolor: '#f8faff' }}>
                <Typography sx={{ fontWeight: 700, color: '#1D3E98' }}>CSC Cities ({filteredCities.length})</Typography>
              </Box>
              <List sx={{ maxHeight: 390, overflow: 'auto' }}>
                {filteredCities.map((city) => (
                  <ListItem key={city.name}>
                    <ListItemText primary={city.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper sx={{ borderRadius: 3, border: '1px solid #dfe5ef', overflow: 'hidden' }}>
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e7edf7', bgcolor: '#f8faff' }}>
                <Typography sx={{ fontWeight: 700, color: '#1D3E98' }}>Backend Cities ({managedCities.length})</Typography>
              </Box>

              {!backendBaseUrl ? (
                <Box sx={{ p: 2 }}>
                  <Alert severity="info">Seteaza <strong>VITE_API_BASE_URL</strong> in <strong>.env</strong> pentru aceasta sectiune.</Alert>
                </Box>
              ) : (
                <List sx={{ maxHeight: 390, overflow: 'auto' }}>
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
        )}
      </Box>
    
  )
}


