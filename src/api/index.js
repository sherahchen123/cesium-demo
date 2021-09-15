/*
 * @Author: chenxiaoxuan
 * @Date: 2021-09-15 09:33:22
 * @LastEditTime: 2021-09-15 14:02:32
 * @LastEditors: chenxiaoxuan
 * @Description: 
 */
import axios from "axios";
import Hjson from "hjson";
// import HttpRequest from "./HttpRequest";
export async function getLayerInfo() {
  try {
    const res =  await axios.get("/static/layer.hjson").catch((err) => { throw new Error(err.message); });
    return Hjson.parse(res.data);
    // const res = await HttpRequest.get("/static/layer.hjson", {
    //   // 阻止 axios 自动 JSON.parse
    //   // refer https://github.com/axios/axios/issues/907
    //   transformResponse: undefined,
    //   // 不缓存 hjson
    //   headers: {
    //     "Cache-Control": "no-cache, no-store, must-revalidate"
    //   }
    // }).catch((err) => { throw new Error(err.message); });
    // const { data } = res;
    // return Hjson.parse(data);
  } catch(err) {
    throw new Error(err.message);
  }
}
