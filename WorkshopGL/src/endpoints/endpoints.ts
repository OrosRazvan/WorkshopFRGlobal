const API_BASE_URL = 'https://api.countrystatecity.in/v1'

export const ENDPOINTS = {
	countries: `${API_BASE_URL}/countries`,
	states: (countryIso2: string) => `${API_BASE_URL}/countries/${countryIso2}/states`,
	cities: (countryIso2: string, stateIso2: string) =>
		`${API_BASE_URL}/countries/${countryIso2}/states/${stateIso2}/cities`,
}
