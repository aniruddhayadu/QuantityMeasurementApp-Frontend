// ==========================================
// 1. LOCAL DATABASE & VALIDATION LOGIC
// ==========================================

function switchAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active-form'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById(`form-${tab}`).classList.add('active-form');
    document.getElementById('err-login').style.display = 'none'; 
}

function validatePassword() {
    const passInput = document.getElementById('sign-password');
    const errPass = document.getElementById('err-pass');
    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passInput.value);
    
    if(passInput.value && !isValid) {
        errPass.style.display = 'block'; passInput.classList.add('invalid');
    } else {
        errPass.style.display = 'none'; passInput.classList.remove('invalid');
    }
    return isValid;
}

function validatePhone() {
    const phoneInput = document.getElementById('sign-phone');
    const errPhone = document.getElementById('err-phone');
    const isValid = /^\d{10}$/.test(phoneInput.value);
    
    if(phoneInput.value && !isValid) {
        errPhone.style.display = 'block'; phoneInput.classList.add('invalid');
    } else {
        errPhone.style.display = 'none'; phoneInput.classList.remove('invalid');
    }
    return isValid;
}

function registerUser() {
    const name = document.getElementById('sign-name').value.trim();
    const email = document.getElementById('sign-email').value.trim();
    const phone = document.getElementById('sign-phone').value;
    const pass = document.getElementById('sign-password').value;

    if(!name || !email) {
        alert("Please fill all fields."); return;
    }

    if(validatePassword() && validatePhone()) {
        let usersDB = JSON.parse(localStorage.getItem('app_users')) || [];
        
        if(usersDB.find(u => u.email === email)) {
            alert("Account with this email already exists! Please Login.");
            switchAuthTab('login');
            return;
        }

        const newUser = { name: name, email: email, phone: phone, password: pass };
        usersDB.push(newUser);
        localStorage.setItem('app_users', JSON.stringify(usersDB));

        alert("Registration Successful! Please log in with your new credentials.");
        
        switchAuthTab('login');
        document.getElementById('log-email').value = email;
        document.getElementById('log-password').value = '';
    } else {
        alert("Please fix the validation errors (Red text) before submitting.");
    }
}

