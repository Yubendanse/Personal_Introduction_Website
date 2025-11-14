/*
  极简后端：
  - 提供 /api/chat（公用） 用于访客聊天（读取 server/config.json 中的 apiKey 与 systemPrompt）
  - 提供 /api/login（POST） 管理员登陆，返回 JWT
  - 提供 /api/config GET/POST（需管理员 token） 用于读取与更新配置
  - 静态托管 public 目录，/admin 路由映射到 admin.html
*/

require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG_PATH = path.join(__dirname, 'config.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Helper: read config
async function readConfig() {
  try {
    const cfg = await fs.readJson(CONFIG_PATH);
    return cfg;
  } catch (err) {
    console.error('readConfig error:', err);
    // 返回默认配置
    return { 
      provider: process.env.DEFAULT_PROVIDER || 'openai',
      apiKey: '',
      apiBase: process.env.DEFAULT_API_BASE || 'https://api.openai.com/v1',
      model: process.env.DEFAULT_MODEL || 'gpt-4o-mini', 
      systemPrompt: '', 
      welcomeMessage: '' 
    };
  }
}

// Helper: write config (only server-side)
async function writeConfig(newCfg) {
  const safe = await readConfig();
  const merged = { ...safe, ...newCfg };
  await fs.writeJson(CONFIG_PATH, merged, { spaces: 2 });
  return merged;
}

// Middleware: verify admin token
function verifyAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Admin login
app.post('/api/login', async (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Missing password' });
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  });
  res.json({ token });
});

// Get config (do NOT return apiKey value for safety; return whether it's set)
app.get('/api/config', verifyAdmin, async (req, res) => {
  const cfg = await readConfig();
  res.json({
    provider: cfg.provider,
    apiBase: cfg.apiBase,
    model: cfg.model,
    systemPrompt: cfg.systemPrompt,
    welcomeMessage: cfg.welcomeMessage,
    apiKeySet: !!cfg.apiKey
  });
});

// Get welcome message (public endpoint)
app.get('/api/welcome', async (req, res) => {
  const cfg = await readConfig();
  res.json({
    welcomeMessage: cfg.welcomeMessage || '你好！我是 AI 聊天助手。请在下方输入你的问题。'
  });
});

// Update config (admin only). Allow updating apiKey, model, prompts
app.post('/api/config', verifyAdmin, async (req, res) => {
  const { provider, apiKey, apiBase, model, systemPrompt, welcomeMessage } = req.body || {};
  const update = {};
  
  if (typeof provider === 'string') update.provider = provider;
  if (typeof apiKey === 'string') update.apiKey = apiKey.trim();
  if (typeof apiBase === 'string') update.apiBase = apiBase;
  if (typeof model === 'string') update.model = model;
  if (typeof systemPrompt === 'string') update.systemPrompt = systemPrompt;
  if (typeof welcomeMessage === 'string') update.welcomeMessage = welcomeMessage;
  
  try {
    const newCfg = await writeConfig(update);
    res.json({ 
      ok: true, 
      config: { 
        provider: newCfg.provider,
        apiBase: newCfg.apiBase,
        model: newCfg.model, 
        systemPrompt: newCfg.systemPrompt, 
        welcomeMessage: newCfg.welcomeMessage, 
        apiKeySet: !!newCfg.apiKey 
      } 
    });
  } catch (err) {
    console.error('writeConfig error', err);
    res.status(500).json({ error: 'Failed to write config' });
  }
});

// Chat endpoint (public)
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: 'messages required' });

  const cfg = await readConfig();
  
  // 根据配置或环境变量确定API密钥
  let apiKey = '';
  switch(cfg.provider) {
    case 'openai':
      apiKey = process.env.OPENAI_API_KEY || cfg.apiKey;
      break;
    case 'deepseek':
      apiKey = process.env.DEEPSEEK_API_KEY || cfg.apiKey;
      break;
    case 'anthropic':
      apiKey = process.env.ANTHROPIC_API_KEY || cfg.apiKey;
      break;
    case 'gemini':
      apiKey = process.env.GEMINI_API_KEY || cfg.apiKey;
      break;
    default:
      apiKey = cfg.apiKey;
  }
  
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server' });

  // build request to Chat Completions API
  const systemPrompt = cfg.systemPrompt || '';

  const fullMessages = [];
  if (systemPrompt) fullMessages.push({ role: 'system', content: systemPrompt });
  // append user-provided messages
  for (const m of messages) {
    // basic validation
    if (!m.role || !m.content) continue;
    fullMessages.push({ role: m.role, content: m.content });
  }

  try {
    // Use configurable Chat Completions endpoint
    const resp = await axios.post(`${cfg.apiBase}/chat/completions`, {
      model: cfg.model,
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 60000
    });

    const choice = resp.data.choices && resp.data.choices[0];
    const reply = (choice && choice.message && choice.message.content) ? choice.message.content : '';
    res.json({ reply });
  } catch (err) {
    console.error('chat error', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'AI API call failed', detail: err.response ? err.response.data : err.message });
  }
});

// Map /admin to admin.html so visiting /admin shows admin UI (single-page)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

// default root -> index.html is served by static middleware

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/ to view chat page`);
});