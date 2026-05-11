import { useEffect, useRef, useState } from 'react'

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [notes, setNotes] = useState(todo.notes ?? '')
  const [busy, setBusy] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    if (editing) {
      titleRef.current?.focus()
      titleRef.current?.select()
    }
  }, [editing])

  const startEdit = () => {
    setTitle(todo.title)
    setNotes(todo.notes ?? '')
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setTitle(todo.title)
    setNotes(todo.notes ?? '')
  }

  const saveEdit = async () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const updates = {}
    if (trimmedTitle !== todo.title) updates.title = trimmedTitle
    if (notes.trim() !== (todo.notes ?? '')) updates.notes = notes.trim()

    if (Object.keys(updates).length === 0) {
      setEditing(false)
      return
    }

    try {
      setBusy(true)
      await onUpdate(todo._id, updates)
      setEditing(false)
    } finally {
      setBusy(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const handleDelete = async () => {
    if (!confirm(`"${todo.title}" 항목을 삭제할까요?`)) return
    try {
      setBusy(true)
      await onDelete(todo._id)
    } finally {
      setBusy(false)
    }
  }

  const handleToggle = async () => {
    try {
      setBusy(true)
      await onToggle(todo._id, !todo.completed)
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className={`todo-item ${todo.completed ? 'todo-item--done' : ''}`}>
      <input
        type="checkbox"
        className="todo-item__checkbox"
        checked={!!todo.completed}
        onChange={handleToggle}
        disabled={busy || editing}
        aria-label="완료 토글"
      />

      {editing ? (
        <div className="todo-item__edit">
          <input
            ref={titleRef}
            type="text"
            className="todo-item__edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={busy}
            maxLength={200}
          />
          <textarea
            className="todo-item__edit-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="메모"
            disabled={busy}
            rows={2}
          />
          <div className="todo-item__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={saveEdit}
              disabled={busy || !title.trim()}
            >
              저장
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={cancelEdit}
              disabled={busy}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="todo-item__body">
          <div className="todo-item__content" onDoubleClick={startEdit}>
            <p className="todo-item__title">{todo.title}</p>
            {todo.notes && <p className="todo-item__notes">{todo.notes}</p>}
          </div>
          <div className="todo-item__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={startEdit}
              disabled={busy}
            >
              수정
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={handleDelete}
              disabled={busy}
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
