import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { db } from '../index'
import { addDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore'
import '../css/SearchResultsPage.css'
import Pagination from '../components/Pagination'
import AddToMealplanPopUp from '../components/AddToMealplanPopUp'
import SearchResult from '../components/SearchResult'

export default function SearchResultsPage({ user, loading }) {
  const [results, setResults] = useState([])
  const [recipeAdded, setRecipeAdded] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingResults, setLoadingResults] = useState(true)
  const [diplayResults, setDisplayResults] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const resultsPerPage = 12

  const [params] = useSearchParams()
  const navigate = useNavigate()
  const search = [...params].map((pair) => pair[1]).join(' & ')

  useEffect(() => {
    setLoadingResults(true)
    const queryString = [...params].reduce((query, [key, value]) => {
      return query + `&${key}=${value}`
    }, '')

    fetch(
      `https://api.edamam.com/search?app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}${queryString}&from=0&to=100`,
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res.hits)
        setLoadingResults(false)
      })
  }, [params])

  const recipeCollectionsRef = collection(db, 'recipes')
  const handleAddRec = async (id, { recipe }, index) => {
    if (!user) navigate('/login')
    setSelectedIndex(index)
    try {
      const docReference = await addDoc(recipeCollectionsRef, {
        name: recipe.label,
        edamam_id: id,
        image: recipe.image,
        user_id: user.uid,
        createdAt: serverTimestamp(),
      })
      const returnedRecipe = await getDoc(docReference)
      setSelectedRecipe({
        ...returnedRecipe.data(),
        id: returnedRecipe.id,
      })
    } catch (err) {
      console.log(err)
    }
    setRecipeAdded(true)
  }
  // get current displayed posts
  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult)
  // change page
  const paginate = (pageNumber, event) => {
    event.preventDefault()
    setCurrentPage(pageNumber)
  }

  const handleDisplay = () => {
    setDisplayResults(!diplayResults)
  }

  return (
    <section className="results-section">
      <header>
        <h1>Search Results for &quot;{search}&quot;</h1>
        <div>
          <button className="toggle-mode-btn" onClick={handleDisplay}>
            {diplayResults ? 'Display as List' : 'Display as Tiles'}
          </button>
        </div>
      </header>
      {loadingResults ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {results.length !== 0 ? (
            <>
              <ul className={diplayResults ? 'display-tile' : 'display-list'}>
                {currentResults.map((result, index) => {
                  const uri = result.recipe.uri
                  const id = uri.substring(uri.indexOf('_') + 1, uri.length)
                  return (
                    <SearchResult
                      key={index}
                      id={id}
                      result={result}
                      index={index}
                      recipeAdded={recipeAdded}
                      selectedIndex={selectedIndex}
                      handleAddRec={handleAddRec}
                      setShowAdd={setShowAdd}
                    />
                  )
                })}
              </ul>
              <AddToMealplanPopUp
                selectedRecipe={selectedRecipe}
                user={user}
                showAdd={showAdd}
                setShowAdd={setShowAdd}
              />
              <Pagination
                resultsPerPage={resultsPerPage}
                totalResults={results.length}
                paginate={paginate}
              />
            </>
          ) : (
            <p>no results</p>
          )}
        </>
      )}
    </section>
  )
}
