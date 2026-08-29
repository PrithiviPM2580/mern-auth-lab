Absolutely. If you're building a full MERN authentication practice project, I'd structure it like this.

Full MERN Auth Project Structure
mern-auth/
│
├── client/
│ ├── public/
│ │
│ └── src/
│ ├── assets/
│ │
│ ├── components/
│ │ ├── common/
│ │ │ ├── Button.jsx
│ │ │ ├── Input.jsx
│ │ │ ├── Loader.jsx
│ │ │ └── Modal.jsx
│ │ │
│ │ ├── auth/
│ │ │ ├── LoginForm.jsx
│ │ │ ├── RegisterForm.jsx
│ │ │ ├── GoogleButton.jsx
│ │ │ ├── GithubButton.jsx
│ │ │ ├── OtpForm.jsx
│ │ │ └── PasswordResetForm.jsx
│ │ │
│ │ └── protected/
│ │ └── ProtectedRoute.jsx
│ │
│ ├── pages/
│ │ ├── auth/
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── VerifyEmail.jsx
│ │ │ ├── ForgotPassword.jsx
│ │ │ ├── ResetPassword.jsx
│ │ │ ├── TwoFactor.jsx
│ │ │ └── OAuthCallback.jsx
│ │ │
│ │ ├── Dashboard.jsx
│ │ ├── Profile.jsx
│ │ └── NotFound.jsx
│ │
│ ├── context/
│ │ └── AuthContext.jsx
│ │
│ ├── hooks/
│ │ ├── useAuth.js
│ │ └── useFetch.js
│ │
│ ├── services/
│ │ ├── api.js
│ │ └── authApi.js
│ │
│ ├── utils/
│ │ ├── validators.js
│ │ └── constants.js
│ │
│ ├── routes/
│ │ └── AppRoutes.jsx
│ │
│ ├── App.jsx
│ └── main.jsx
│
│
├── server/
│ ├── src/
│ │
│ │ ├── config/
│ │ │ ├── db.js
│ │ │ ├── env.js
│ │ │ └── passport.js
│ │ │
│ │ ├── models/
│ │ │ ├── User.js
│ │ │ ├── Session.js
│ │ │ └── PasswordResetToken.js
│ │ │
│ │ ├── auth/
│ │ │ ├── auth.routes.js
│ │ │ ├── auth.controller.js
│ │ │ ├── auth.service.js
│ │ │ │
│ │ │ ├── password.service.js
│ │ │ ├── google.service.js
│ │ │ ├── github.service.js
│ │ │ ├── twoFactor.service.js
│ │ │ ├── emailVerification.service.js
│ │ │ ├── passwordReset.service.js
│ │ │ └── token.service.js
│ │ │
│ │ ├── middleware/
│ │ │ ├── auth.middleware.js
│ │ │ ├── error.middleware.js
│ │ │ └── rateLimit.middleware.js
│ │ │
│ │ ├── services/
│ │ │ ├── email.service.js
│ │ │ └── user.service.js
│ │ │
│ │ ├── utils/
│ │ │ ├── password.js
│ │ │ ├── otp.js
│ │ │ ├── jwt.js
│ │ │ └── crypto.js
│ │ │
│ │ ├── routes/
│ │ │ └── user.routes.js
│ │ │
│ │ ├── controllers/
│ │ │ └── user.controller.js
│ │ │
│ │ ├── app.js
│ │ └── server.js
│ │
│ ├── .env
│ └── package.json
│
├── .gitignore
├── README.md
└── package.json

The important part: auth/

This is what you were asking about specifically.

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

So you have one auth folder, not:

email-auth/
google-auth/
github-auth/
2fa-auth/

Instead, each authentication feature gets its own service inside the same auth module.

What each file does
auth.routes.js

Defines your endpoints:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

GET /api/auth/google
GET /api/auth/google/callback

GET /api/auth/github
GET /api/auth/github/callback

POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password

POST /api/auth/2fa/enable
POST /api/auth/2fa/verify
POST /api/auth/2fa/disable

auth.controller.js

Deals with HTTP:

request
↓
controller
↓
service
↓
response

For example:

export const register = async (req, res) => {
const user = await authService.register(req.body);

res.status(201).json({
message: "Registration successful",
user
});
};

The controller shouldn't contain all your business logic.

auth.service.js