function loginUser() {
    const email = document.getElementById('log-email').value.trim();
    const pass = document.getElementById('log-password').value;
    const errLogin = document.getElementById('err-login');

    let usersDB = JSON.parse(localStorage.getItem('app_users')) || [];
    const validUser = usersDB.find(u => u.email === email && u.password === pass);

    if(validUser) {
        localStorage.setItem('active_user_name', validUser.name);
        errLogin.style.display = 'none';
        
        document.getElementById('user-greeting').innerText = `Hi, ${validUser.name}`;
        document.getElementById('auth-view').classList.remove('active');
        document.getElementById('dashboard-view').classList.add('active');
        loadUnits(); 
    } else {
        errLogin.innerText = "Invalid Email or Password. Have you signed up yet?";
        errLogin.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('active_user_name');
    document.getElementById('dashboard-view').classList.remove('active');
    document.getElementById('auth-view').classList.add('active');
    document.getElementById('log-password').value = '';
}

window.onload = () => {
    const activeUser = localStorage.getItem('active_user_name');
    if(activeUser) {
        document.getElementById('user-greeting').innerText = `Hi, ${activeUser}`;
        document.getElementById('auth-view').classList.remove('active');
        document.getElementById('dashboard-view').classList.add('active');
        loadUnits();
    }
};

// ==========================================
// 2. THE MATHEMATICAL ENGINE 
// ==========================================
const unitsData = {
    LengthUnit: { base: 'INCHES', factors: { 'FEET': 12, 'INCHES': 1, 'YARD': 36, 'CENTIMETRE': 0.393701 } },
    WeightUnit: { base: 'GRAM', factors: { 'KG': 1000, 'GRAM': 1, 'POUND': 453.592 } },
    VolumeUnit: { base: 'MILILITRE', factors: { 'LITRE': 1000, 'MILILITRE': 1, 'GALLON': 3785.41 } },
    TemperatureUnit: { base: 'CELSIUS', factors: { 'CELSIUS': 'C', 'FAHRENHEIT': 'F', 'KELVIN': 'K' } }
};

let currentCat = 'LengthUnit';
let currentAct = 'arithmetic';

function setCategory(cat) {
    currentCat = cat;
    document.querySelectorAll('.cat-card').forEach(el => el.classList.remove('active'));
    document.querySelector(`.cat-card[data-cat="${cat}"]`).classList.add('active');
    document.getElementById('result-area').classList.add('hidden');
    loadUnits();
}

function loadUnits() {
    const u1 = document.getElementById("unit1");
    const u2 = document.getElementById("unit2");
    const resU = document.getElementById("res-unit");
    
    u1.innerHTML = ""; u2.innerHTML = ""; resU.innerHTML = "";
    
    Object.keys(unitsData[currentCat].factors).forEach(u => {
        u1.add(new Option(u, u)); 
        u2.add(new Option(u, u)); 
        resU.add(new Option(u, u));
    });
}

function setAction(act) {
    currentAct = act;
    document.querySelectorAll('.action-btn').forEach(el => el.classList.remove('active'));
    document.querySelector(`.action-btn[data-act="${act}"]`).classList.add('active');
    document.getElementById('result-area').classList.add('hidden');
    
    const opSelect = document.getElementById("op-select");
    const opStatic = document.getElementById("op-static");
    const val2Input = document.getElementById("val2");
    const lblVal2 = document.getElementById("lbl-val2");
    
    if (act === 'arithmetic') {
        opSelect.classList.remove('hidden'); opStatic.classList.add('hidden');
        val2Input.readOnly = false; lblVal2.innerText = "VALUE 2";
    } else {
        opSelect.classList.add('hidden'); opStatic.classList.remove('hidden');
        if (act === 'convert') {
            opStatic.innerHTML = '<i class="fa-solid fa-arrow-right-arrow-left"></i>';
            val2Input.readOnly = true; lblVal2.innerText = "TARGET UNIT";
        } else {
            opStatic.innerText = 'VS';
            val2Input.readOnly = false; lblVal2.innerText = "VALUE 2";
        }
    }
}

function convertToBase(val, unit, cat) {
    if(cat === 'TemperatureUnit') {
        if(unit === 'FAHRENHEIT') return (val - 32) * 5/9;
        if(unit === 'KELVIN') return val - 273.15;
        return val; 
    }
    return val * unitsData[cat].factors[unit];
}

function convertFromBase(baseVal, unit, cat) {
    if(cat === 'TemperatureUnit') {
        if(unit === 'FAHRENHEIT') return (baseVal * 9/5) + 32;
        if(unit === 'KELVIN') return baseVal + 273.15;
        return baseVal;
    }
    return baseVal / unitsData[cat].factors[unit];
}

function calculate() {
    const v1 = parseFloat(document.getElementById('val1').value) || 0;
    const v2 = parseFloat(document.getElementById('val2').value) || 0;
    const u1 = document.getElementById('unit1').value;
    const u2 = document.getElementById('unit2').value;
    const resArea = document.getElementById('result-area');
    const resValue = document.getElementById('res-value');
    const resUnit = document.getElementById('res-unit');

    resArea.classList.remove('hidden');

    const base1 = convertToBase(v1, u1, currentCat);
    const base2 = convertToBase(v2, u2, currentCat);

    if (currentAct === 'compare') {
        // Evaluate the exact relationship
        let symbol = "";
        if (Math.abs(base1 - base2) < 0.001) {
            symbol = "=";
        } else if (base1 > base2) {
            symbol = ">";
        } else {
            symbol = "<";
        }

        resArea.style.borderLeftColor = "var(--primary)";
        resValue.style.color = "var(--text-dark)";
        // Inject the exact string the user wants (e.g., 1 LITRE > 12 MILILITRE)
        resValue.innerHTML = `${v1} <span style="font-size:1.5rem; color:var(--text-gray);">${u1}</span> <span style="color:var(--primary); margin:0 10px;">${symbol}</span> ${v2} <span style="font-size:1.5rem; color:var(--text-gray);">${u2}</span>`;
        resUnit.style.display = "none";
    } 
    else if (currentAct === 'convert') {
        const finalResult = convertFromBase(base1, u2, currentCat);
        resArea.style.borderLeftColor = "var(--success)";
        resValue.style.color = "var(--success)";
        resValue.innerText = finalResult.toFixed(3);
        resUnit.style.display = "inline-block";
        resUnit.value = u2;
    }
    else if (currentAct === 'arithmetic') {
        const op = document.getElementById('op-select').value;
        let baseResult = 0;
        
        if(op === 'add') baseResult = base1 + base2;
        if(op === 'subtract') baseResult = base1 - base2;
        if(op === 'multiply') baseResult = base1 * base2;
        if(op === 'divide') baseResult = base2 !== 0 ? base1 / base2 : 0;

        const targetUnit = resUnit.value || u1;
        const finalResult = convertFromBase(baseResult, targetUnit, currentCat);
        
        resArea.style.borderLeftColor = "var(--success)";
        resValue.style.color = "var(--success)";
        resValue.innerText = finalResult.toFixed(3);
        resUnit.style.display = "inline-block";
        resUnit.value = targetUnit;
    }
}