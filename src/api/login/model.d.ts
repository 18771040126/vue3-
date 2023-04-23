declare namespace API {
  /**
   * @type 登录入参
   */
    type LoginParams = {
      username: string
      password: string
    }
  /**
   * @type 登录出参
   */
  type LoginResult = {
    token: string
    avatar: string
    realName: string
    phone: string
    menuList: string[],
    functionList: string[]
  }
}