import { Draggable } from 'react-beautiful-dnd'
import '../css/RecipeOnMealPlan.css'
import { Link } from 'react-router-dom'
export default function RecipeOnMealPlan({
  recipe,
  index,
  handleRemove,
  column,
}) {
  return (
    <Draggable key={recipe.id} draggableId={recipe.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            // inline as doesnt seem to work to add classname
            style={{
              border: snapshot.isDragging
                ? '2px solid #047a47b5'
                : '2px solid #9fcec7',
              ...provided.draggableProps.style,
              borderRadius: 10,
              padding: 0,
              overflow: 'hidden',
              marginBottom: '2px',
              // maxHeight: '120px',
              // maxWidth: '120px',
              minHeight: '60px',
            }}
          >
            <div className="item-content">
              <img src={recipe.image} className="recipe-image" alt="" />
              <Link to={`/recipes/${recipe.edamam_id}`}>
                <p className="recipe-name">{recipe.name}</p>
              </Link>
              <button
                onClick={() =>
                  handleRemove(index, column.day, recipe.edamam_id)
                }
                className="hide-btn"
              >
                X
              </button>
            </div>
          </div>
        )
      }}
    </Draggable>
  )
}
