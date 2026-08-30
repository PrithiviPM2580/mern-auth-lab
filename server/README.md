# server

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

                    LOGIN
                      │
              email + password
                      │
                      ↓
               Password valid?
                      │
                      ↓
              Email verified?
                      │
                      ↓
                2FA enabled?
                 /         \
               NO           YES
               │             │
               ↓             ↓
          Create Session   Create 2FA
               │            Challenge
               ↓             │
          Access Token       ↓
               │          Return challenge
               ↓             │
         Refresh Token       ↓
                          User enters OTP
                              │
                              ↓
                     POST /2fa/login
                              │
                              ↓
                     Verify challenge
                              │
                              ↓
                       Verify TOTP
                              │
                              ↓
                       Create Session
                              │
                              ↓
                       Access Token
                              │
                              ↓
                       Refresh Token
