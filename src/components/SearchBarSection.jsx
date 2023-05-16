import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dietaryRequirements, cuisines, mealType } from '../data'

export default function SearchBarSection() {
  const [searchInput, setSearchInput] = useState({})
  const navigate = useNavigate()

  const handleName = ({ target }) => {
    setSearchInput({ ...searchInput, [target.name]: target.value })
  }
  const handleFilter = ({ target }) => {
    setSearchInput({ ...searchInput, [target.name]: target.value })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    const queryString =
      '?' +
      Object.entries(searchInput)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    navigate(`/search${queryString}`)
  }

  const disabled = !searchInput.q || searchInput.q?.length === 0

  return (
    <section className="search-bar-section">
      <h1 className="search-bar-title">Find a recipe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            onChange={handleName}
            value={searchInput?.q}
            className="input-box"
            name="q"
            placeholder="Search by recipe, ingredient or keyword"
          />
        </div>
        <section className="filters">
          <p className="filters-label">Filters: </p>
          <div>
            <select
              id="health"
              onChange={handleFilter}
              name="health"
              className="filter"
            >
              <option value="">Dietary requirements</option>
              {dietaryRequirements.map((exclusion, index) => (
                <option key={index} value={exclusion.toLowerCase()}>
                  {exclusion}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              id="cuisineType"
              onChange={handleFilter}
              name="cuisineType"
              className="filter"
            >
              <option value="">Cuisine</option>
              {cuisines.map((cuisine, index) => (
                <option key={index} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              id="mealType"
              name="mealType"
              onChange={handleFilter}
              className="filter"
            >
              <option value="">Meal type</option>
              {mealType.map((meal, index) => (
                <option key={index} value={meal}>
                  {meal}
                </option>
              ))}
            </select>
          </div>
        </section>
        <button className="btn-submit" disabled={disabled}>
          Search
        </button>
      </form>
    </section>
  )
}
