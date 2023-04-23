import fetch from '@/utils/http'
/**
 * @function 登录
 */
export const loginServer = (data: API.LoginParams):Promise<API.LoginResult> => {
  return fetch({
    data,
    method: "POST",
    url: '../../../public/data/login.json'
  })
}

/**
 * @function 登录
 */
export const logOutServer = () => {
  return fetch({
    data: {},
    method: "POST",
  })
}