import { Modal, Form, Button } from 'react-bootstrap'
import { db } from '..'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from 'firebase/firestore'

export default function AddToMealplanPopUp({
  selectedRecipe,
  user,
  showAdd,
  setShowAdd,
}) {
  const [mealPlans, setMealPlans] = useState(null)
  const [newPlanner, setNewPlanner] = useState('')
  const [selectedPlanner, setSelectedPlanner] = useState('default')
  const mealPlansRef = collection(db, 'mealplans')
  const getMealPlans = async () => {
    if (user) {
      const q = query(
        mealPlansRef,
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc'),
      )
      try {
        const data = await getDocs(q)
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        setMealPlans(filteredData)
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    getMealPlans()
  }, [])

  const handleChangeNew = (e) => {
    setNewPlanner(e.target.value)
    setSelectedPlanner('default')
  }
  const handleHideAdd = () => {
    setShowAdd(false)
    setSelectedPlanner('default')
    setNewPlanner('')
  }
  const handleChangeExisting = (e) => {
    setSelectedPlanner(e.target.value)
    setNewPlanner('')
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowAdd(false)
    if (selectedPlanner !== 'default') {
      // for adding to existing db
      const recipeId = uuid()
      const mealPlansDoc = doc(db, 'mealplans', selectedPlanner)
      const tempState = mealPlans.filter(
        (mealPlan) => mealPlan.id === selectedPlanner,
      )[0]
      tempState.columns['Monday'].recipe_ids.push(recipeId)
      tempState.recipes = {
        ...tempState.recipes,
        [recipeId]: {
          ...selectedRecipe,
          db_id: selectedRecipe.id,
          id: recipeId,
        },
      }
      console.log(selectedRecipe)
      await updateDoc(mealPlansDoc, tempState)
      setSelectedPlanner('default')
      setNewPlanner('')
    } else {
      // for adding to new db
      const recipeId = uuid()
      try {
        await addDoc(mealPlansRef, {
          name: newPlanner,
          column_order: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          columns: {
            Monday: {
              id: uuid(),
              day: 'Monday',
              recipe_ids: [recipeId],
            },
            Tuesday: { id: uuid(), day: 'Tuesday', recipe_ids: [] },
            Wednesday: { id: uuid(), day: 'Wednesday', recipe_ids: [] },
            Thursday: { id: uuid(), day: 'Thursday', recipe_ids: [] },
            Friday: { id: uuid(), day: 'Friday', recipe_ids: [] },
            Saturday: { id: uuid(), day: 'Saturday', recipe_ids: [] },
            Sunday: { id: uuid(), day: 'Sunday', recipe_ids: [] },
          },
          recipes: {
            [recipeId]: {
              ...selectedRecipe,
              db_id: selectedRecipe.id,
              id: recipeId,
            },
          },
          user_id: user.uid,
          created_at: serverTimestamp(),
        })
        getMealPlans()
        setSelectedPlanner('default')
        setNewPlanner('')
      } catch (err) {
        console.log(err)
      }
    }
  }
  return (
    <Modal show={showAdd} onHide={handleHideAdd} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          Which meal planner do you want to add <i>{selectedRecipe.name}</i>
          &nbsp;to?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Text>Save into existing meal plan</Form.Text>
            <Form.Select
              aria-label="Default select example"
              onChange={handleChangeExisting}
              value={selectedPlanner}
            >
              <option value="default">Pick meal plan</option>
              {mealPlans?.map((mealPlan, index) => (
                <option key={index} value={mealPlan.id}>
                  {mealPlan.name}
                </option>
              ))}
            </Form.Select>
            <Form.Text>Save into new meal plan</Form.Text>
            <Form.Control
              onChange={handleChangeNew}
              type="text"
              placeholder="Enter new meal plan name"
              value={newPlanner}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={(e) => handleSubmit(e)}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
