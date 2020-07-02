import axios from 'axios'

// 配置axios
axios.defaults.baseURL = '/api'
axios.defaults.timeout = 8000
axios.interceptors.response.use((res) => {
  return res.data;
}, (err) => {
  return Promise.reject(err)
})