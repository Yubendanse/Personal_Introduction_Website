// 管理后台前端逻辑

const loginBox = document.getElementById('loginBox');
const configPanel = document.getElementById('configPanel');

const adminPassword = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');

const providerSelect = document.getElementById('provider');
const apiKeyInput = document.getElementById('apiKey');
const apiBaseInput = document.getElementById('apiBase');
const modelInput = document.getElementById('model');
const systemPromptInput = document.getElementById('systemPrompt');
const welcomeMessageInput = document.getElementById('welcomeMessage');

const saveBtn = document.getElementById('saveBtn');

let token = localStorage.getItem('ADMIN_TOKEN') || '';

function show(msg) {
  alert(msg);
}

// -------------------- 登录 --------------------
loginBtn.addEventListener('click', async () => {
  const password = adminPassword.value.trim();
  if (!password) return show('请输入密码');

  try {
    const resp = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await resp.json();

    if (!resp.ok) return show(data.error || '登录失败');

    token = data.token;
    localStorage.setItem('ADMIN_TOKEN', token);

    loginBox.classList.add('hidden');
    configPanel.classList.remove('hidden');

    await loadConfig();
  } catch (err) {
    console.error(err);
    show('网络错误');
  }
});

// -------------------- 加载配置 --------------------
async function loadConfig() {
  try {
    const resp = await fetch('/api/config', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    if (!resp.ok) {
      show('Token 失效，请重新登录');
      localStorage.removeItem('ADMIN_TOKEN');
      location.reload();
      return;
    }

    providerSelect.value = data.provider || 'openai';
    apiBaseInput.value = data.apiBase || getDefaultApiBase(data.provider || 'openai');
    modelInput.value = data.model || '';
    systemPromptInput.value = data.systemPrompt || '';
    welcomeMessageInput.value = data.welcomeMessage || '';

    if (data.apiKeySet) {
      apiKeyInput.placeholder = "（已设置，此处留空表示不修改）";
    }

  } catch (err) {
    console.error(err);
    show('加载配置出错');
  }
}

// 根据提供商获取默认API基础URL
function getDefaultApiBase(provider) {
  switch(provider) {
    case 'openai':
      return 'https://api.openai.com/v1';
    case 'deepseek':
      return 'https://api.deepseek.com/v1';
    case 'anthropic':
      return 'https://api.anthropic.com/v1';
    case 'gemini':
      return 'https://generativelanguage.googleapis.com/v1beta';
    default:
      return 'https://api.openai.com/v1';
  }
}

// 当提供商改变时，自动更新API基础URL
providerSelect.addEventListener('change', () => {
  const provider = providerSelect.value;
  apiBaseInput.value = getDefaultApiBase(provider);
});

// -------------------- 保存配置 --------------------
saveBtn.addEventListener('click', async () => {
  const body = {
    provider: providerSelect.value,
    apiBase: apiBaseInput.value.trim(),
    model: modelInput.value.trim(),
    systemPrompt: systemPromptInput.value.trim(),
    welcomeMessage: welcomeMessageInput.value.trim(),
  };

  // 仅当输入了 API Key 才更新
  if (apiKeyInput.value.trim()) {
    body.apiKey = apiKeyInput.value.trim();
  }

  try {
    const resp = await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    if (!resp.ok) return show(data.error || '保存失败');

    show('保存成功');
    apiKeyInput.value = '';
    await loadConfig();
  } catch (err) {
    console.error(err);
    show('保存失败');
  }
});

// 如果已有 token 自动尝试加载配置
if (token) {
  loginBox.classList.add('hidden');
  configPanel.classList.remove('hidden');
  loadConfig();
}