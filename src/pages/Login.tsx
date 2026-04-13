import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { loginApi, registerApi } from '../api';
import '../styles/auth.css';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$/;

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [toastShow, setToastShow] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  
  // Error States
  const [loginEmailErr, setLoginEmailErr] = useState(false);
  const [loginPwErr, setLoginPwErr] = useState(false);
  const [signupNameErr, setSignupNameErr] = useState(false);
  const [signupEmailErr, setSignupEmailErr] = useState(false);
  const [signupPwErr, setSignupPwErr] = useState(false);
  const [signupMobileErr, setSignupMobileErr] = useState(false);
  
  const [showLoginPw, setShowLoginPw] = useState(false);

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showToast(message: string, type: 'success' | 'error') {
    setToastMsg(message);
    setToastType(type);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 3000);
  }

 const handleGoogleLogin = () => {
  // ✅ https:// lagana compulsory hai
  window.location.href = 'https://quantitymeasurementapp-production-5687.up.railway.app/oauth2/authorization/google';
};

  async function doLogin() {
    let valid = true;
    if (!isValidEmail(loginEmail)) { setLoginEmailErr(true); valid = false; } else { setLoginEmailErr(false); }
    if (!PASSWORD_REGEX.test(loginPw)) { setLoginPwErr(true); valid = false; } else { setLoginPwErr(false); }

    if (valid) {
      try {
        const data = await loginApi(loginEmail, loginPw);
        localStorage.setItem('qm_token', data.token);
        localStorage.setItem('qm_user', loginEmail);
        showToast('🎉 Login Successful!', 'success');
        navigate('/dashboard');
      } catch (err) {
        showToast('❌ Invalid email or password!', 'error');
      }
    }
  }

  async function doSignup() {
    let valid = true;
    if (!signupName) { setSignupNameErr(true); valid = false; } else { setSignupNameErr(false); }
    if (!isValidEmail(signupEmail)) { setSignupEmailErr(true); valid = false; } else { setSignupEmailErr(false); }
    if (!PASSWORD_REGEX.test(signupPw)) { setSignupPwErr(true); valid = false; } else { setSignupPwErr(false); }
    if (!/^\d{10}$/.test(signupMobile)) { setSignupMobileErr(true); valid = false; } else { setSignupMobileErr(false); }

    if (valid) {
      try {
        await registerApi(signupName, signupEmail, signupPw, signupMobile);
        showToast('🎉 Registration Successful! Please Login.', 'success');
        setActiveTab('login');
      } catch (err: any) {
        showToast('❌ Registration failed!', 'error');
      }
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card">
        <div className="brand">
          <svg className="brand-icon" viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="28" y="0" width="24" height="12" rx="4" fill="#5dade2"/>
            <rect x="30" y="12" width="20" height="14" rx="2" fill="#85c1e9"/>
            <rect x="14" y="24" width="52" height="58" rx="10" fill="#aed6f1"/>
            <rect x="14" y="50" width="52" height="32" rx="0" fill="#5dade2" clipPath="url(#bottleClip)"/>
            <clipPath id="bottleClip"><rect x="14" y="24" width="52" height="58" rx="10"/></clipPath>
            <rect x="8" y="82" width="64" height="14" rx="4" fill="#e59866"/>
          </svg>
          <p className="brand-title">Quantity<br/>Measurement</p>
        </div>

        <div className="form-section">
          <div className="tabs">
            <div className={activeTab === 'login' ? 'tab active' : 'tab'} onClick={() => setActiveTab('login')}>Login</div>
            <div className={activeTab === 'signup' ? 'tab active' : 'tab'} onClick={() => setActiveTab('signup')}>Signup</div>
          </div>

          {activeTab === 'login' ? (
            <div className="form-panel active">
              <div className="field">
                <label>Email Id</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className={loginEmailErr ? 'error' : ''}/>
              </div>
              <div className="field" style={{position: 'relative'}}>
                <label>Password</label>
                <input type={showLoginPw ? 'text' : 'password'} value={loginPw} onChange={(e) => setLoginPw(e.target.value)} className={loginPwErr ? 'error' : ''}/>
                <span style={{position:'absolute', right:'10px', top:'35px', cursor:'pointer', fontSize:'12px'}} onClick={() => setShowLoginPw(!showLoginPw)}>
                  {showLoginPw ? '👁️' : '🙈'}
                </span>
              </div>
              <button className="btn-submit" onClick={doLogin}>Login</button>
              
              <div style={{textAlign:'center', margin:'15px 0', color:'#888', fontSize:'12px'}}>OR</div>
              
              <button className="btn-google" onClick={handleGoogleLogin} style={{width:'100%', padding:'10px', background:'#fff', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="G"/> Sign in with Google
              </button>
            </div>
          ) : (
            <div className="form-panel active">
               <div className="field">
                <label>Full Name</label>
                <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} className={signupNameErr ? 'error' : ''} />
              </div>
              <div className="field">
                <label>Email Id</label>
                <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className={signupEmailErr ? 'error' : ''} />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" value={signupPw} onChange={(e) => setSignupPw(e.target.value)} className={signupPwErr ? 'error' : ''} />
              </div>
              <div className="field">
                <label>Mobile</label>
                <input type="tel" value={signupMobile} onChange={(e) => setSignupMobile(e.target.value)} className={signupMobileErr ? 'error' : ''} />
              </div>
              <button className="btn-submit" onClick={doSignup}>Signup</button>
            </div>
          )}
        </div>
      </div>
      <Toast message={toastMsg} show={toastShow} type={toastType} />
    </div>
  );
}

export default Login;