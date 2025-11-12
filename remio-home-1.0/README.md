# 个人主页

- Next.js构建，服务端渲染，较好的SEO
- 部署方便，支持docker，vercel快速部署
- 配置方便，支持在线配置，文件配置
- Pwa 支持，也可进行配置
- 移动端适配...



# 参数说明：

| 字段           | 类型                                          | 必填 | 说明                                                                          |
| -------------- | --------------------------------------------- | ---- | ----------------------------------------------------------------------------- |
| name           | string                                        | 是   | 站点标题                                                                      |
| favicon        | string                                        | 否   | 站点图标                                                                      |
| domain         | string                                        | 否   | 站点链接                                                                      |
| keywords       | string                                        | 否   | 站点关键词（SEO用）                                                           |
| description    | string                                        | 否   | 站点描述性信息（SEO用）                                                       |
| avatarConfig   | [AvatarConfig](#AvatarConfig-类型说明)        | 否   | 主页头像相关配置                                                              |
| layoutConfig   | [LayoutConfig](#LayoutConfig-类型说明)        | 否   | 布局相关的一些配置                                                            |
| globalStyle    | [GlobalStyle](#GlobalStyle-类型说明)          | 否   | 全局样式相关的一些配置，如字体，主题                                          |
| bgConfig       | [BgConfig](#BgConfig-类型说明)                | 否   | 背景相关的一些配置                                                            |
| subTitle       | string                                        | 否   | 站点头像下的次标题。可填入一言API，例如：`https://v1.hitokoto.cn?c=a&c=b&c=c` |
| footer         | string/[FooterConfig](#FooterConfig-类型说明) | 否   | 底部设置项                                                                    |
| links          | [Link[]](#link-类型说明)                      | 是   | 社交媒体的链接                                                                |
| sites          | [Site[]](#site-类型说明)                      | 是   | 项目或者其他站点链接                                                          |
| sitesConfig    | [SitesConfig](#SitesConfig-类型说明)          | 否   | sites 渲染组件配置项                                                          |
| subTitleConfig | [SubTitleConfig](#SubTitleConfig-类型说明)    | 否   | 次标题渲染组件配置项                                                          |
| socialConfig   | [SocialConfig](#SocialConfig-类型说明)        | 否   | 社交媒体的链接渲染组件配置项                                                  |
| sliders        | [SlidersConfig](#SlidersConfig-类型说明)      | 否   | 技能加点组件配置项                                                            |
| resources      | [Resources](#Resources-类型说明)              | 否   | 加在第三方资源及添加一些自定义body                                            |

#### AvatarConfig 类型说明

| 字段         | 类型    | 必填 | 说明                                                                |
| ------------ | ------- | ---- | ------------------------------------------------------------------- |
| hidden       | boolean | 否   | 是否隐藏该组件，默认`false`                                         |
| src          | string  | 否   | 头像资源路径                                                        |
| size         | number  | 否   | 头像尺寸                                                            |
| round        | string  | 否   | 圆角程度，可选`full`,`3xl`,`xl`,`sm`,`md`和`lg`，默认`full`         |
| hoverAnimate | string  | 否   | 头像`hover` 时效果动画，可选`top` 和 `rotate`，默认为空没有动画     |
| style        | string  | 否   | 头像效果动画，可选`glint` 和 `wave`，默认为空没有动画               |
| aloneRight   | boolean | 否   | 头像单独在右侧，`layoutConfig.style`为`horizontal`生效，默认`false` |

#### BgConfig 类型说明

| 字段            | 类型            | 必填 | 说明                                                                                                   |
| --------------- | --------------- | ---- | ------------------------------------------------------------------------------------------------------ |
| bg              | string/string[] | 否   | pc背景资源链接                                                                                         |
| mbg             | string/string[] | 否   | 移动端背景资源链                                                                                       |
| audio           | string          | 否   | 背景音乐                                                                                               |
| bgStyle         | string          | 否   | 背景飘浮风格。可选值：`sakura`(樱花) 或 `snow`：(雪花)，也可自行填写飘浮物资源图片                     |
| blur            | string          | 否   | 背景模糊程度，可选`none`,`sm`,`md`和`lg`，默认`sm`                                                     |
| cardOpacity     | number          | 否   | 卡片的透明度，`0-1`之间，默认`0.1`                                                                     |
| carousel        | boolean         | 否   | 开启图片轮播，背景图片数大于1生效，默认`true`                                                          |
| carouselGap     | number          | 否   | 图片轮播间隔时间，单位s(秒)，默认`5s`，最小`3s`                                                        |
| transitionTime  | number          | 否   | 图片轮播过渡时间，单位s(秒)，默认`0.7s`                                                                |
| transitionStyle | string          | 否   | 图片轮播过渡动画，可选`default`,`toBottom`,`toTop`,`toIn`,`toInOut`,`toRight`和`toLeft`，默认`default` |
| autoAnimate     | boolean         | 否   | 背景图动画，默认`false`不开启                                                                          |

#### LayoutConfig 类型说明

| 字段          | 类型    | 必填 | 说明                                                  |
| ------------- | ------- | ---- | ----------------------------------------------------- |
| istTransition | boolean | 否   | 是否开启渲染过渡动画，默认开启                        |
| gapSize       | string  | 否   | 布局，可选`sm`,`md`和`lg`，默认`sm`                   |
| style         | string  | 否   | 布局风格，可选`horizontal`,`vertical`，默认`vertical` |

#### GlobalStyle 类型说明

| 字段         | 类型                             | 必填 | 说明                                                                                               |
| ------------ | -------------------------------- | ---- | -------------------------------------------------------------------------------------------------- |
| fonts        | [FontItem[]](#FontItem-类型说明) | 否   | 自定义字体数组                                                                                     |
| fallback     | string                           | 否   | 次要字体，优先级低于自定义字体，做字体垫片                                                         |
| primaryColor | string                           | 否   | 主题色，十六进制颜色值，默认`#229fff`（蓝色），~没啥大用的样子~                                    |
| theme        | string                           | 否   | 主题设置，可选：`dark`,`light`,`switcher`。`switcher`为开启切换按钮，其他的为固定主题，默认`light` |
| weather      | boolean                          | 否   | 是否显示地理天气，默认`false`不显示                                                                |

#### FontItem 类型说明

| 字段 | 类型   | 必填 | 说明                       |
| ---- | ------ | ---- | -------------------------- |
| src  | string | 否   | 字体文件资源链接           |
| name | string | 否   | 给该字体取个名称，最好英文 |

#### FooterConfig 类型说明

| 字段       | 类型    | 必填 | 说明                                                               |
| ---------- | ------- | ---- | ------------------------------------------------------------------ |
| text       | string  | 否   | 展示文字                                                           |
| url        | string  | 否   | 展示文字的链接地址，点击可跳转                                     |
| ICP        | string  | 否   | 备案号，填写后会链接到工信部                                       |
| MPSICP     | string  | 否   | 公安部备案号，填写后会链接到公安部                                 |
| direction  | string  | 否   | 排列方式，可选`col`,`row`，`col-reverse`和`row-reverse`，默认`col` |
| isExternal | boolean | 否   | 是否展示链接图标，默认`false`                                      |

#### Link 类型说明

| 字段  | 类型   | 必填 | 说明     |
| ----- | ------ | ---- | -------- |
| title | string | 是   | 标题     |
| color | string | 否   | 颜色     |
| url   | string | 是   | 链接     |
| icon  | string | 否   | 图标链接 |

#### Site 类型说明

| 字段  | 类型   | 必填 | 说明                                                              |
| ----- | ------ | ---- | ----------------------------------------------------------------- |
| icon  | string | 是   | 图标链接                                                          |
| title | string | 是   | 标题                                                              |
| url   | string | 否   | 链接，`url` 为空，该元素在数组中后面的元素都会展示在弹框`modal`中 |
| desc  | string | 否   | 描述                                                              |

#### SubTitleConfig 类型说明

| 字段         | 类型           | 必填 | 说明                                                                                         |
| ------------ | -------------- | ---- | -------------------------------------------------------------------------------------------- |
| heart        | boolean        | 否   | 是否显示右上角爱心图标，默认：`true`                                                         |
| typing       | boolean        | 否   | 是否开启打字效果，默认：`false`                                                              |
| loading      | string/boolean | 否   | 出现动画效果，可选`wave`，默认为空没有动画                                                   |
| loopTyping   | boolean        | 否   | 是否支持切换一言，`typing`为`true`生效，默认：`false`                                        |
| shadow       | boolean        | 否   | 是否显示文字阴影效果，默认：`false`                                                          |
| typingGap    | number         | 否   | 一言间隔多久开始清除，单位秒(s)，默认为10s，最小3s                                           |
| typingCursor | boolean        | 否   | 是否展示打字光标，`typing`为`true`生效，默认：`true`                                         |
| showFrom     | boolean        | 否   | 是否显示一言来源，默认：`true`                                                               |
| style        | string         | 否   | `layoutConfig.style` 为 `horizontal` 生效，样式风格，可选，`desc`,`default`，默认：`default` |
| desc         | string         | 否   | `subTitleConfig.style` 为 `desc` 生效，描述，如果需要分行展示以`;`分隔，下同                 |
| content      | string         | 否   | `subTitleConfig.style` 为 `desc` 生效，详细描述内容                                          |
| gapDelay     | number         | 否   | 文字出现间隔，单位秒，默认`0.05`秒                                                           |

#### SocialConfig 类型说明

| 字段    | 类型           | 必填 | 说明                                       |
| ------- | -------------- | ---- | ------------------------------------------ |
| ripple  | boolean        | 否   | 是否开启涟漪动画，默认：`true`             |
| loading | string/boolean | 否   | 出现动画效果，可选`wave`，默认为空没有动画 |

#### SlidersConfig 类型说明

| 字段   | 类型                         | 必填 | 说明                             |
| ------ | ---------------------------- | ---- | -------------------------------- |
| data   | [Slider[]](#Slider-类型说明) | 否   | 数据数组                         |
| title  | string                       | 否   | 标题，为空不展示                 |
| hidden | boolean                      | 否   | 是否隐藏该组件                   |
| color  | string                       | 否   | 进度条自定义颜色，默认白色`#fff` |
| column | number                       | 否   | 一行展示几列，2-4的范围，默认`2` |

#### Slider 类型说明

| 字段  | 类型   | 必填 | 说明                    |
| ----- | ------ | ---- | ----------------------- |
| title | string | 否   | 标题                    |
| color | string | 否   | 颜色                    |
| value | number | 否   | 技能掌握程度，0-100之间 |
| icon  | string | 否   | 图标链接                |

#### 关于icon

目前内置有图标：

```js
    github, twitter, qq, telegram, email, steam, bilibili, discord, instargram, x,
```

`icon` 字段填写图标名即可使用，如果没有你需要的，也可以填写图标的资源链接使用

#### SitesConfig 类型说明

| 字段       | 类型    | 必填 | 说明                                                                   |
| ---------- | ------- | ---- | ---------------------------------------------------------------------- |
| cardStyle  | string  | 否   | 站点卡片风格，可选`default`,`flip`                                     |
| hoverBlur  | boolean | 否   | hover状态下是否模糊                                                    |
| hoverScale | boolean | 否   | hover状态下是否调整比例                                                |
| hoverFlip  | boolean | 否   | 卡片是否可翻转，默认`true`，`cardStyle`为`flip`生效                    |
| direction  | string  | 否   | 卡片内容排列方式，可选`col`和`row`，默认`col`，`cardStyle`为`flip`生效 |
| modal      | boolean | 否   | 是否显示`modal`                                                        |
| modalTips  | string  | 否   | `modal`的提示语                                                        |
| modalTitle | string  | 否   | `modal`的标题                                                          |

#### Resources 类型说明

| 字段     | 类型     | 必填 | 说明                       |
| -------- | -------- | ---- | -------------------------- |
| css      | string[] | 否   | 引入外部css                |
| js       | string[] | 否   | 引入外部js                 |
| bodyHtml | string   | 否   | 自定义添加一些body内的html |

### 本地启动

安装依赖

```js
pnpm install // 需要先安装pnpm: https://pnpm.io/
```

本地启动

```js
pnpm dev
```

打包

```js
pnpm build
```

## 补充

在你部署后，在配置页面输入密码后，可在部署域名后面加上`/api/config`查看目前的配置信息
