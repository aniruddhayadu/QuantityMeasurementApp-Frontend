import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

const getConfig = () => {
  const token = localStorage.getItem('qm_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};
// --- Auth APIs ---
export const loginApi = async (email: string, pw: string) => {
  // Yahan BASE_URL hata kar direct correct backend URL daala hai
  const response = await axios.post(`http://localhost:8080/auth/user/login`, { 
    email: email, 
    password: pw 
  });
  return response.data;
};

export const registerApi = async (name: string, email: string, pw: string, mobile: string) => {
  // Yahan bhi exact URL daala hai aur 'name' ko 'username' banaya hai
  const response = await axios.post(`http://localhost:8080/auth/user/register`, { 
    username: name,  // <-- Ye sabse zaroori change hai!
    email: email, 
    password: pw, 
    mobile: mobile 
  });
  return response.data;
};

// Quantity APIs
export const compareApi = async (payload: any) => {
  const response = await axios.post(`${BASE_URL}/quantities/compare`, payload, getConfig());
  return response.data;
};

export const convertApi = async (payload: any) => {
  const response = await axios.post(`${BASE_URL}/quantities/convert`, payload, getConfig());
  return response.data;
};

export const addApi = async (payload: any) => {
  const response = await axios.post(`${BASE_URL}/quantities/add`, payload, getConfig());
  return response.data;
};

export const subtractApi = async (payload: any) => {
  const response = await axios.post(`${BASE_URL}/quantities/subtract`, payload, getConfig());
  return response.data;
};

export const multiplyApi = async (payload: any) => {
  const response = await axios.post(`${BASE_URL}/quantities/multiply`, payload, getConfig());
  return response.data;
};

export const divideApi = async (payload: any) => {
  const response = await axios.post(`${BASE_URL}/quantities/divide`, payload, getConfig());
  return response.data;
};