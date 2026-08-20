# ordersystem-schemas

前后端共用的 Zod 请求/响应 schema，供 [`ordersystem_supabase`](https://github.com/hzgge1/ordersystem_supabase) 的 Edge Functions 和前端（管理端 `ordersystemmanager`、顾客端 `ordersystemclient`）共同依赖。

## 文档约定

**前端团队只能拿到这个包，看不到主仓库**（包括每个边缘函数自己的 `README.md`）。所以每个函数对应的 schema 文件（`src/schemas/**/*.ts`）**顶部必须写一段完整的使用说明注释**，不能只写"详见主仓库 README"——那样前端根本打不开那个链接。

新建或修改一个函数的 schema 文件时，头部注释按这个结构写：

```ts
// <函数名> — <一句话说明>
//
// Method: <METHOD> /functions/v1/<函数名>
// 调用方: 客户端 / 管理端 / 内部服务 / 通用
// 认证: <是否需要登录、需要什么权限>
//
// 非显而易见的行为：
// 1. ...
//
// 成功响应（<状态码>）：<结构或示例>
// 错误码：<状态码> (<触发场景>) / ...
```

不是每个字段都要照抄——普通的、字段名/类型已经能说明白的接口，几行足够；行为复杂、有隐藏规则的接口（比如涉及原子事务、权限分层、状态机）要写全。判断标准：**前端开发者只看这个文件，能不能正确调用这个接口、不用来问后端**。

`src/database.types.ts` 是 `supabase gen types typescript --local` 自动生成的数据库结构类型，不需要手写文档，但每次主仓库有 migration 落地、且改动的表是管理端会直连查询的，都要记得重新生成（见主仓库 `CLAUDE.md`），不能漏。
