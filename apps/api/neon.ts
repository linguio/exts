import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // API 本阶段仅使用 Postgres，不启用其他托管服务。
  auth: false,
  // 保留初始化生成的分支策略。
  branch: (branch) => {
    if (branch.isDefault) {
      // 默认分支沿用项目配置。
      return {};
    }
    if (!branch.exists) {
      // 新建非默认分支七天后自动过期。
      return { ttl: "7d" };
    }
    // 已有分支不作修改。
    return {};
  },
});
