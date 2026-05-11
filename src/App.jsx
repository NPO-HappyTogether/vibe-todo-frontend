import { useEffect, useMemo, useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api/todos'
import './App.css'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '진행 중' },
  { key: 'completed', label: '완료' },
]

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const loadTodos = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchTodos()
      setTodos(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || '할 일 목록을 불러오지 못했어요.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const handleAdd = async ({ title, notes }) => {
    try {
      setSubmitting(true)
      setError('')
      const created = await createTodo({ title, notes, completed: false })
      setTodos((prev) => [created, ...prev])
    } catch (err) {
      setError(err.message || '추가에 실패했어요.')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (id, completed) => {
    try {
      setError('')
      const updated = await updateTodo(id, { completed })
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)))
    } catch (err) {
      setError(err.message || '상태 변경에 실패했어요.')
    }
  }

  const handleUpdate = async (id, updates) => {
    try {
      setError('')
      const updated = await updateTodo(id, updates)
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)))
    } catch (err) {
      setError(err.message || '수정에 실패했어요.')
      throw err
    }
  }

  const handleDelete = async (id) => {
    try {
      setError('')
      await deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      setError(err.message || '삭제에 실패했어요.')
    }
  }

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed)
    if (filter === 'completed') return todos.filter((t) => t.completed)
    return todos
  }, [todos, filter])

  const remaining = todos.filter((t) => !t.completed).length

  return (
    <div className="app">
      <main className="container">
        <header className="header">
          <h1 className="header__title">📝 할 일 관리</h1>
          <p className="header__subtitle">
            남은 할 일 <strong>{remaining}</strong>개 / 전체 {todos.length}개
          </p>
        </header>

        <section className="card">
          <TodoForm onSubmit={handleAdd} submitting={submitting} />
        </section>

        {error && (
          <div className="alert" role="alert">
            {error}
            <button
              type="button"
              className="alert__close"
              onClick={() => setError('')}
              aria-label="에러 닫기"
            >
              ×
            </button>
          </div>
        )}

        <section className="card">
          <div className="filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`filter ${filter === f.key ? 'filter--active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
            <button
              type="button"
              className="filter filter--refresh"
              onClick={loadTodos}
              disabled={loading}
              title="새로고침"
            >
              {loading ? '불러오는 중...' : '↻ 새로고침'}
            </button>
          </div>

          {loading ? (
            <p className="todo-empty">불러오는 중...</p>
          ) : (
            <TodoList
              todos={filtered}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
