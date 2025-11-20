# 36 Questions Relationship Tool

一个用 Next.js + Tailwind CSS 搭建的互动小工具。每个人在 36 题中勾选自己想聊的 n 个问题，系统会自动统计所有轮次的票数，并输出当晚 Top N 深聊题目。支持双击预览单题、复制当前轮选择、随时重置统计等功能，适合线下工作坊或线上语音房快速热场。

## ✨ 功能亮点

- 36 题按三个阶段分组，高亮色块方便快速定位
- 每轮/每人可选问题数 n 可调，实时展示当前已选数量
- 记录按钮一键累计票数，统计区自动排序输出当晚 Top N
- 双击题目呼出模态框预览，适合大屏展示
- Tailwind CSS + Next.js App Router，默认响应式适配手机/桌面

## 🛠 技术栈

- [Next.js 15 (App Router)](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🚀 本地开发

1. 安装依赖

   ```bash
   npm install
   ```

2. 启动开发服务器

   ```bash
   npm run dev
   ```

3. 在浏览器访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 可用脚本

| 命令          | 作用                         |
| ------------- | ---------------------------- |
| `npm run dev` | 本地开发 (热刷新)            |
| `npm run lint`| 运行 ESLint 保持代码规范     |
| `npm run build` | 生产构建 (Vercel 也会执行) |
| `npm run start` | 本地预览生产构建           |

## ☁️ 部署到 Vercel

1. 确保代码已经推送到 GitHub 仓库（参考下节）。
2. 登录 [Vercel](https://vercel.com/) 并点击 **Add New Project**。
3. 选择对应的 GitHub 仓库，保持默认设置：
   - Framework Preset: `Next.js`
   - Root Directory: `/`（当前项目根目录）
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. 点击 **Deploy**，首轮构建完成后即可得到线上链接。之后只要向 `main` 分支推送代码，Vercel 会自动触发重新部署。

## 📦 推送到 GitHub

如果这是一个全新仓库，可以按以下步骤初始化并推送：

```bash
git init
git add .
git commit -m "feat: build 36 questions tool"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

推送之后即可在 Vercel 里选择该仓库完成托管部署。

---

欢迎 fork / PR，或在 Issues 中提出新的协作想法。祝玩得开心 🧠💬
