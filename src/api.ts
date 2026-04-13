import axios from 'axios';

// Ek hi jagah port manage karo taaki baar-baar change na karna pade
const PORT = 'https://quantitymeasurementapp-production-5687.up.railway.app'; 
const BASE_URL = `${PORT}/api/v1`;

/**
 * Helper function to get token and set headers
 */
const getConfig = () => {
  const token = localStorage.getItem('qm_token');
  return { 
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } 
  };
};

// --- Auth APIs ---

/**
 * Login API
 */
export const loginApi = async (email: string, pw: string) => {
  const response = await axios.post(`${PORT}/auth/user/login`, { 
    email: email, 
    password: pw 
  });
  return response.data;
};

/**
 * Registration API
 */
export const registerApi = async (name: string, email: string, pw: string, mobile: string) => {
  const response = await axios.post(`${PORT}/auth/user/register`, { 
    username: name,  // Backend expects 'username'
    email: email, 
    password: pw, 
    mobile: mobile 
  });
  return response.data;
};

// --- Quantity Operations APIs ---

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