This is the main authentication logic.

For example:

register()
login()
logout()
getCurrentUser()

It can use the smaller services:

auth.service
│
├── password.service
├── token.service
├── emailVerification.service
└── twoFactor.service

password.service.js

Everything related specifically to passwords:

hashPassword()
comparePassword()
changePassword()

For example:

const hash = await bcrypt.hash(password, 12);

google.service.js

Google OAuth-specific logic.

Google authorization
↓
Google callback
↓
get Google profile
↓
find/create User
↓
create session/token

github.service.js

Same idea for GitHub.

GitHub authorization
↓
GitHub callback
↓
get GitHub profile
↓
find/create User
↓
create session/token

twoFactor.service.js

Everything related to 2FA:

generateSecret()
generateQRCode()
enable2FA()
verify2FA()
disable2FA()

emailVerification.service.js

Handles:

create verification token
send verification email
verify email token

passwordReset.service.js

Handles:

create reset token
send reset email
verify reset token
reset password

token.service.js

Central place for authentication tokens.

For example:

createAccessToken()
createRefreshToken()
verifyAccessToken()
rotateRefreshToken()

Your User model

I'd keep one User model.

Something conceptually like:

User {
name
email

    passwordHash

    googleId
    githubId

    authProviders

    isEmailVerified

    twoFactorEnabled
    twoFactorSecret

    createdAt
    updatedAt

}

Don't create:

EmailUser
GoogleUser
GithubUser
TwoFactorUser

One person should be represented by one User.

How I recommend you practice it

Don't create all the files and features at once.

Build it in this exact progression:

                    AUTH SYSTEM
                         │
        ┌────────────────┴────────────────┐
        │                                 │

Authentication Security
│ │
┌────┴─────┐ ┌──────┴──────┐
│ │ │ │
Password OAuth Email 2FA
│ │ Verification │
│ ┌──┴──┐ │ │
│ Google GitHub │ │
│ │ │
└──────────────┬──────────────┴──────────────┘
│
Token/Session

Phase 1
Register
Login
Logout
Protected route

Phase 2
Hash password
Change password
Forgot password
Reset password

Phase 3
Email verification

Phase 4
Google OAuth

Phase 5
GitHub OAuth

Phase 6
Access token
Refresh token
Token rotation
Session management

Phase 7
2FA
OTP
Enable 2FA
Verify 2FA
Disable 2FA
Recovery codes

Phase 8

Finally add the harder security pieces:

Rate limiting
Brute-force protection
Account lockout
CSRF protection (if applicable to your cookie/session design)
Secure cookies
Security headers
Input validation
OAuth account linking

This is the structure I'd use if your goal is to actually learn authentication rather than just copy a finished MERN auth project. The key principle is: one auth module, separate services for separate auth mechanisms, and build those services one at a time.

Yes. Since you're building this to practice the complete MERN auth system, don't install 30 packages immediately. Install them as you reach each feature.

I'll assume Node.js + Express + MongoDB + React + JWT/cookies + Google/GitHub OAuth.

1. Backend packages

Start with these:

npm install express mongoose dotenv cors cookie-parser bcryptjs jsonwebtoken

Why each one?
Package Why you need it
express Build your API and routes
mongoose Connect to MongoDB and create User models
dotenv Load secrets/config from .env
cors Allow your React frontend to communicate with Express
cookie-parser Read cookies from requests
bcryptjs Hash and verify passwords
jsonwebtoken Create and verify JWT access/refresh tokens

Your basic backend will then be:

React
↓
Express
↓
Mongoose
↓
MongoDB

and authentication:

Password
↓
bcryptjs
↓
JWT
↓
HTTP-only cookie

2. Backend development package

Install:

npm install -D nodemon

nodemon automatically restarts your server when you change code.

Your package.json can have:

{
"scripts": {
"dev": "nodemon src/server.js",
"start": "node src/server.js"
}
}

3. Validation

I'd also add:

npm install zod

Use zod to validate things like:

register
login
change password
reset password
2FA codes

For example:

const registerSchema = z.object({
name: z.string().min(2),
email: z.string().email(),
password: z.string().min(8)
});

This is better than trusting req.body.

4. Email verification + password reset

You'll need an email package.

A popular choice:

npm install nodemailer

You'll use it for:

