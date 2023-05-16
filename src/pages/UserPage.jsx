import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { storage } from '..'
import '../css/UserPage.css'

export default function UserPage({ user, loading }) {
  const [isEditing, setIsEditing] = useState(false)
  const [file, setFile] = useState(null)
  const [username, setUsername] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    if (user) setUsername(user.displayName)
  }, [user])

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }
  const handleUsername = ({ target }) => {
    setUsername(target.value)
  }
  const handleFile = ({ target }) => {
    setFile(target.files[0])
  }

  const handleSave = async () => {
    let imagePath = user.photoURL
    if (file) {
      const storageRef = ref(storage, `${user.uid}/profilePicture/${file.name}`)
      const newImage = await uploadBytes(storageRef, file)
      imagePath = await getDownloadURL(newImage.ref)
    }
    try {
      await updateProfile(user, {
        displayName: username,
        photoURL: imagePath,
      })
      navigate(0)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {!isEditing ? (
            <div className="profile-info">
              <h2 className="username">{user.displayName}</h2>
              <div className="img-wrapper">
                <img src={user.photoURL} alt="" />{' '}
              </div>
              <button onClick={handleEdit} className="edit-btn">
                {isEditing ? 'Cancel' : 'Edit profile'}
              </button>
            </div>
          ) : (
            <div className="edit-profile">
              <label htmlFor="">change username: </label>
              <input type="text" value={username} onChange={handleUsername} />
              <label htmlFor=""> change profile image: </label>
              <input type="file" accept="image/*" onChange={handleFile} />
              <footer className="edit-btns">
                <button onClick={handleEdit} className="edit-btn">
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                {isEditing && (
                  <button
                    disabled={!file && username === user.displayName}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                )}
              </footer>
            </div>
          )}
        </>
      )}
    </section>
  )
}
