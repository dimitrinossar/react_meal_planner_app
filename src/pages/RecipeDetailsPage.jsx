import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { db } from '../index'
import { getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import '../css/RecipeDetailsPage.css'
import AddToMealplanPopUp from '../components/AddToMealplanPopUp'
import { dietaryRequirements } from '../data'
import { RiTimerLine } from 'react-icons/ri'
import { FiExternalLink } from 'react-icons/fi'

export default function RecipeDetailsPage({ user, loading }) {
  const [recipe, setRecipe] = useState(null)
  const { id } = useParams()
  const [recipeAdded, setRecipeAdded] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState({})
  const navigate = useNavigate()

  const handleAddRec = async () => {
    if (!user) navigate('/login')
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
  const recipeCollectionsRef = collection(db, 'recipes')

  useEffect(() => {
    fetch(
      `https://api.edamam.com/search?q=${id}&app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_API_KEY}&from=0&to=20`,
    )
      .then((res) => res.json())
      .then((res) => {
        setRecipe(res.hits[0].recipe)
      })
  }, [id])

  const toggleCrossedLine = ({ target }) => {
    target.classList.toggle('crossed-out')
  }

  return (
    <main className="details-content">
      <div className="img-container">
        <img src={recipe?.image} alt={recipe?.label} />
      </div>

      <div className="content-container">
        <h1>{recipe?.label}</h1>
        <div className="servings-time">
          <p>Makes {recipe?.yield} servings</p>
          {recipe?.totalTime > 0 ? (
            <p>
              <RiTimerLine /> {recipe.totalTime} mins
            </p>
          ) : null}
        </div>
        <div className="type">
          <p>{recipe?.dietLabels.join(' | ')}</p>
          <p>
            {recipe?.mealType.join('/')} | {recipe?.dishType.join(' | ')}
          </p>
        </div>
        <div className="health-labels">
          <p>
            {recipe?.healthLabels
              .filter((label) => dietaryRequirements.includes(label))
              .join(' | ')}
          </p>
        </div>

        <h4>Ingredients:</h4>
        <ul>
          {recipe?.ingredientLines.map((ingredient, index) => {
            return (
              <li
                key={index}
                onClick={toggleCrossedLine}
                className="ingredient"
              >
                {ingredient}
              </li>
            )
          })}
        </ul>
        <p>Originally from {recipe?.source}</p>
        <p className="instructions">
          <Link to={recipe?.url} target="_blank" rel="noopener noreferrer">
            <Button variant="primary">
              <FiExternalLink /> Click for instructions
            </Button>
          </Link>
        </p>
        {recipeAdded ? (
          <div className="added-recipe">
            <span className="message-added">
              <AiFillHeart /> ADDED
            </span>
            <div className="added-recipe-btns">
              <Link to="/my-recipes">
                <Button size="sm">Go to My Recipes</Button>
              </Link>
              <Button size="sm" onClick={() => setShowAdd(true)}>
                Add to meal plan
              </Button>
            </div>
          </div>
        ) : (
          <div className="add-btn">
            <Button
              onClick={() => {
                handleAddRec()
              }}
            >
              <AiOutlineHeart /> Add to My Recipes
            </Button>
          </div>
        )}
        <AddToMealplanPopUp
          selectedRecipe={selectedRecipe}
          user={user}
          showAdd={showAdd}
          setShowAdd={setShowAdd}
        />
      </div>
    </main>
  )
}
