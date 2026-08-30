## MERN Authentication System

A full-stack authentication practice project built with the MERN stack — MongoDB, Express.js, React, and Node.js.

The goal of this project is to learn how a complete authentication system works by building it step-by-step, from basic email/password authentication to OAuth, email verification, password recovery, two-factor authentication, token management, and security hardening.

## 🚀 Project Goals

This project is designed for learning authentication rather than simply copying a finished MERN authentication project.

The system will be built incrementally:

- Email/password authentication
- Password security
- Email verification
- Password reset
- Google OAuth
- GitHub OAuth
- Access and refresh token management
- Session management
- Two-factor authentication
- Security hardening

### Main Principle

One authentication module, with separate services for each authentication mechanism.

---

## 🛠️ Tech Stack

### Frontend

- React
- React Router
- Axios
- React Hook Form
- Zod

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Zod

### Authentication

- Email/password authentication
- JWT access tokens
- Refresh tokens
- HTTP-only cookies
- Google OAuth
- GitHub OAuth
- Email verification
- Password reset
- TOTP-based 2FA
- Recovery codes

### Security

- Helmet
- Rate limiting
- Secure cookies
- Input validation
- Brute-force protection
- Account lockout
- CSRF considerations
- OAuth account linking

---

## 📁 Project Structure

