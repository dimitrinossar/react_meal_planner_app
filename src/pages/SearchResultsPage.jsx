import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../index'
import { addDoc, collection } from 'firebase/firestore'
import Pagination from '../components/Pagination'
import '../css/SearchResultsPage.css'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

export default function SearchResultsPage() {
  const [results, setResults] = useState([])
  const [recipeAdded, setRecipeAdded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [diplayResults, setDisplayResults] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [show, setShow] = useState(false)
  const [mealPlans, setMealPlans] = useState(null)
  const [newMealPlan, setNewMealPlan] = useState(null)
  const { keyword } = useParams()
  useEffect(() => {
    setLoading(true)
    fetch(
      `https://api.edamam.com/search?q=${keyword}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}&from=0&to=100`,
    )
      .then((res) => res.json())
      .then((res) => {
        setResults(res.hits)
        setLoading(false)
      })
  }, [keyword])

  const recipeCollectionsRef = collection(db, 'recipes')

  const handleClose = () => setShow(false)
  const handleAddRec = async (id, { recipe }, index) => {
    setShow(true)
    setSelectedIndex(index)
    try {
      await addDoc(recipeCollectionsRef, {
        name: recipe.label,
        edamam_id: id,
        image: recipe.image,
        user_id: 1, // hardcoded user id for now
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
  const handleAddtoMealPlan = () => {} // function to add the recipe to the meal plan
  const handleAddNewMealPlan = () => {} // function to add the new meal plan and the recipe to the database }

  return (
    <section className="results-section">
      <header>
        <h1>Search Results :</h1>
        <div>
          <button className="list" onClick={handleDisplay}>
            {diplayResults ? 'Title' : 'List'}
          </button>
        </div>
      </header>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          <ul className={diplayResults ? 'display-list' : 'display-title'}>
            {currentResults.map((result, index) => {
              const uri = result.recipe.uri
              const id = uri.substring(uri.indexOf('_') + 1, uri.length)
              return (
                <>
                  <li key={index}>
                    <Link to={`/recipes/${id}`}>
                      <div>
                        <img src={result.recipe.image} alt="" />
                      </div>
                      <footer>
                        <h2>{result.recipe.label}</h2>
                        <span>{result.recipe.dietLabels.join(' ')}</span>
                        <span>
                          {result.recipe.healthLabels.splice(0, 3).join(', ')}
                        </span>
                        {result.recipe.totalTime > 0 ? (
                          <span>Made in {result.recipe.totalTime} mins</span>
                        ) : null}
                      </footer>
                    </Link>
                    {console.log(result.recipe.dietLabels)}
                    <div>
                      <Button
                        variant="primary"
                        onClick={() => handleAddRec(id, result, index)}
                        disabled={recipeAdded && selectedIndex === index}
                        className="add-btn"
                      >
                        <AiOutlineHeart /> Add to My Recipes
                      </Button>

                      {recipeAdded && selectedIndex === index ? (
                        <>
                          <Link to="/my-recipes">
                            {
                              <span className="message-added">
                                <AiFillHeart />
                                ADDED Go to My Recipes
                              </span>
                            }
                          </Link>
                        </>
                      ) : null}
                    </div>
                  </li>
                  <Modal show={show} onHide={handleClose} animation={false}>
                    <Modal.Header closeButton>
                      <Modal.Title>Save recipe</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{result.recipe.label} recipe</Modal.Body>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={handleAddtoMealPlan}
                    >
                      <option>Save into your meal plan</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select>
                    <Form.Text>Or, you can make a new meal plan</Form.Text>
                    <Form.Control
                      type="text"
                      placeholder="new plan name"
                      onChange={handleAddNewMealPlan}
                    />
                    <Modal.Footer>
                      <Button variant="primary" onClick={handleClose}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              )
            })}
          </ul>
        </>
      )}
      <Pagination
        resultsPerPage={resultsPerPage}
        totalResults={results.length}
        paginate={paginate}
      />
    </section>
  )
}
