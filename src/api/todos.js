// 환경변수에 VITE_API_BASE_URL이 설정되어 있으면 그 URL을 사용 (예: 배포된 백엔드)
// 비어 있으면 Vite 프록시(/todos → localhost:5000)를 사용 (로컬 백엔드)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/todos'

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return data
}

export function fetchTodos() {
  return request(BASE_URL)
}

export function createTodo({ title, notes, completed }) {
  return request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ title, notes, completed }),
  })
}

export function updateTodo(id, updates) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export function deleteTodo(id) {
  return request(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
}
