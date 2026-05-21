import React, { useState, useEffect } from 'react';
import {
  fetchEmployees, createEmployee, updateEmployee, deleteEmployee,
  fetchDepartments, createDepartment, deleteDepartment,
} from './api';

const emptyForm = {
  name: '', gender: '男', phone: '', email: '', address: '',
  department_id: '', position: '', salary: '', status: '在职', hire_date: '',
};

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptName, setDeptName] = useState('');

  const loadEmployees = async () => {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterDept) params.department_id = filterDept;
    const data = await fetchEmployees(params);
    setEmployees(data);
  };

  const loadDepartments = async () => {
    const data = await fetchDepartments();
    setDepartments(data);
  };

  useEffect(() => { loadEmployees(); }, [filterStatus, filterDept]);
  useEffect(() => { loadDepartments(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setForm({
      name: emp.name, gender: emp.gender, phone: emp.phone, email: emp.email,
      address: emp.address, department_id: String(emp.department_id),
      position: emp.position, salary: String(emp.salary),
      status: emp.status, hire_date: emp.hire_date,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, salary: Number(form.salary), department_id: Number(form.department_id) };
    if (editing) {
      await updateEmployee(editing.id, payload);
    } else {
      await createEmployee(payload);
    }
    setShowModal(false);
    loadEmployees();
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除该员工吗？')) return;
    await deleteEmployee(id);
    loadEmployees();
  };

  const handleAddDept = async () => {
    if (!deptName.trim()) return;
    try {
      await createDepartment(deptName.trim());
      setDeptName('');
      loadDepartments();
    } catch (e) {
      alert('添加失败，部门名可能已存在');
    }
  };

  const handleDeleteDept = async (id) => {
    try {
      await deleteDepartment(id);
      loadDepartments();
    } catch (e) {
      alert('无法删除，请确保该部门下没有员工');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const statusColor = (s) => s === '在职' ? '#52c41a' : '#ff4d4f';

  return (
    <div className="app">
      <header>
        <h1>员工管理系统</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => setShowDeptModal(true)}>部门管理</button>
          <button className="btn btn-primary" onClick={openAdd}>+ 添加员工</button>
        </div>
      </header>

      {/* 筛选栏 */}
      <div className="filters">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">全部状态</option>
          <option value="在职">在职</option>
          <option value="离职">离职</option>
        </select>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="">全部部门</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* 员工表格 */}
      <div className="employee-table">
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>性别</th>
              <th>部门</th>
              <th>职位</th>
              <th>薪资</th>
              <th>状态</th>
              <th>入职日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan={8} className="empty">暂无员工数据</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.gender}</td>
                  <td>{emp.department_name}</td>
                  <td>{emp.position}</td>
                  <td>{emp.salary.toLocaleString()}</td>
                  <td style={{ color: statusColor(emp.status), fontWeight: 600 }}>{emp.status}</td>
                  <td>{emp.hire_date}</td>
                  <td className="actions">
                    <button className="btn btn-primary btn-sm" onClick={() => openEdit(emp)}>编辑</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.id)}>删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 员工表单弹窗 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? '编辑员工' : '添加员工'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>姓名 *</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>性别</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>手机</label>
                  <input name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>邮箱</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>地址</label>
                <input name="address" value={form.address} onChange={handleChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>部门 *</label>
                  <select name="department_id" value={form.department_id} onChange={handleChange} required>
                    <option value="">请选择</option>
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>职位 *</label>
                  <input name="position" value={form.position} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>薪资 *</label>
                  <input name="salary" type="number" value={form.salary} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>状态</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="在职">在职</option>
                    <option value="离职">离职</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>入职日期 *</label>
                <input name="hire_date" type="date" value={form.hire_date} onChange={handleChange} required />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>取消</button>
                <button type="submit" className="btn btn-primary">{editing ? '保存' : '添加'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 部门管理弹窗 */}
      {showDeptModal && (
        <div className="modal-overlay" onClick={() => setShowDeptModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>部门管理</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                style={{ flex: 1, padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: 6 }}
                placeholder="输入部门名称"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDept()}
              />
              <button className="btn btn-primary" onClick={handleAddDept}>添加</button>
            </div>
            <table className="dept-table">
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDept(d.id)}>删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
