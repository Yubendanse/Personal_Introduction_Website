/*
  简洁前端聊天逻辑：
  - 管理本地 messages 数组（role/content）
  - 发送请求到 /api/chat
  - 渲染对话到聊天窗口
*/
/* ===============================
   public/app.js
   高级视觉版 AI Chat 前端逻辑
   ===============================*/

const messagesContainer = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatWindow = document.getElementById("chatWindow");
const clearBtn = document.getElementById("clearBtn");

let messages = [];

// -----------------------------
// 工具函数
// -----------------------------

// 当前时间字符串（HH:MM）
function getCurrentTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

// 渲染单条消息
function renderMessage(msg) {
  const row = document.createElement("div");
  row.className = `msg-row ${msg.role}`;
  row.style.animationDelay = `${messages.indexOf(msg) * 60}ms`;

  // 头像
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  
  if (msg.role === "user") {
    avatar.textContent = "我";
  } else {
    // 使用图片替代表情符号
    const img = document.createElement("img");
    img.src = "https://my-page-1321050508.cos.ap-shanghai.myqcloud.com/%E4%B8%AA%E4%BA%BA%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87/avatar.jpg"; // 替换为实际的图片URL
    img.alt = "AI";
    avatar.appendChild(img);
  }

  // 气泡
  const bubble = document.createElement("div");
  bubble.className = "bubble";

  // meta：姓名 + 时间
  const meta = document.createElement("div");
  meta.className = "meta";

  const name = document.createElement("span");
  name.className = "name";
  name.textContent = msg.role === "user" ? "我" : "AI";

  const time = document.createElement("span");
  time.className = "time";
  time.textContent = msg.time || getCurrentTime();

  meta.appendChild(name);
  meta.appendChild(time);

  // 文本内容或 typing
  const text = document.createElement("div");
  text.className = "text";

  if(msg.typing){
    const typingDots = document.createElement("div");
    typingDots.className = "typing-dots";
    for(let i=0;i<3;i++){
      const dot = document.createElement("span");
      dot.className="dot";
      typingDots.appendChild(dot);
    }
    text.appendChild(typingDots);
  } else {
    text.textContent = msg.content;
  }

  bubble.appendChild(meta);
  bubble.appendChild(text);

  // 添加顺序：AI 左 / 用户 右
  if(msg.role==="user"){
    row.appendChild(bubble);
    row.appendChild(avatar);
  } else {
    row.appendChild(avatar);
    row.appendChild(bubble);
  }

  messagesContainer.appendChild(row);
  scrollToBottom();
}

// 渲染所有消息
function renderAllMessages() {
  messagesContainer.innerHTML = "";
  messages.forEach(msg => renderMessage(msg));
}

// 滚动到底部
function scrollToBottom(){
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// -----------------------------
// 发送消息逻辑
// -----------------------------
async function sendMessage(){
  const content = input.value.trim();
  if(!content) return;
  input.value = "";

  // 添加用户消息
  const userMsg = { role: "user", content, time: getCurrentTime() };
  messages.push(userMsg);
  renderMessage(userMsg);

  // 添加 AI typing 消息
  const aiTypingMsg = { role: "assistant", typing:true };
  messages.push(aiTypingMsg);
  renderMessage(aiTypingMsg);

  try {
    const response = await fetch("/api/chat", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ messages })
    });
    const data = await response.json();

    // 移除 typing
    const typingIndex = messages.indexOf(aiTypingMsg);
    if(typingIndex !== -1) messages.splice(typingIndex,1);

    // 添加 AI 消息
    const aiMsg = { role:"assistant", content:data.reply || "AI 没有回答", time:getCurrentTime() };
    messages.push(aiMsg);
    renderAllMessages();
  } catch(err){
    console.error(err);
    const errorMsg = { role:"assistant", content:"AI 服务暂不可用", time:getCurrentTime() };
    messages.push(errorMsg);
    renderAllMessages();
  }
}

// -----------------------------
// 事件绑定
// -----------------------------
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e)=>{
  if(e.key==="Enter" && !e.shiftKey){
    e.preventDefault();
    sendMessage();
  }
});

// 清空对话
clearBtn.addEventListener("click", ()=>{
  messages=[];
  renderAllMessages();
  input.focus();
});

// -----------------------------
// 初始提示（可选）
// -----------------------------
async function loadWelcomeMessage() {
  try {
    const response = await fetch("/api/welcome");
    const data = await response.json();
    messages.push({
      role:"assistant",
      content: data.welcomeMessage,
      time:getCurrentTime()
    });
    renderAllMessages();
  } catch (err) {
    console.error("Failed to load welcome message", err);
    // Fallback to default message
    messages.push({
      role:"assistant",
      content:"你好！我是 AI 聊天助手。请在下方输入你的问题。",
      time:getCurrentTime()
    });
    renderAllMessages();
  }
}

// Load welcome message when page loads
loadWelcomeMessage();
