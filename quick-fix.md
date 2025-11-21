# 快速修复指南

## 问题：MySQL root 密码

你的 MySQL root 用户需要密码才能连接。

### 最快解决方法（1分钟）：

**在 PowerShell 中运行以下命令（替换 `你的密码` 为你的 MySQL root 密码）：**

```powershell
$env:DB_PASSWORD = "你的密码"
node init-db.js
npm start
```

### 如果你不知道 MySQL root 密码：

1. **打开 PowerShell（管理员）**，运行：
   ```powershell
   net stop MySQL80
   ```

2. **在同一个窗口运行**（保持窗口打开）：
   ```powershell
   mysqld --skip-grant-tables --skip-networking
   ```

3. **打开新的 PowerShell 窗口**（普通用户），运行：
   ```powershell
   mysql -u root
   ```

4. **在 MySQL 提示符下输入**（一行一行）：
   ```sql
   USE mysql;
   UPDATE user SET authentication_string = '' WHERE User = 'root';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **关闭第一个 PowerShell 窗口**，在管理员 PowerShell 运行：
   ```powershell
   net start MySQL80
   ```

6. **回到项目目录运行**：
   ```powershell
   node init-db.js
   npm start
   ```

### 完成后：

访问 http://localhost:3001，使用 **demo / demo** 登录！

