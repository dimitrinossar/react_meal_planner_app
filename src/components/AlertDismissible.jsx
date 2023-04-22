import Alert from 'react-bootstrap/Alert'
import { useState } from 'react'

export default function AlertDismissible(error) {
  const [state, setState] = useState(true)
  const handleClose = () => setState(false)
  return (
    <Alert variant="danger" onClose={handleClose} dismissible>
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      <p>{error}</p>
    </Alert>
  )
}
