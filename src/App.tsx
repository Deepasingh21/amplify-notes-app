import { useEffect, useState } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import './App.css'


function App() {
  const client = generateClient<Schema>()

  const [notes, setNotes] = useState<Array<Schema['Note']['type']>>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  async function fetchNotes() {
    const { data } = await client.models.Note.list()
    setNotes(data)
  }

  async function createNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await client.models.Note.create({
  title: [title],
  content: [content],
    })

    setTitle('')
    setContent('')
    fetchNotes()
  }

  async function updateNote(id: string) {
    const newTitle = prompt('Enter new title')
    if (!newTitle) return

    await client.models.Note.update({
  id: id as any,
  title: [newTitle],
} as any)

    fetchNotes()
  }

  async function deleteNote(id: string) {
    await client.models.Note.delete({ id })
    fetchNotes()
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ padding: '30px', maxWidth: '700px', margin: 'auto' }}>
          <h1>Amplify Notes App</h1>

          <p>Signed in as: {user?.signInDetails?.loginId}</p>
          <button onClick={signOut}>Sign out</button>

          <form onSubmit={createNote} style={{ marginTop: '30px' }}>
            <input
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
            />

            <textarea
              placeholder="Note content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
            />

            <button type="submit">Create Note</button>
          </form>

          <hr />

          {notes.map((note) => (
            <div key={note.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
              <h3>{note.title?.[0]}</h3>
              <p>{note.content}</p>

              <button onClick={() => updateNote(note.id)}>Update</button>
              <button onClick={() => deleteNote(note.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            </div>
          ))}
        </main>
      )}
    </Authenticator>
  )
}

export default App