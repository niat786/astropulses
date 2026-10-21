import type { GeoPlace } from './geocode'

type CityCoord = {
  keys: string[]
  name: string
  latitude: number
  longitude: number
  timezone: string
  country: string
  admin1?: string
}

const OFFLINE_CITIES: CityCoord[] = [
  { keys: ['karachi', 'karachi, pakistan', 'pakistan'], name: 'Karachi, Sindh, Pakistan', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi', country: 'Pakistan', admin1: 'Sindh' },
  { keys: ['lahore', 'lahore, pakistan'], name: 'Lahore, Punjab, Pakistan', latitude: 31.5204, longitude: 74.3587, timezone: 'Asia/Karachi', country: 'Pakistan', admin1: 'Punjab' },
  { keys: ['islamabad', 'islamabad, pakistan'], name: 'Islamabad, Pakistan', latitude: 33.6844, longitude: 73.0479, timezone: 'Asia/Karachi', country: 'Pakistan' },
  { keys: ['london', 'london, uk', 'london, united kingdom', 'uk'], name: 'London, England, United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', country: 'United Kingdom', admin1: 'England' },
  { keys: ['new york', 'new york, usa', 'new york, ny', 'nyc', 'usa', 'united states'], name: 'New York, New York, United States', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York', country: 'United States', admin1: 'New York' },
  { keys: ['los angeles', 'los angeles, usa', 'la', 'california'], name: 'Los Angeles, California, United States', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles', country: 'United States', admin1: 'California' },
  { keys: ['chicago', 'chicago, usa'], name: 'Chicago, Illinois, United States', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago', country: 'United States', admin1: 'Illinois' },
  { keys: ['toronto', 'toronto, canada', 'canada'], name: 'Toronto, Ontario, Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto', country: 'Canada', admin1: 'Ontario' },
  { keys: ['vancouver', 'vancouver, canada'], name: 'Vancouver, British Columbia, Canada', latitude: 49.2827, longitude: -123.1207, timezone: 'America/Vancouver', country: 'Canada', admin1: 'British Columbia' },
  { keys: ['sydney', 'sydney, australia', 'australia'], name: 'Sydney, New South Wales, Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', country: 'Australia', admin1: 'New South Wales' },
  { keys: ['melbourne', 'melbourne, australia'], name: 'Melbourne, Victoria, Australia', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne', country: 'Australia', admin1: 'Victoria' },
  { keys: ['mumbai', 'mumbai, india', 'bombay', 'india'], name: 'Mumbai, Maharashtra, India', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata', country: 'India', admin1: 'Maharashtra' },
  { keys: ['delhi', 'new delhi', 'new delhi, india', 'delhi, india'], name: 'New Delhi, Delhi, India', latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata', country: 'India', admin1: 'Delhi' },
  { keys: ['bangalore', 'bengaluru', 'bengaluru, india'], name: 'Bengaluru, Karnataka, India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', country: 'India', admin1: 'Karnataka' },
  { keys: ['dubai', 'dubai, uae', 'uae'], name: 'Dubai, United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', country: 'United Arab Emirates' },
  { keys: ['paris', 'paris, france', 'france'], name: 'Paris, Île-de-France, France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', country: 'France', admin1: 'Île-de-France' },
  { keys: ['berlin', 'berlin, germany', 'germany'], name: 'Berlin, Germany', latitude: 52.52, longitude: 13.405, timezone: 'Europe/Berlin', country: 'Germany' },
  { keys: ['madrid', 'madrid, spain', 'spain'], name: 'Madrid, Spain', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid', country: 'Spain' },
  { keys: ['rome', 'rome, italy', 'italy'], name: 'Rome, Lazio, Italy', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome', country: 'Italy', admin1: 'Lazio' },
  { keys: ['tokyo', 'tokyo, japan', 'japan'], name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', country: 'Japan' },
  { keys: ['singapore'], name: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore', country: 'Singapore' },
  { keys: ['seoul', 'seoul, south korea'], name: 'Seoul, South Korea', latitude: 37.5665, longitude: 126.978, timezone: 'Asia/Seoul', country: 'South Korea' },
  { keys: ['beijing', 'beijing, china', 'china'], name: 'Beijing, China', latitude: 39.9042, longitude: 116.4074, timezone: 'Asia/Shanghai', country: 'China' },
  { keys: ['hong kong'], name: 'Hong Kong', latitude: 22.3193, longitude: 114.1694, timezone: 'Asia/Hong_Kong', country: 'Hong Kong' },
  { keys: ['istanbul', 'istanbul, turkey', 'turkey'], name: 'Istanbul, Türkiye', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul', country: 'Türkiye' },
  { keys: ['cairo', 'cairo, egypt', 'egypt'], name: 'Cairo, Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo', country: 'Egypt' },
  { keys: ['lagos', 'lagos, nigeria', 'nigeria'], name: 'Lagos, Nigeria', latitude: 6.5244, longitude: 3.3792, timezone: 'Africa/Lagos', country: 'Nigeria' },
  { keys: ['johannesburg', 'south africa'], name: 'Johannesburg, South Africa', latitude: -26.2041, longitude: 28.0473, timezone: 'Africa/Johannesburg', country: 'South Africa' },
  { keys: ['sao paulo', 'são paulo', 'brazil'], name: 'São Paulo, Brazil', latitude: -23.5505, longitude: -46.6333, timezone: 'America/Sao_Paulo', country: 'Brazil' },
  { keys: ['mexico city', 'mexico'], name: 'Mexico City, Mexico', latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City', country: 'Mexico' },
  { keys: ['buenos aires', 'argentina'], name: 'Buenos Aires, Argentina', latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina' },
]

export function lookupOfflineCity(query: string): GeoPlace | null {
  const norm = query.trim().toLowerCase()
  for (const city of OFFLINE_CITIES) {
    if (city.keys.some((k) => norm === k || norm.startsWith(k + ',') || norm.includes(k))) {
      return {
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
        country: city.country,
        admin1: city.admin1,
      }
    }
  }
  return null
}

export const WORLD_MAJOR_CITIES = OFFLINE_CITIES.map((c) => ({
  name: c.name,
  latitude: c.latitude,
  longitude: c.longitude,
  timezone: c.timezone,
  country: c.country,
}))
