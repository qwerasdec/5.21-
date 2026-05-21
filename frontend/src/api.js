const EMP_API = '/api/employees';
const DEPT_API = '/api/departments';

// ─── 员工 API ────────────────────────────────────────

export async function fetchEmployees(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${EMP_API}?${query}`);
  if (!res.ok) throw new Error('获取员工列表失败');
  return res.json();
}

export async function createEmployee(data) {
  const res = await fetch(EMP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('添加员工失败');
  return res.json();
}

export async function updateEmployee(id, data) {
  const res = await fetch(`${EMP_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('更新员工失败');
  return res.json();
}

export async function deleteEmployee(id) {
  const res = await fetch(`${EMP_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('删除员工失败');
  return res.json();
}

// ─── 部门 API ────────────────────────────────────────

export async function fetchDepartments() {
  const res = await fetch(DEPT_API);
  if (!res.ok) throw new Error('获取部门列表失败');
  return res.json();
}

export async function createDepartment(name) {
  const res = await fetch(DEPT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('添加部门失败');
  return res.json();
}

export async function deleteDepartment(id) {
  const res = await fetch(`${DEPT_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('删除部门失败');
  return res.json();
}
