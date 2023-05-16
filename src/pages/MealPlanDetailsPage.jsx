import { db } from '../index'
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { DragDropContext } from 'react-beautiful-dnd'
import '../css/MealPlanDetailsPage.css'
import Column from '../components/Column'

export default function MealPlanPage() {
  const mealPlansRef = collection(db, 'mealplans')
  const { id } = useParams()
  const [mealPlan, setMealPlan] = useState({})
  const getMealPlan = async () => {
    try {
      const q = query(mealPlansRef, where('__name__', '==', id))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        console.log('doc.data() or mealPlan', doc.data())
        setMealPlan(doc.data())
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleRemove = async (index, day, recipeId) => {
    const mealPlansDoc = doc(db, 'mealplans', mealPlan.id)
    const newMealPlan = { ...mealPlan }
    const columnToDeleteFrom = mealPlan.columns[day]
    const recipeIds = [...columnToDeleteFrom.recipe_ids]
    recipeIds.splice(index, 1)
    newMealPlan.columns[day].recipe_ids = recipeIds
    delete newMealPlan.recipes[recipeId]
    setMealPlan(newMealPlan)
    await updateDoc(mealPlansDoc, newMealPlan)
  }

  useEffect(() => {
    getMealPlan()
  }, [])

  const onDragEnd = async (result, columns) => {
    console.log(columns)
    if (!result.destination) return
    const { source, destination } = result
    const mealPlansDoc = doc(db, 'mealplans', mealPlan.id)
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.recipe_ids]
      const destItems = [...destColumn.recipe_ids]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      const newMealPlan = { ...mealPlan }
      newMealPlan.columns[source.droppableId].recipe_ids = sourceItems
      newMealPlan.columns[destination.droppableId].recipe_ids = destItems
      setMealPlan(newMealPlan)
      // console.log(newMealPlan.recipes)
      await updateDoc(mealPlansDoc, newMealPlan)
    } else {
      const column = columns[source.droppableId]
      const copiedRecipeIds = [...column.recipe_ids]
      const [removed] = copiedRecipeIds.splice(source.index, 1)
      copiedRecipeIds.splice(destination.index, 0, removed)
      const newMealPlan = { ...mealPlan }
      newMealPlan.columns[source.droppableId].recipe_ids = copiedRecipeIds
      setMealPlan(newMealPlan)
      // console.log(newMealPlan.recipes)
      await updateDoc(mealPlansDoc, newMealPlan)
    }
  }

  return (
    <div className="meal-plan">
      <h1>{mealPlan.name}</h1>
      <div className="grid">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, mealPlan.columns)}
        >
          {mealPlan.column_order?.map((day) => {
            const column = mealPlan.columns[day]
            const recipes = column.recipe_ids.map((id) => mealPlan.recipes[id])
            return (
              <Column
                key={column.id}
                column={column}
                recipes={recipes}
                day={day}
                handleRemove={handleRemove}
              />
            )
          })}
        </DragDropContext>
      </div>
      <p className="noteOnApi">
        Note: due to the 3rd party API used, images may not load after a period
        of time from adding
      </p>
    </div>
  )
}
