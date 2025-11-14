# 🧩 Yubendan AI Chat 网站

本项目是一个 AI Chat 网站，包含访客聊天界面以及管理员后台，可在线配置 API Key、模型、提示词。后端使用 Node.js + Express，前端纯静态 HTML/JS。

## 🌟 特性

- 访客聊天界面与管理员后台分离
- 支持多种 AI 模型（DeepSeek、OpenAI、Anthropic、Gemini等）
- 在线配置 API Key、模型、系统提示词和欢迎消息
- 安全的 JWT 认证机制
- 响应式设计，支持移动端访问
- 支持 Docker 部署和传统部署

## 📁 项目结构

```
ai-chat-app/
│
├── public/                 # 前端静态资源
│   ├── index.html          # 访客聊天页面
│   ├── admin.html          # 管理员后台页面
│   ├── app.js             # 访客聊天前端逻辑
│   ├── admin.js           # 管理员后台前端逻辑
│   └── styles.css         # 全局样式文件
│
├── server/                # 后端服务
│   ├── server.js          # 主服务文件
│   ├── config.json        # 配置文件
│   └── .env               # 环境变量配置
│
└── README.md              # 项目说明文档
```

## ⚙️ 环境要求

- Node.js >= 14.x
- npm >= 6.x

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <项目地址>
cd ai-chat-app
```

### 2. 配置环境变量

复制环境变量模板并配置相关参数：

```bash
cd server
cp .env.example .env
```

编辑 .env 文件：

```env
# 服务器端口
PORT=3000

# 管理员密码
ADMIN_PASSWORD=your_admin_password

# JWT密钥
JWT_SECRET=your_jwt_secret_key

# 支持的不同AI提供商的API密钥（任选其一或多个）
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key

# 默认配置（如果config.json不存在，则使用这些值）
DEFAULT_PROVIDER=deepseek
DEFAULT_MODEL=deepseek-chat
DEFAULT_API_BASE=https://api.deepseek.com/v1
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动项目

```bash
npm start
```

或者开发模式：

```bash
npm run dev
```

默认运行在 http://localhost:3000

### 5. 访问页面

- 访客聊天页 → http://localhost:3000/
- 管理后台 → http://localhost:3000/admin

## 🔐 管理员登录

使用在 .env 文件中配置的 ADMIN_PASSWORD 进行登录，登录后会获得 JWT token 用于后续的管理操作。

## 🛠 在线配置

通过管理后台可以在线修改以下配置：

- AI 提供商（DeepSeek、OpenAI、Anthropic、Gemini等）
- API Key
- AI 模型
- 系统提示词
- 欢迎消息

## 🛡 安全说明

- API Key 永远不会返回给前端
- 所有聊天代理均通过 /api/chat 端点处理
- 管理接口需要有效的 JWT Token 才能访问


### 启用 HTTPS（推荐）

宝塔 → 网站 → SSL → 一键申请 Let's Encrypt

## 🚀 PM2 部署

### 1. 安装 PM2

```bash
npm install -g pm2
```

### 2. 启动服务

```bash
cd server
pm2 start server.js --name ai-chat-api
```

### 3. 常用命令

```bash
pm2 restart ai-chat-api
pm2 stop ai-chat-api
pm2 logs ai-chat-api
pm2 startup # 开机自启
pm2 save
```

## 📦 宝塔服务器部署指南（BT 面板）

### 1. 上传项目

将整个 ai-chat-app 上传到：

```
/www/wwwroot/ai-chat-app/
```

### 2. 创建网站

在宝塔新建站点

根目录指定为：

```
/www/wwwroot/ai-chat-app/public
```

### 3. 配置 Node 后端（PM2）

进入 SSH：

```bash
cd /www/wwwroot/ai-chat-app/server
npm install
pm2 start server.js --name ai-chat-api
pm2 save
```

### 4. 配置 Nginx 反向代理

在 宝塔 → 网站 → 设置 → 配置文件 中加入：

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 5. 启用 HTTPS

宝塔面板 → 网站 → SSL

选择 Let's Encrypt 一键申请

### 6. 访问测试

- AI 聊天 → https://你的域名/
- 管理后台 → https://你的域名/admin

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 📄 许可证

MIT License