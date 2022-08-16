import { UserInfo } from "../model/UserInfo";
import { ParsedQs } from "qs";

export abstract class Base {
  protected constructor(
    protected query: ParsedQs,
    protected protocol: string,
    protected host: string
  ) {}

  public getCompleteUrl(url = ""): string {
    if (!/^\//.test(url)) {
      url = "/" + url;
    }
    return this.protocol + "://" + this.host + url;
  }
  public async getUserInfo(): Promise<string | UserInfo> {
    const { code='', redirect, state='' } = this.query;
    if (!code) {
      return this.getRedirectUrl();
    }

    if (redirect) {
      const params = { code: code.toString(), state: state.toString() };
      return `${redirect}${
        (redirect as string).includes("?") ? "&" : "?"
      }${new URLSearchParams(params).toString()}`;
    }
    const accessToken = await this.getAccessToken(code.toString());
    return await this.getUserInfoByToken(accessToken);
  }
  abstract getAccessToken(code: string): Promise<string>;
  abstract getUserInfoByToken(accessToken: string): Promise<UserInfo>;
  abstract getRedirectUrl(): string;
}
