import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../index'
import { addDoc, collection } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import '../css/RecipeDetailsPage.css'

export default function RecipeDetailsPage({ results }) {
  const [recipe, setRecipe] = useState(null)
  const { id } = useParams()
  const [recipeAdded, setRecipeAdded] = useState(false)
  const [show, setShow] = useState(false)
  const [mealPlans, setMealPlans] = useState(null)
  const [newMealPlan, setNewMealPlan] = useState(null)

  const handleClose = () => setShow(false)
  const handleAddRec = async () => {
    setShow(true)
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
    // setRecipeAdded(true)
  }
  // const { recipe } = results.find((recipe) => {
  // const uri = recipe.recipe.uri
  // const idFsetSelectedIndexromResults = uri.substring(uri.indexOf('_') + 1, uri.length)
  //   return idFromResults === id
  // })
  useEffect(() => {
    fetch(
      `https://api.edamam.com/search?q=${id}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}&from=0&to=20`,
    )
      .then((res) => res.json())
      .then((res) => {
        setRecipe(res.hits[0].recipe)
      })
  }, [id])
  const recipeCollectionsRef = collection(db, 'recipes')
  const handleAddtoMealPlan = () => {} // function to add the recipe to the meal plan
  const handleAddNewMealPlan = () => {} // function to add the new meal plan and the recipe to the database }

  return (
    <section className="details-section">
      <main className="details-content">
        <div className="img-container">
          <img src={recipe?.image} alt="" />
        </div>
        <div className="content-container">
          <h1>{recipe?.label}</h1>
          <ul>
            Ingredients:
            {recipe?.ingredientLines.map((ingredient, index) => {
              return <li key={index}>{ingredient}</li>
            })}
          </ul>
          <p>
            Health labels:
            {recipe?.healthLabels
              .filter((label, index) => index < 6)
              .map((label, index) => {
                return <span key={index}> {label} </span>
              })}
          </p>
          {recipe?.totalTime > 0 ? (
            <p>Make in {recipe?.totalTime} mins</p>
          ) : null}
          <Button
            variant="primary"
            onClick={handleAddRec}
            disabled={recipeAdded}
            className="add-btn"
          >
            <AiOutlineHeart /> Add to My Recipes
          </Button>
          {recipeAdded ? (
            <>
              <Link to="/my-recipes">
                <span>
                  <AiFillHeart /> ADDED Go to My Recipes
                </span>
              </Link>
            </>
          ) : null}
          <p>
            Original Source: <Link to={recipe?.url}>{recipe?.source}</Link>
          </p>
          <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>Save recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>{recipe?.label} recipe</Modal.Body>
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
        </div>
      </main>
    </section>
  )
}
