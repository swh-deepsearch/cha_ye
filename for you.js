// js/app.js

// 目标发布日期：UTC 2028-10-28 00:00:00
const RELEASE_DATE = new Date("2028-10-28T00:00:00Z");

// DOM 元素引用
const editorContainer = document.getElementById("editor-container");
const publishedContent = document.getElementById("published-content");
const letterEditor = document.getElementById("letter-editor");
const saveButton = document.getElementById("save-button");
const downloadButton = document.getElementById("download-button");
const letterDisplay = document.getElementById("letter-display");

// 页面加载时执行
window.addEventListener("DOMContentLoaded", () => {
  checkRelease();   // 检查是否可展示已发布内容
  loadDraft();      // 如果 localStorage 中已有草稿，回填到编辑框
});

// 判断当前时间是否达到或超过发布日期
function checkRelease() {
  const now = new Date();
  if (now.getTime() >= RELEASE_DATE.getTime()) {
    // 到达或超过发布时刻：隐藏编辑区，显示展示区
    editorContainer.classList.add("hidden");
    publishedContent.classList.remove("hidden");
    renderPublishedLetter();
  } else {
    // 未到发布时刻：显示编辑区，隐藏展示区
    editorContainer.classList.remove("hidden");
    publishedContent.classList.add("hidden");
  }
}

// 从 localStorage 读取草稿并回填
function loadDraft() {
  try {
    const saved = localStorage.getItem("chatLetterLight");
    if (saved) {
      letterEditor.value = saved;
    }
  } catch (err) {
    console.error("读取本地存储出错：", err);
  }
}

// 保存到 localStorage
saveButton.addEventListener("click", () => {
  const content = letterEditor.value.trim();
  if (!content) {
    alert("请输入信件内容后再保存。");
    return;
  }
  try {
    localStorage.setItem("chatLetterLight", content);
    alert("草稿已保存到本地 (localStorage) ！");
  } catch (err) {
    console.error("保存到本地存储失败：", err);
    alert(
      "保存失败，可能是浏览器不支持 localStorage 或已被禁用。如需备份，请点击“下载为 TXT”按钮。"
    );
  }
});

// 渲染已发布内容
function renderPublishedLetter() {
  const saved = localStorage.getItem("chatLetterLight");
  if (saved) {
    letterDisplay.textContent = saved;
  } else {
    letterDisplay.textContent = "暂无信件内容。";
  }
}

// 点击“下载为 TXT”时，将内容导出为文本文件
downloadButton.addEventListener("click", () => {
  const content = letterEditor.value.trim();
  if (!content) {
    alert("当前编辑框为空，无法下载。");
    return;
  }
  // 生成 Blob 并创建下载链接
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  // 建议文件名格式：letter-2028-10-28.txt
  const filename = "letter-" + new Date().toISOString().split("T")[0] + ".txt";
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