Register
↓
Generate verification token
↓
Send email
↓
User clicks link
↓
Verify email

And:

Forgot password
↓
Generate reset token
↓
Send email
↓
User clicks link
↓
Reset password

5. Google + GitHub authentication

Since you're practicing OAuth, I'd recommend Passport.

Install:

npm install passport passport-google-oauth20 passport-github2

Why?

passport
↓
Authentication middleware

passport-google-oauth20
↓
Google OAuth

passport-github2
↓
GitHub OAuth

Then your flow becomes:

React
↓
GET /api/auth/google
↓
Google
↓
Google callback
↓
Find/Create User
↓
Create authentication session/token
↓
React

6. 2FA

For TOTP-based 2FA, install:

npm install otplib qrcode

otplib

Generates and verifies TOTP codes.

Secret
↓
Authenticator app
↓
123456
↓
Server verifies code

qrcode

Creates the QR code that the user scans with an authenticator app.

So:

2FA setup
↓
Generate secret
↓
Generate QR code
↓
User scans QR
↓
User enters 6-digit code
↓
Verify
↓
2FA enabled

7. Security packages

Once the basic authentication works, add:

npm install helmet express-rate-limit

helmet

Adds useful security-related HTTP headers.

express-rate-limit

Protects endpoints from excessive requests.

For example, your login endpoint shouldn't allow someone to do:

POST /login
POST /login
POST /login
POST /login
...
10,000 times

You can rate-limit it.

8. Optional: MongoDB session storage

If you decide to use server-side sessions instead of a purely JWT-based approach, you can use:

npm install express-session connect-mongo

But don't install this yet if you're practicing JWT authentication first.

You should learn the difference between:

JWT authentication

and

Session authentication

before combining them.

9. Frontend packages

For React, I'd start with:

npm install react-router-dom axios

react-router-dom

For:

/login
/register
/forgot-password
/reset-password
/verify-email
/dashboard
/profile

axios

For API requests:

axios.post("/api/auth/login", data);

10. Optional frontend packages

You don't need these immediately, but they can be useful later.

React Hook Form
npm install react-hook-form

Good for:

Login form
Register form
Reset password form
2FA form

Zod integration

If you use Zod for validation on the frontend too:

npm install @hookform/resolvers

Then:

React Hook Form +
Zod
↓
Form validation

So your final backend dependencies could look like
{
"dependencies": {
"bcryptjs": "...",
"cookie-parser": "...",
"cors": "...",
"dotenv": "...",
"express": "...",
"express-rate-limit": "...",
"helmet": "...",
"jsonwebtoken": "...",
"mongoose": "...",
"nodemailer": "...",
"otplib": "...",
"passport": "...",
"passport-github2": "...",
"passport-google-oauth20": "...",
"qrcode": "...",
"zod": "..."
},
"devDependencies": {
"nodemon": "..."
}
}

And frontend:

{
"dependencies": {
"axios": "...",
"react": "...",
"react-dom": "...",
"react-hook-form": "...",
"react-router-dom": "...",
"@hookform/resolvers": "...",
"zod": "..."
}
}

But don't install everything now

For Phase 1, I would literally install only:

# Backend

npm install express mongoose dotenv cors cookie-parser bcryptjs jsonwebtoken zod
npm install -D nodemon

# Frontend

npm install axios react-router-dom

Then build:

Register
↓
Login
↓
JWT
↓
HTTP-only cookie
↓
Protected route
↓
Logout

After that works, add nodemailer for email verification/password reset, then Passport for Google/GitHub, then otplib + qrcode for 2FA, and finally the security hardening packages.

That way, you learn what every package is doing instead of having a huge node_modules folder that you don't understand.

PHASE 1
Email + Password
│
├── Register
├── Login
├── bcrypt password hashing
├── Access token
├── Refresh token
├── Refresh token rotation
├── Protected routes
└── Logout

PHASE 2
Email Security
│
├── Email verification
├── Forgot password
├── Reset password
└── Change password

PHASE 3
OAuth
│
├── Google
└── GitHub

PHASE 4
2FA
│
├── Enable 2FA
├── QR code
├── Verify OTP
├── Disable 2FA
└── Recovery codes

PHASE 5
Security Hardening
│
├── Rate limiting
├── Secure cookies
├── Input validation
├── CSRF considerations
├── Session/token management
└── OAuth account linking
