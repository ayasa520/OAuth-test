# OAuth-test

这个项目借鉴(chao xi)了https://github.com/walinejs/auth, 不过是用 TypeScript 和 Express.js 写的

## Github
- Redirect URL: `<a href="<serverUrl>/github?redirect=&state=">Login with Github</a>`
- Get user info: GET `<serverUrl>/github?code=`


两个环境变量 `GITHUB_ID` and `GITHUB_SECRET`, 即 Github [Settings/Developer/settings](https://github.com/settings/developers) 里
OAuth Apps 的 `Client ID` 和 `Client Secret`, 下面 `Authorization callback URL` 写该项目部署的地址即可, 如 `https://oauth-test-beta.vercel.app`

在接入登录的应用中访问 `Redirect URL` 获得 code(此处就是 URL 中的查询参数), 通过 code 可以获取 Github 用户的信息, 然后再用这些信息集成进原有登录系统什么的

