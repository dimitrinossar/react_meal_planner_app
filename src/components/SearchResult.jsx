import Button from 'react-bootstrap/Button'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { RiTimerLine } from 'react-icons/ri'

export default function SearchResult({
  id,
  result,
  index,
  recipeAdded,
  selectedIndex,
  handleAddRec,
  setShowAdd,
}) {
  return (
    <li className="result">
      <div className="result-wrapper">
        <Link to={`/recipes/${id}`}>
          <div className="image-wrapper">
            <img src={result.recipe.image} alt={result.recipe.label} />
          </div>
          <h2>{result.recipe.label}</h2>
          <footer>
            <span className="cuisine-type">
              {result.recipe.cuisineType.join(', ')}
            </span>
            {result.recipe.dietLabels &&
              result.recipe.dietLabels.length > 0 && (
                <span>{result.recipe.dietLabels.join(', ')}</span>
              )}

            {result.recipe.totalTime > 0 ? (
              <span className="time">
                <RiTimerLine /> {result.recipe.totalTime} mins
              </span>
            ) : null}
          </footer>
        </Link>
      </div>
      <div className="add-recipe">
        {recipeAdded && selectedIndex === index ? (
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
          <Button
            onClick={() => handleAddRec(id, result, index)}
            className="add-recipe-btn"
          >
            <AiOutlineHeart /> Add to My Recipes
          </Button>
        )}
      </div>
    </li>
  )
}
