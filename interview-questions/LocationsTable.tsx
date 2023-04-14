import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// https://www.youtube.com/watch?v=6s0OVdoo4Q4
// 45 min
// Create a table that can sort columns and search for values
// https://randomuser.me/api/?results=20
// Show location, flat table

const fetchPeople = () => 
  fetch("https://randomuser.me/api/?results=20");

const flatten = (o: Record<string, any>): Record<string, any> => 
  Object.entries(o).reduce((flattened, [key, value]) => {
    if (typeof value === typeof Object.create(null))
      return { ...flattened, ...flatten(value) }

    return { ...flattened, [key]: value }
  }, Object.create(null));

const getLocation = (person: Record<string, any>) =>
  person.location;

const lexicographicSort = (key: string) => (type: "ascending" | "descending", items: Record<string, any>[]) => {
  if (type === "ascending") {
    return items.sort((a, b) => String(a[key]).localeCompare(String(b[key])));
  } else {
    return items.sort((a, b) => String(b[key]).localeCompare(String(a[key])));
  }
}

function App() {
  const [locations, setLocations] = useState<Record<string, any>[] | null>(null);

  useEffect(() => {
    const createLocationsTable = async () => {
      const response = await fetchPeople();
      const people = await response.json();

      const table = people.results.map(getLocation).map(flatten);

      return table;
    }

    createLocationsTable().then(setLocations)
  }, []);

  const sort = (key: string) => () => {
    const sorter = lexicographicSort(key);

    setLocations([...sorter("ascending", locations ?? [])]);
  }

  const sortByCity = sort("city");
  const sortByCountry = sort("country");
  const sortByDescription = sort("description");
  const sortByLatitude = sort("latitude");
  const sortByLongitude = sort("longitude");
  const sortByName = sort("name");
  const sortByNumber = sort("number");
  const sortByOffset = sort("offset");
  const sortByPostcode = sort("postcode");
  const sortByState = sort("state");

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>
              <button onClick={sortByCity as any}>
                City
              </button>
            </th>
            <th>
              <button onClick={sortByCountry as any}>
                Country
              </button>
            </th>
            <th>
              <button onClick={sortByDescription as any}>
                Description
              </button>
            </th>
            <th>
              <button onClick={sortByLatitude as any}>
                Latitude
              </button>
            </th>
            <th>
              <button onClick={sortByLongitude as any}>
                Longitude
              </button>
            </th>
            <th>
              <button onClick={sortByName as any}>
                Name
              </button>
            </th>
            <th>
              <button onClick={sortByNumber as any}>
                Street Number
              </button>
            </th>
            <th>
              <button onClick={sortByOffset as any}>
                Offset
              </button>
            </th>
            <th>
              <button onClick={sortByPostcode as any}>
                Postcode
              </button>
            </th>
            <th>
              <button onClick={sortByState as any}>
                State
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {locations?.map((location: Record<string, any>, idx: number) => (
            <tr key={idx}>
              <td>{location.city}</td>
              <td>{location.country}</td>
              <td>{location.description}</td>
              <td>{location.latitude}</td>
              <td>{location.longitude}</td>
              <td>{location.name}</td>
              <td>{location.number}</td>
              <td>{location.offset}</td>
              <td>{location.postcode}</td>
              <td>{location.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