```text
mern-auth/
│
├── client/
│   ├── public/
│   │
│   └── src/
│       ├── assets/
│       │
│       ├── components/
│       │   ├── common/
│       │   │   ├── Button.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── Loader.jsx
│       │   │   └── Modal.jsx
│       │   │
│       │   ├── auth/
│       │   │   ├── LoginForm.jsx
│       │   │   ├── RegisterForm.jsx
│       │   │   ├── GoogleButton.jsx
│       │   │   ├── GithubButton.jsx
│       │   │   ├── OtpForm.jsx
│       │   │   └── PasswordResetForm.jsx
│       │   │
│       │   └── protected/
│       │       └── ProtectedRoute.jsx
│       │
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── VerifyEmail.jsx
│       │   │   ├── ForgotPassword.jsx
│       │   │   ├── ResetPassword.jsx
│       │   │   ├── TwoFactor.jsx
│       │   │   └── OAuthCallback.jsx
│       │   │
│       │   ├── Dashboard.jsx
│       │   ├── Profile.jsx
│       │   └── NotFound.jsx
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── hooks/
│       │   ├── useAuth.js
│       │   └── useFetch.js
│       │
│       ├── services/
│       │   ├── api.js
│       │   └── authApi.js
│       │
│       ├── utils/
│       │   ├── validators.js
│       │   └── constants.js
│       │
│       ├── routes/
│       │   └── AppRoutes.jsx
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── env.js
│   │   │   └── passport.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Session.js
│   │   │   └── PasswordResetToken.js
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── password.service.js
│   │   │   ├── google.service.js
│   │   │   ├── github.service.js
│   │   │   ├── twoFactor.service.js
│   │   │   ├── emailVerification.service.js
│   │   │   ├── passwordReset.service.js
│   │   │   └── token.service.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   │
│   │   ├── services/
│   │   │   ├── email.service.js
│   │   │   └── user.service.js
│   │   │
│   │   ├── utils/
│   │   │   ├── password.js
│   │   │   ├── otp.js
│   │   │   ├── jwt.js
│   │   │   └── crypto.js
│   │   │
│   │   ├── routes/
│   │   │   └── user.routes.js
│   │   │
│   │   ├── controllers/
│   │   │   └── user.controller.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json

🔐 Authentication Architecture

The authentication system uses a single auth/ module.

auth/
│
├── auth.routes.js
├── auth.controller.js
├── auth.service.js
│
├── password.service.js
├── google.service.js
├── github.service.js
├── twoFactor.service.js
├── emailVerification.service.js
├── passwordReset.service.js
└── token.service.js


Instead of creating separate modules such as:

email-auth/
google-auth/
github-auth/
2fa-auth/


all authentication features belong to the same auth/ module.

Each authentication mechanism gets its own service.

This keeps the authentication system modular, organized, and easier to maintain.

🔄 Request Flow

The general backend request flow is:

Client
   ↓
Express Route
   ↓
Controller
   ↓
Service
   ↓
Model
   ↓
MongoDB


Authentication requests follow:

React
   ↓
Axios
   ↓
Express Route
   ↓
Auth Controller
   ↓
Auth Service
   ↓
Password / Token / OAuth / 2FA Service
   ↓
User Model
   ↓
MongoDB

🧩 Authentication Files
auth.routes.js

Defines authentication endpoints.

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

GET  /api/auth/google
GET  /api/auth/google/callback

GET  /api/auth/github
GET  /api/auth/github/callback

POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password

POST /api/auth/2fa/enable
POST /api/auth/2fa/verify
POST /api/auth/2fa/disable

auth.controller.js

Handles HTTP-specific responsibilities.

The controller should receive the request, call the appropriate service, and return the response.

Request
   ↓
Controller
   ↓
Service
   ↓
Response


Example:

export const register = async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    message: "Registration successful",
    user,
  });
};


Controllers should remain thin.

Business logic belongs inside services.

auth.service.js

The main authentication service.

Typical functions:

register()
login()
logout()
getCurrentUser()


The authentication service can coordinate specialized services:

auth.service
     │
     ├── password.service
     ├── token.service
     ├── emailVerification.service
     └── twoFactor.service

password.service.js

Handles password-related operations.

Typical functions:

hashPassword()
comparePassword()
changePassword()


Example:

const passwordHash = await bcrypt.hash(password, 12);


Passwords should never be stored as plain text.

The database stores the password hash.

Plain Password
      ↓
bcrypt
      ↓
Password Hash
      ↓
MongoDB

google.service.js

Handles Google OAuth-specific functionality.

Google Authorization
        ↓
Google Callback
        ↓
Get Google Profile
        ↓
Find Existing User
        ↓
OR
Create New User
        ↓
Create Authentication
        ↓
Return to Application

github.service.js

Handles GitHub OAuth-specific functionality.

GitHub Authorization
        ↓
GitHub Callback
        ↓
Get GitHub Profile
        ↓
Find Existing User
        ↓
OR
Create New User
        ↓
Create Authentication
        ↓
Return to Application

twoFactor.service.js

Handles two-factor authentication.

Typical functions:

generateSecret()
generateQRCode()
enable2FA()
verify2FA()
disable2FA()
generateRecoveryCodes()


Basic setup flow:

Generate Secret
       ↓
Generate QR Code
       ↓
User Scans QR Code
       ↓
Authenticator App
       ↓
6-Digit OTP
       ↓
Server Verification
       ↓
2FA Enabled

emailVerification.service.js

Handles email verification.

Create Verification Token
        ↓
Send Verification Email
        ↓
User Opens Link
        ↓
Verify Token
        ↓
Mark Email Verified

passwordReset.service.js

Handles password recovery.

Forgot Password
       ↓
Create Reset Token
       ↓
Send Reset Email
       ↓
User Opens Link
       ↓
Verify Token
       ↓
Set New Password

token.service.js

Central location for authentication token operations.

Typical functions:

createAccessToken()
createRefreshToken()
verifyAccessToken()
verifyRefreshToken()
rotateRefreshToken()
revokeRefreshToken()


Token architecture:

Access Token
     │
     └── Short-lived

Refresh Token
     │
     └── Long-lived
             │
             ↓
       Token Rotation

👤 User Model

The application uses a single User model.

Conceptually:

User {
  name,
  email,

  passwordHash,

  googleId,
  githubId,

  authProviders,

  isEmailVerified,

  twoFactorEnabled,
  twoFactorSecret,

  createdAt,
  updatedAt
}


One person should be represented by one user account regardless of which authentication provider they use.

Avoid creating:

EmailUser
GoogleUser
GithubUser
TwoFactorUser


Instead:

                    User
                     │
          ┌──────────┼──────────┐
          │          │          │
        Email      Google     GitHub
          │          │          │
          └──────────┼──────────┘
                     │
                    2FA

📦 Installation

Do not install every package immediately.

Install packages as you reach each phase of the project.

Backend — Phase 1
cd server

npm install express mongoose dotenv cors cookie-parser bcryptjs jsonwebtoken zod

npm install -D nodemon

Backend Package Responsibilities
Package	Purpose
express	Build the API server
mongoose	MongoDB ODM
dotenv	Environment variables
cors	Cross-origin requests
cookie-parser	Cookie handling
bcryptjs	Password hashing
jsonwebtoken	JWT authentication
zod	Input validation
nodemon	Development server restart
📦 Additional Backend Packages

Install these packages when their corresponding features are implemented.

Email
npm install nodemailer


Used for:

Email verification
Password reset
Authentication emails
Google OAuth
npm install passport passport-google-oauth20


Used for Google authentication.

GitHub OAuth
npm install passport-github2


Used for GitHub authentication.

Two-Factor Authentication
npm install otplib qrcode


Used for:

TOTP generation
OTP verification
QR code generation
Security
npm install helmet express-rate-limit


Used for:

Security headers
Rate limiting
Brute-force protection
Server-Side Sessions

If server-side sessions are implemented later:

npm install express-session connect-mongo


Do not add session packages until the difference between JWT-based authentication and session-based authentication is understood.

💻 Frontend Installation

Start with:

cd client

npm install axios react-router-dom


For form management and validation:

npm install react-hook-form zod @hookform/resolvers

Frontend Package Responsibilities
Package	Purpose
axios	API requests
react-router-dom	Client-side routing
react-hook-form	Form management
zod	Form validation
@hookform/resolvers	React Hook Form + Zod integration
🔑 Environment Variables

Create a .env file inside the server/ directory.

server/.env


Example:

NODE_ENV=development

PORT=5000

MONGO_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password


Never commit real secrets or .env files to GitHub.

Add the following to .gitignore:

node_modules/
.env
.env.*
!.env.example

🚀 Development Roadmap

The authentication system will be built step-by-step.

                    AUTH SYSTEM
                         │
          ┌──────────────┴──────────────┐
          │                             │
   Authentication                  Security
          │                             │
    ┌─────┴─────┐                ┌──────┴──────┐
    │           │                │             │
 Password      OAuth           Tokens       Security
    │           │                │             │
    │       ┌───┴───┐            │       Rate Limiting
    │     Google  GitHub          │       Secure Cookies
    │                           Sessions   Security Headers
    │                           Rotation   CSRF
    │
    ├── Email Verification
    ├── Password Reset
    └── 2FA

1. Phase 1 — Email & Password Authentication

Start with the fundamentals.

Features
User registration
User login
User logout
Password hashing
Access token
Refresh token
HTTP-only cookies
Protected routes
Authentication context
Flow
Register
   ↓
Validate Input
   ↓
Hash Password
   ↓
Create User
   ↓
Login
   ↓
Create Access Token
   ↓
Create Refresh Token
   ↓
HTTP-only Cookie
   ↓
Protected Route
   ↓
Logout

Goal

Understand the complete authentication flow before adding OAuth, email verification, and 2FA.

2. Phase 2 — Password Security

Add password management after basic authentication works.

Features
Change password
Forgot password
Password reset
Reset token
Reset token expiration
Password validation
Flow
Forgot Password
       ↓
Generate Reset Token
       ↓
Store Token
       ↓
Send Email
       ↓
User Opens Reset Link
       ↓
Verify Token
       ↓
Set New Password
       ↓
Hash Password
       ↓
Invalidate Old Sessions

3. Phase 3 — Email Verification

Add email verification after registration.

Features
Verification token generation
Verification email
Email verification endpoint
Token expiration
Resend verification email
Flow
Register
   ↓
Create User
   ↓
Generate Verification Token
   ↓
Send Email
   ↓
User Clicks Link
   ↓
Verify Token
   ↓
Mark Email Verified

4. Phase 4 — Google OAuth

Add Google authentication.

Features
Google OAuth configuration
Google authorization
OAuth callback
Find existing user
Create new user
Account linking
Authentication session/token creation
Flow
React
  ↓
Google Login
  ↓
Google
  ↓
OAuth Callback
  ↓
Get Google Profile
  ↓
Find/Create User
  ↓
Create Authentication
  ↓
Redirect to React

5. Phase 5 — GitHub OAuth

Add GitHub authentication.

Features
GitHub OAuth configuration
GitHub authorization
OAuth callback
Find existing user
Create new user
Account linking
Authentication session/token creation
Flow
React
  ↓
GitHub Login
  ↓
GitHub
  ↓
OAuth Callback
  ↓
Get GitHub Profile
  ↓
Find/Create User
  ↓
Create Authentication
  ↓
Redirect to React

6. Phase 6 — Token & Session Management

Improve authentication token management.

Features
Access tokens
Refresh tokens
Refresh token rotation
Token expiration
Token revocation
Session management
Logout from current session
Logout from all sessions
Token Flow
Login
  ↓
Access Token
  │
  └── Short-lived

Refresh Token
  │
  └── Long-lived
          │
          ↓
    Token Rotation
          │
          ↓
    New Refresh Token

7. Phase 7 — Two-Factor Authentication

Add TOTP-based 2FA.

Features
Enable 2FA
Generate TOTP secret
Generate QR code
Scan QR code
Verify OTP
Disable 2FA
Recovery codes
2FA login flow
Setup Flow
Enable 2FA
    ↓
Generate Secret
    ↓
Generate QR Code
    ↓
User Scans QR Code
    ↓
Authenticator App
    ↓
User Enters OTP
    ↓
Server Verifies OTP
    ↓
2FA Enabled

Login Flow
Email + Password
       ↓
Credentials Valid
       ↓
2FA Enabled?
       ↓
      YES
       ↓
Request OTP
       ↓
Verify OTP
       ↓
Create Authentication
       ↓
Login Successful

8. Phase 8 — Security Hardening

After all authentication features work, improve the security of the system.

Features
Rate limiting
Brute-force protection
Account lockout
Secure cookies
Security headers
Input validation
Token expiration
Token revocation
CSRF considerations
OAuth account linking
Secure error handling
Password policy
🛡️ Security Principles
Password Security

Never store plain-text passwords.

Plain Password
      ↓
bcrypt
      ↓
Password Hash
      ↓
MongoDB

Secure Cookies

Authentication cookies should be configured securely.

Depending on the application architecture, consider:

HttpOnly
Secure
SameSite
Token Security

Access tokens should be short-lived.

Refresh tokens can have longer lifetimes but must be carefully managed.

Refresh tokens should be rotated and revoked when appropriate.

Input Validation

Never trust frontend validation alone.

The backend must validate incoming data.

React Form
    ↓
Frontend Validation
    ↓
HTTP Request
    ↓
Backend Validation
    ↓
Business Logic
    ↓
Database

🌐 API Routes
Authentication Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login
POST	/api/auth/logout	Logout
GET	/api/auth/me	Get current user
GET	/api/auth/google	Start Google OAuth
GET	/api/auth/google/callback	Google OAuth callback
GET	/api/auth/github	Start GitHub OAuth
GET	/api/auth/github/callback	GitHub OAuth callback
POST	/api/auth/verify-email	Verify email
POST	/api/auth/forgot-password	Request password reset
POST	/api/auth/reset-password	Reset password
POST	/api/auth/2fa/enable	Enable 2FA
POST	/api/auth/2fa/verify	Verify 2FA
POST	/api/auth/2fa/disable	Disable 2FA
🧪 Testing Strategy

Each authentication feature should be tested independently.

Registration
Valid registration
Duplicate email
Invalid email
Weak password
Missing fields
Password hashing
Login
Correct credentials
Incorrect password
Non-existent account
Unverified account
Rate limiting
Token creation
Logout
Logout successfully
Cookie cleared
Refresh token revoked
Protected route inaccessible
Password Reset
Valid reset request
Invalid token
Expired token
Used token
Successful password update
Old password no longer works
Email Verification
Verification email sent
Valid token
Invalid token
Expired token
Already verified user
Resend verification email
OAuth
New Google user
Existing Google user
New GitHub user
Existing GitHub user
OAuth failure
Invalid callback
Account linking
2FA
Enable 2FA
Generate secret
Generate QR code
Valid OTP
Invalid OTP
Expired OTP
Disable 2FA
Recovery codes
▶️ Running the Project
Start Backend
cd server

npm run dev


Backend:

http://localhost:5000

Start Frontend

Open another terminal:

cd client

npm run dev


The frontend will run using the Vite development server.

📜 Backend Scripts

The server/package.json should contain:

{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}

🧠 Complete Architecture
                         React
                           │
                           │
                         Axios
                           │
                           ↓
                    Express Routes
                           │
                           ↓
                      Controllers
                           │
                           ↓
                        Services
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     Password          OAuth              2FA
      Service          Service           Service
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ↓
                         Models
                           │
                           ↓
                        MongoDB

🎯 Learning Objectives

By completing this project, I aim to understand:

How authentication works
Password hashing
JWT authentication
Access tokens
Refresh tokens
Refresh token rotation
HTTP-only cookies
Protected routes
Authentication middleware
Email verification
Password reset
Google OAuth
GitHub OAuth
TOTP-based 2FA
Recovery codes
Session management
Token revocation
Rate limiting
Brute-force protection
Secure cookies
Security headers
CSRF considerations
OAuth account linking
Backend validation
Authentication architecture
📊 Project Progress
Phase	Feature	Status
Phase 1	Email & Password Authentication	⬜ Not Started
Phase 2	Password Security	⬜ Not Started
Phase 3	Email Verification	⬜ Not Started
Phase 4	Google OAuth	⬜ Not Started
Phase 5	GitHub OAuth	⬜ Not Started
Phase 6	Token & Session Management	⬜ Not Started
Phase 7	Two-Factor Authentication	⬜ Not Started
Phase 8	Security Hardening	⬜ Not Started
🗺️ Learning Roadmap
PHASE 1
Email + Password
│
├── Register
├── Login
├── Logout
├── Password Hashing
├── Access Token
├── Refresh Token
└── Protected Routes
        │
        ↓
PHASE 2
Password Security
│
├── Change Password
├── Forgot Password
└── Reset Password
        │
        ↓
PHASE 3
Email Verification
│
├── Verification Token
├── Verification Email
└── Verify Email
        │
        ↓
PHASE 4
Google OAuth
        │
        ↓
PHASE 5
GitHub OAuth
        │
        ↓
PHASE 6
Token & Session Management
│
├── Token Rotation
├── Token Revocation
└── Session Management
        │
        ↓
PHASE 7
Two-Factor Authentication
│
├── TOTP
├── QR Code
├── OTP Verification
└── Recovery Codes
        │
        ↓
PHASE 8
Security Hardening
│
├── Rate Limiting
├── Brute-force Protection
├── Secure Cookies
├── Security Headers
├── CSRF Considerations
└── OAuth Account Linking

📌 Development Philosophy

The most important rule for this project is:

Don't build everything at once.

Build one feature, understand it, test it, and then move to the next feature.

Recommended order:

Email/Password
      ↓
Password Security
      ↓
Email Verification
      ↓
Google OAuth
      ↓
GitHub OAuth
      ↓
Token/Session Management
      ↓
2FA
      ↓
Security Hardening


This approach makes it easier to understand why every package, service, middleware, model, and authentication mechanism exists.

⚠️ Disclaimer

This project is primarily for learning and practice.

Authentication systems are security-sensitive. Before using this project in production, review the implementation carefully and apply appropriate security practices based on the application's requirements and threat model.

📄 License

This project is created for educational and practice purposes.

PHASE 1 ✅
Email/password
├── Register
├── Login
├── Access token
├── Refresh token
├── Refresh rotation
├── Protected routes
└── Logout

PHASE 2 ✅
Email security
├── Email verification
├── Forgot password
├── Reset password
└── Change password

PHASE 3 ✅
OAuth
├── Google
└── GitHub

PHASE 4 ← NEXT
Two-factor authentication
├── Enable 2FA
├── Generate secret
├── Generate QR code
├── Verify OTP
├── Login with 2FA
├── Disable 2FA
└── Recovery codes

PHASE 5
Security hardening
├── Rate limiting
├── CSRF
├── Security headers
├── Account protection
└── OAuth account linking

```
