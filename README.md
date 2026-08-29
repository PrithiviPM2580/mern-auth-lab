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
