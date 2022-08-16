import { Base } from "./Base";
import { UserInfo } from "../model/UserInfo";
import axios from "axios";
import { ParsedQs } from "qs";

const OAUTH_URL = "https://github.com/login/oauth/authorize";
const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
const USER_INFO_URL = "https://api.github.com/user";
const USER_EMAILS = "https://api.github.com/user/emails";

const { GITHUB_ID = "", GITHUB_SECRET = "" } = process.env;
export default class extends Base {
  constructor(query: ParsedQs, protocol: string, host: string) {
    super(query, protocol, host);
  }
  public getRedirectUrl(): string {
    const { redirect, state } = this.query;
    const redirectUrl = `${this.getCompleteUrl(
      "/github"
    )}?${new URLSearchParams({
      redirect: redirect as string,
      state: state as string,
    }).toString()}`;

    return `${OAUTH_URL}?${new URLSearchParams({
      client_id: GITHUB_ID,
      redirect_uri: redirectUrl,
      scope: "read:user,user:email",
    })}`;
  }

  public async getAccessToken(code: string): Promise<string> {
    const params = {
      client_id: GITHUB_ID,
      client_secret: GITHUB_SECRET,
      code,
    };

    const response = await axios.post(ACCESS_TOKEN_URL, params, {
      headers: { Accept: "application/json" },
      // proxy: {
      //   protocol: "http",
      //   host: "127.0.0.1",
      //   port: 7890,
      // },
    });
    const { access_token } = response.data;
    return access_token;
  }

  public async getUserInfoByToken(accessToken: string): Promise<UserInfo> {
    const axiosResponse = await axios.get(USER_INFO_URL, {
      headers: {
        "User-Agent": "@rikka",
        Authorization: "token " + accessToken,
      },
      // proxy: {
      //   protocol: "http",
      //   host: "127.0.0.1",
      //   port: 7890,
      // },
    });
    const userInfo: {
      login: string;
      blog: string;
      name: string;
      email: string;
      url: string;
      avatar_url: string;
    } = axiosResponse.data
    if (!userInfo.email) {
      const response = await axios.get(USER_EMAILS, {
        headers: {
          "User-Agent": "@waline/auth",
          Authorization: "token " + accessToken,
        },
        //
        // proxy: {
        //   protocol: "http",
        //   host: "127.0.0.1",
        //   port: 7890,
        // },
      });
      const emails = response.data;
      if (emails.length) {
        userInfo.email = emails[0].email;
      }
    }
    return {
      id: userInfo.login,
      name: userInfo.name || userInfo.login,
      email: userInfo.email,
      url: userInfo.blog,
      avatar: userInfo.avatar_url,
    };
  }
}
