import { useState } from 'react'

export default function TodoForm({ onSubmit, submitting }) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    try {
      await onSubmit({ title: trimmed, notes: notes.trim() })
      setTitle('')
      setNotes('')
    } catch {
      // 에러는 부모에서 처리
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-form__title"
        placeholder="할 일을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={submitting}
        maxLength={200}
      />
      <textarea
        className="todo-form__notes"
        placeholder="메모 (선택)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={submitting}
        rows={2}
      />
      <button
        type="submit"
        className="btn btn--primary"
        disabled={submitting || !title.trim()}
      >
        {submitting ? '추가 중...' : '추가'}
      </button>
    </form>
  )
}
