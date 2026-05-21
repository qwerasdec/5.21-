const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── 部门 API ─────────────────────────────────────────

app.get('/api/departments', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM departments ORDER BY id');
  res.json(rows);
});

app.post('/api/departments', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: '请输入部门名称' });
  try {
    const [result] = await pool.query('INSERT INTO departments (name) VALUES (?)', [name]);
    const [rows] = await pool.query('SELECT * FROM departments WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(400).json({ message: '部门名称已存在' });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  const [existing] = await pool.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);
  if (!existing[0]) return res.status(404).json({ message: '部门不存在' });
  const [empCount] = await pool.query('SELECT COUNT(*) as cnt FROM employees WHERE department_id = ?', [req.params.id]);
  if (empCount[0].cnt > 0) return res.status(400).json({ message: '该部门下还有员工，无法删除' });
  await pool.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
  res.json({ message: '删除成功' });
});

// ─── 员工 API ─────────────────────────────────────────

const EMPLOYEE_SQL = `
  SELECT e.*, d.name as department_name
  FROM employees e
  JOIN departments d ON e.department_id = d.id
`;

app.get('/api/employees', async (req, res) => {
  const { status, department_id } = req.query;
  let sql = `${EMPLOYEE_SQL} WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND e.status = ?'; params.push(status); }
  if (department_id) { sql += ' AND e.department_id = ?'; params.push(Number(department_id)); }
  sql += ' ORDER BY e.created_at DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

app.get('/api/employees/:id', async (req, res) => {
  const [rows] = await pool.query(`${EMPLOYEE_SQL} WHERE e.id = ?`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: '员工不存在' });
  res.json(rows[0]);
});

app.post('/api/employees', async (req, res) => {
  const { name, gender, phone, email, address, department_id, position, salary, status, hire_date } = req.body;
  if (!name || !department_id || !position || !salary || !hire_date) {
    return res.status(400).json({ message: '请填写必填字段（姓名、部门、职位、薪资、入职日期）' });
  }
  const [result] = await pool.query(
    `INSERT INTO employees (name, gender, phone, email, address, department_id, position, salary, status, hire_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, gender || '男', phone || '', email || '', address || '',
     department_id, position, salary, status || '在职', hire_date]
  );
  const [rows] = await pool.query(`${EMPLOYEE_SQL} WHERE e.id = ?`, [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/employees/:id', async (req, res) => {
  const [existing] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
  if (!existing[0]) return res.status(404).json({ message: '员工不存在' });

  const { name, gender, phone, email, address, department_id, position, salary, status, hire_date } = req.body;
  await pool.query(
    `UPDATE employees SET name=?, gender=?, phone=?, email=?, address=?,
       department_id=?, position=?, salary=?, status=?, hire_date=?
     WHERE id=?`,
    [name ?? existing[0].name, gender ?? existing[0].gender,
     phone ?? existing[0].phone, email ?? existing[0].email,
     address ?? existing[0].address, department_id ?? existing[0].department_id,
     position ?? existing[0].position, salary ?? existing[0].salary,
     status ?? existing[0].status, hire_date ?? existing[0].hire_date,
     req.params.id]
  );
  const [rows] = await pool.query(`${EMPLOYEE_SQL} WHERE e.id = ?`, [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/employees/:id', async (req, res) => {
  const [existing] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
  if (!existing[0]) return res.status(404).json({ message: '员工不存在' });
  await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
  res.json({ message: '删除成功' });
});

app.listen(PORT, () => {
  console.log(`后端服务已启动: http://localhost:${PORT}`);
});
