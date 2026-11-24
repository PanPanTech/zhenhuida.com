# zhenhuida.com — 站点说明（给 Claude / 任何 AI 助手）

> 上级工作区规则：`E:\桌面\青海大宗贸易\CLAUDE.md`、`00_索引与协作规则/人机协作边界.md`。涉及氯酸钠 / 高氯酸钠 / 高氯酸钾时先读 `04_合规/氯酸盐_高氯酸盐出口哈萨克_管制合规清单.md`。
> 跨站 SEO 规范见 `E:\桌面\SEO`（总控）。

## 站点定位
- 青海臻汇达国际贸易有限公司（Qinghai Zhenhuida International Trade Co., Ltd.）的 B2B 官网：从青海（中国）向**中亚**供应工业化工原料。
- 语言：**俄语为主（默认 /ru/）**，英语次之（/en/）。没有中文站，`/zh/` 是 404，属正常。
- 市场：**哈萨克斯坦优先**，其次乌兹别克斯坦、俄罗斯；物流经霍尔果斯通道，条款 FCA / DAP。
- 目标：Google + **Yandex** 自然搜索、AI 搜索（ChatGPT / Perplexity / Google AI 模式 / Яндекс Нейро）引用 → 询盘（`/ru/contact/`）。

## 公司事实（页面、JSON-LD、llms.txt 必须一致；只改 `lib/catalog.ts` 一处）
- 产品 6 个：氯酸钠 NaClO₃、高氯酸钠 NaClO₄、轻质纯碱 Na₂CO₃、PVC 树脂、高氯酸钾 KClO₄（需事先评估）、有机肥（附加品类）
- 联系：电话 / WhatsApp / Telegram +86 139 2511 8851；邮箱见 `lib/catalog.ts` → `contact`
- 地址仅写“Цинхай, Китай / Qinghai, China”
- TODO（人工确认后再写）：成立年份、营业执照/危化品经营许可证编号、仓库/工厂地址、合作工厂名称、展会以外的客户案例

## 内容规范（化工品，硬规则）
- **规格只写目录参考值**：`lib/catalog.ts` 里的纯度（如氯酸钠 ≥ 99.5%、高氯酸钠 98.5%）是目录参考，页面上必须同时说明“批次规格以 COA 为准、逐单确认”。不新增任何没有供应商 COA/TDS 支撑的纯度、杂质、粒度数字。TODO：用实际供应商 COA 核对现有规格表。
- **不写未经证实的认证**：没有证书原件就不写 ISO、REACH、EAC/ТР ЕАЭС、GOST 符合性、“出口许可证”等。可以写“TDS / SDS / COA 可按询盘提供”。
- **危险品说法要准确**（依据 04_合规 清单，非法律意见）：
  - 氯酸钠 UN 1495、高氯酸钠 UN 1502、高氯酸钾 UN 1489，均为 **5.1 类氧化性物质**；中国《易制爆危险化学品名录》在列。
  - 不写“无需任何许可”“随时发货”“普通货运即可”这类话；可写“按危险品规定包装、标签（GHS）、随附 SDS，运输与单证逐单确认”。
  - 高氯酸钾：只写“需先评估用途与买方资质”，**不写**烟花/炸药/推进剂等用途，不做“可供货”承诺。
  - 买方资质、最终用途核查、禁止现金交易等合规要求可以写，措辞保持中性。
- **不承诺价格、交期、供货**：价格页（/prices/）是市场参考与测算器，必须保留“仅供参考，以正式报价为准”。报价、签约、付款一律人工。
- 不出现供应商/工厂名称和竞争对手品牌，除非人工确认。
- GEO 写法：每篇博客开头 2–3 句直接回答（俄语）+ `summary` 要点块；正文有对比 `table`；结尾 `faq`；`products` 字段关联产品页，文末导向询盘。
- 标题 ≤ 60 字符、description ≤ 155 字符；俄语为主，英语对应翻译，不要机器直译生硬句。

## 关键词策略
- 数据依据：GSC 2026-08 ~ 11 **0 曝光**（截至 2026-11-24，62 个网址全部“已发现 - 尚未编入索引”），暂无查询数据。先解决收录，再按 GSC/Yandex 数据调整。
- 初始主攻（俄语商业意图，TODO 待验证）：хлорат натрия купить / цена, перхлорат натрия, кальцинированная сода цена Казахстан, ПВХ смола цена, поставщик химического сырья из Китая, доставка через Хоргос。
- 不追：民用/烟火用途词、“炸药原料”类词（合规风险）。

## 技术
- Next.js 16 静态导出（`output: "export"`），**GitHub Actions 构建并部署到 GitHub Pages**（`.github/workflows/deploy.yml`）：push `main` 即上线；另有每天 19:05 UTC 的定时构建用于“按日期发布”博客。构建在 GitHub 上进行，**不是本地工作区**，所以只有已 push 的内容会上线（本地未提交的文章不会发布）。
- 域名：`https://www.zhenhuida.com`（`public/CNAME`，`lib/catalog.ts` → `origin`）；`zhenhuida.com` 301 到 www。`/` 是 meta refresh 到 `/ru/`。
- 多语言：`lib/i18n.ts`（ru 默认、en）；每页 canonical + hreflang（ru / en / x-default=ru），sitemap 带 alternates。加语言见 README。
- `sitemap.xml`、`robots.txt`、`/llms.txt` 由 `app/sitemap.ts`、`app/robots.ts`、`app/llms.txt/route.ts` 生成，新文章/产品自动进入。
- 结构化数据：首页 Organization，博客 BlogPosting，带 faq 的文章和价格页输出 FAQPage。
- 站点验证：Google 用 `public/google*.html`；Yandex 用 `public/yandex_1c8d9c6752dceeb9.html` + `siteVerification.yandex`。
- GA4：`G-4PXLT7QZ40`（媒体资源 561869109，账号 PanPanTech 414295528），代码在 `app/[lang]/layout.tsx`。
- 询盘表单：`components/inquiry-form.tsx` → `https://inquiry.panpantechnology.com/api/inquiries`（Zoho + 飞书，`lead_brand = Zhenhuida`）。
- ⚠️ 转化事件 TODO：表单成功提交时还**没有**发送 GA4 `generate_lead`；WhatsApp / Telegram / mailto 点击也没有 `contact_click`。加上后在 GA4 标为关键事件（GA4 设置由人操作）。
- 本地检查：`npm run build`（生成 `out/`）、`npm run lint`；`SHOW_DRAFTS=1 npm run build` 预览草稿。

## 工作流
- 新改动开分支 `seo/<主题>-<MMDD>` 或 `post/<slug>-<MMDD>`，build 通过后合并 `main`；不要直接改 `09_归档备份/`。
- 新文章：`content/blog/<slug>.json`（复制 `_template.json`），写完要 **commit + push**，否则不会上线。
- 改动前先 `git fetch` 看本地是否落后 origin；GitHub 上的 PR（如 Cursor 生成的）合并后本地要 pull。
- 每周看 GSC + Yandex Webmaster：收录数、“已发现未编入索引”数量、曝光高且 CTR < 1% 的页面优先改标题和开头。
- 对外发送、报价、签约、付款、删除文件，以及 GSC / GA4 / Yandex 设置，一律交给人确认。
