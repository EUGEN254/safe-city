export const ACCOUNT_CREATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Created</title>
  <style>
    body {
      background: #f4f4f7;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .email-container {
      background: #ffffff;
      width: 90%;
      max-width: 600px;
      margin: 30px auto;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0px 3px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      color: #1a73e8;
      margin-bottom: 20px;
    }
    .logo {
      width: 80px;
      margin-bottom: 15px;
    }
    .content {
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      background: #1a73e8;
      color: #ffffff !important;
      padding: 12px 22px;
      border-radius: 6px;
      font-size: 16px;
      margin-top: 25px;
      text-decoration: none;
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #777777;
      margin-top: 20px;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="header">
      <img class="logo" src="https://cdn-icons-png.flaticon.com/512/786/786432.png" alt="Safe City Logo" />
      <h2>Welcome to Safe City</h2>
    </div>

    <div class="content">
      <p>Hi <strong>{{userName}}</strong>,</p>
      <p>
        ✅ Your account has been successfully created!  
        We are excited to have you as part of our community dedicated to improving safety and quick response within our city.
      </p>

      <p>
        Your Safe City account allows you to:
      </p>
      <ul>
        <li>Report emergencies and incidents instantly</li>
        <li>Track status of your reports</li>
        <li>Access nearby safety services</li>
        <li>Receive real-time safety alerts</li>
      </ul>

      <p>Click below to log in and start using Safe City 👇</p>

      <a href="{{loginLink}}" class="btn">Login to Your Account</a>
    </div>

    <div class="footer">
      <p>If you did not create this account, please ignore this message.</p>
      <p>© 2025 Safe City — Keeping Citizens Safe</p>
    </div>
  </div>
</body>
</html>


`;


export const notificationEnabledEmailTemplate = (fullname, notificationType, enabled) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Notification ${enabled ? "Enabled" : "Disabled"}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          background-color: #ffffff;
          margin: 30px auto;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: ${enabled ? "#2ecc71" : "#e63946"};
          color: #ffffff;
          text-align: center;
          padding: 20px;
          font-size: 22px;
          font-weight: bold;
        }
        .content {
          padding: 30px;
          color: #333333;
          line-height: 1.6;
        }
        .content h2 {
          color: ${enabled ? "#2ecc71" : "#e63946"};
        }
        .footer {
          background-color: #f5f5f5;
          text-align: center;
          font-size: 14px;
          color: #777777;
          padding: 15px;
        }
        .btn {
          display: inline-block;
          padding: 10px 18px;
          background-color: ${enabled ? "#2ecc71" : "#e63946"};
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          SafeCity Notification ${enabled ? "Enabled" : "Disabled"}
        </div>
        <div class="content">
          <h2>Hello ${fullname || "User"},</h2>
          <p>
            You’ve successfully <strong>${enabled ? "enabled" : "disabled"} ${notificationType}</strong> notifications
            on your SafeCity account.
          </p>
          ${
            enabled
              ? `<p>We’ll keep you informed about important updates related to your chosen category.</p>`
              : `<p>You will no longer receive updates for this category, but you can re-enable them anytime.</p>`
          }
          <a href="https://safecity.example.com/settings" class="btn">Manage Notifications</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SafeCity. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`;


