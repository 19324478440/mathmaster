# 快速设置指南

## 问题：MySQL root 密码

你的 MySQL root 用户需要密码。请按以下步骤操作：

### 方法1：使用你的 MySQL root 密码

1. 在 PowerShell 中设置环境变量（替换 `你的密码` 为实际密码）：
   ```powershell
   $env:DB_PASSWORD = "你的密码"
   node init-db.js
   ```

2. 或者直接传递密码作为参数：
   ```powershell
   node init-db.js 你的密码
   ```

### 方法2：重置 MySQL root 密码为空

如果你忘记了密码，可以重置：

1. **停止 MySQL 服务**（管理员 PowerShell）：
   ```powershell
   net stop MySQL80
   ```

2. **以跳过权限模式启动**（保持窗口打开）：
   ```powershell
   mysqld --skip-grant-tables --skip-networking
   ```

3. **在新 PowerShell 窗口连接**：
   ```powershell
   mysql -u root
   ```

4. **在 MySQL shell 中执行**：
   ```sql
   USE mysql;
   UPDATE user SET authentication_string = '' WHERE User = 'root';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **关闭跳过模式的窗口，重启服务**（管理员 PowerShell）：
   ```powershell
   net start MySQL80
   ```

6. **运行初始化脚本**：
   ```powershell
   node init-db.js
   ```

### 方法3：使用 SQLite（无需密码，但需要安装 C++ 工具）

如果你想避免 MySQL 密码问题，可以使用 SQLite：

1. 安装 Visual Studio Build Tools（见之前的说明）
2. 运行：`npm install sqlite3`
3. 代码会自动使用 SQLite

## 初始化完成后

运行服务器：
```powershell
npm start
```

然后访问：http://localhost:3001

使用 demo/demo 登录。

