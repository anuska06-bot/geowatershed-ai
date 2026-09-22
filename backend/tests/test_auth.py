import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_request_otp_email():
    response = client.post("/api/v1/auth/request-otp", json={
        "identifier": "officer.sharma@wdc-pmksy.gov.in",
        "channel": "email",
        "role": "ROLE_FIELD_OFFICER"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "email" in data["channel"]
    assert "otp_debug" in data
    assert len(data["otp_debug"]) == 6

def test_request_otp_sms():
    response = client.post("/api/v1/auth/request-otp", json={
        "identifier": "9876543210",
        "channel": "sms",
        "role": "ROLE_ANALYST"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["channel"] == "sms"
    assert "otp_debug" in data

def test_verify_otp_success():
    # 1. Request OTP
    req_res = client.post("/api/v1/auth/request-otp", json={
        "identifier": "analyst.sen@wdc-pmksy.gov.in",
        "channel": "email",
        "role": "ROLE_ANALYST"
    })
    assert req_res.status_code == 200
    code = req_res.json()["otp_debug"]
    
    # 2. Verify OTP
    ver_res = client.post("/api/v1/auth/verify-otp", json={
        "identifier": "analyst.sen@wdc-pmksy.gov.in",
        "code": code
    })
    assert ver_res.status_code == 200
    data = ver_res.json()
    assert data["success"] is True
    assert "token" in data
    assert data["user"]["role"] == "ROLE_ANALYST"
    assert "Anushka" in data["user"]["name"]

def test_verify_otp_invalid():
    # 1. Request OTP
    client.post("/api/v1/auth/request-otp", json={
        "identifier": "user@test.gov.in",
        "channel": "email"
    })
    # 2. Try invalid OTP
    ver_res = client.post("/api/v1/auth/verify-otp", json={
        "identifier": "user@test.gov.in",
        "code": "000000"
    })
    assert ver_res.status_code == 400
    assert "Invalid verification code" in ver_res.json()["detail"]

def test_demo_login_field_officer():
    response = client.post("/api/v1/auth/demo-login", json={
        "role": "ROLE_FIELD_OFFICER"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["role"] == "ROLE_FIELD_OFFICER"
    assert data["user"]["name"] == "Rajesh Sharma"
    assert "token" in data

def test_demo_login_manager():
    response = client.post("/api/v1/auth/demo-login", json={
        "role": "ROLE_MANAGER"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["role"] == "ROLE_MANAGER"
    assert data["user"]["name"] == "Vikramaditya Deshmukh"

def test_seed_user_password_login():
    response = client.post("/api/v1/auth/login", json={
        "identifier": "officer.sharma@wdc-pmksy.gov.in",
        "password": "Officer@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["name"] == "Rajesh Sharma"
    assert data["user"]["role"] == "ROLE_FIELD_OFFICER"
    assert "token" in data

def test_user_registration_and_login():
    # 1. Register new surveyor
    reg_response = client.post("/api/v1/auth/register", json={
        "name": "Arjun Rathore",
        "identifier": "arjun.rathore@rajasthan.gov.in",
        "password": "SecurePassword123!",
        "role": "ROLE_FIELD_OFFICER",
        "jurisdiction": "Udaipur Catchment Area, Rajasthan",
        "organization": "State Watershed Development Cell"
    })
    assert reg_response.status_code == 200
    reg_data = reg_response.json()
    assert reg_data["success"] is True
    assert reg_data["user"]["name"] == "Arjun Rathore"
    assert reg_data["user"]["jurisdiction"] == "Udaipur Catchment Area, Rajasthan"
    
    # 2. Login with registered password
    login_response = client.post("/api/v1/auth/login", json={
        "identifier": "arjun.rathore@rajasthan.gov.in",
        "password": "SecurePassword123!"
    })
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert login_data["success"] is True
    assert login_data["user"]["name"] == "Arjun Rathore"
    
    # 3. Test wrong password
    bad_login = client.post("/api/v1/auth/login", json={
        "identifier": "arjun.rathore@rajasthan.gov.in",
        "password": "WrongPassword999"
    })
    assert bad_login.status_code == 401
