# Slang Master - 英语俚语学习神器 (MVP 版) 🎨

**Slang Master** 是一款专为英语学习者设计的俚语学习 App。它通过直观的“闪卡”交互和富有趣味性的插画风格界面，帮助用户掌握地道的美式/英式俚语。

本项目目前处于 **MVP (Minimum Viable Product)** 阶段，采用循序渐进的开发模式，最终目标是发布至 **Apple App Store**。

---

## ✨ MVP 版本核心功能

- **插画风格 UI (Neubrutalism)**: 采用粗黑边框、高对比度配色和动态背景，营造轻松愉快的学习氛围。
- **互动闪卡**: 
  - **正面**: 俚语词汇与分类标签。
  - **背面**: 详细定义与地道例句。
- **平滑动画**: 使用 `Framer Motion` 实现卡片 3D 翻转效果。
- **随机探索**: 一键切换下一个俚语，保持学习的新鲜感。
- **响应式设计**: 完美适配移动端和网页端。

---

## 🛠 技术栈

- **前端框架**: [React 18](https://reactjs.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **样式处理**: [Tailwind CSS](https://tailwindcss.com/) (新布鲁塔主义设计风格)
- **动画库**: [Framer Motion](https://www.framer.com/motion/)
- **图标库**: [Lucide React](https://lucide.dev/)
- **字体**: [Nunito](https://fonts.google.com/specimen/Nunito) (Google Fonts)

---

## 🚀 迭代路线图 (Roadmap)

### 第一阶段：MVP 完善 (当前)
- [x] 核心闪卡功能
- [x] 响应式插画风格界面
- [x] 模拟数据集 (Mock Data)

### 第二阶段：交互与本地存储
- [ ] **掌握进度管理**: 标记“已掌握”或“需复习”，数据持久化至 `LocalStorage`。
- [ ] **分类筛选**: 按场景（如：职场、约会、社交媒体）过滤俚语。
- [ ] **TTS 语音**: 集成文字转语音，练习地道发音。

### 第三阶段：后端与同步
- [ ] **用户系统**: 进度跨设备同步。
- [ ] **内容云端化**: 动态更新俚语库。
- [ ] **AI 辅助**: 使用 AI 生成更多情境例句。

### 第四阶段：App Store 发布 🍎
- [x] **原生打包**: 使用 `Capacitor` 将 React 应用打包为 iOS/Android 原生应用。
- [ ] **推送通知**: 每日一词提醒。
- [ ] **商店上架**: 完成 App Store 审核并发布。

---

## 📱 移动端打包指南 (Mobile Build)

本项目使用 **Capacitor** 进行跨平台打包。

### 前置要求
- **iOS**: 需要 macOS 环境和 [Xcode](https://developer.apple.com/xcode/)。
- **Android**: 需要 [Android Studio](https://developer.android.com/studio)。

### 打包步骤

1. **构建 Web 资源**
   ```bash
   npm run build
   ```

2. **同步到原生平台**
   ```bash
   npx cap sync
   ```

3. **打开原生 IDE 编译**
   
   **iOS (Xcode)**:
   ```bash
   npx cap open ios
   ```
   *在 Xcode 中选择模拟器或真机，点击 "Run" 按钮即可。*

   **Android (Android Studio)**:
   ```bash
   npx cap open android
   ```
   *在 Android Studio 中等待 Gradle 同步完成，点击 "Run" 按钮。*

---

## 📦 快速开始

### 准备环境
- Node.js (建议 v18+)
- npm 或 yarn

### 安装运行
1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd flashcard_app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问预览**
   打开浏览器访问 `http://localhost:5173`。

---

## 📂 项目结构

- `src/components/`: 存放 UI 组件，如 `FlashCard.jsx`。
- `src/data/`: 存放静态数据，如 `slangData.js`。
- `src/App.jsx`: 页面主逻辑与布局。
- `src/index.css`: 全局样式与 Tailwind 配置。

---

*由 Trae 驱动开发，旨在让英语学习变得更简单、更有趣。*
