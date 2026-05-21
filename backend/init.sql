CREATE DATABASE IF NOT EXISTS employee_management DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE employee_management;

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT NOW()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  gender VARCHAR(4) NOT NULL DEFAULT '男',
  phone VARCHAR(20) NOT NULL DEFAULT '',
  email VARCHAR(100) NOT NULL DEFAULT '',
  address VARCHAR(255) NOT NULL DEFAULT '',
  department_id INT NOT NULL,
  position VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT '在职',
  hire_date DATE NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
  FOREIGN KEY (department_id) REFERENCES departments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO departments (name) VALUES
  ('技术部'), ('市场部'), ('人事部'), ('财务部'), ('运营部');

INSERT INTO employees (name, gender, phone, email, address, department_id, position, salary, status, hire_date) VALUES
  ('张三', '男', '13800138001', 'zhangsan@company.com', '北京市海淀区中关村大街1号', 1, '前端工程师', 15000, '在职', '2023-06-01'),
  ('李四', '男', '13800138002', 'lisi@company.com', '北京市朝阳区望京SOHO', 1, '后端工程师', 16000, '在职', '2023-07-15'),
  ('王五', '女', '13800138003', 'wangwu@company.com', '上海市浦东新区陆家嘴', 2, '市场经理', 12000, '在职', '2022-03-10'),
  ('赵六', '女', '13800138004', 'zhaoliu@company.com', '广州市天河区珠江新城', 3, 'HR主管', 11000, '在职', '2021-09-20'),
  ('钱七', '男', '13800138005', 'qianqi@company.com', '深圳市南山区科技园', 4, '会计', 10000, '离职', '2024-01-08'),
  ('孙八', '女', '13800138006', 'sunba@company.com', '杭州市西湖区文三路', 5, '运营专员', 9000, '在职', '2024-03-01');
