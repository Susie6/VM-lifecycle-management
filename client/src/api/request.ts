import React from 'react';
import axios from 'axios';
/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url: string, params: any) {
  return new Promise((resolve, reject) => {
    axios.get(url, params).then(response => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject(response.data.msg);
      }
    }).catch(e => {
      reject(e);
    })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url: string, postData: any) {
  return new Promise((resolve, reject) => {
    axios.post(url, postData).then(response => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject(response.data.msg);
      }
    }).catch(e => {
      reject(e);
    })
  })
}