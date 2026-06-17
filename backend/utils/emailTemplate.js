exports.announcementEmailTemplate = (title, message, teacherName) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f5f7fb; padding: 20px;">

    <table width="100%" style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

      <tr>
        <td style="background: linear-gradient(90deg, #4f46e5, #7c3aed); padding: 30px 20px; text-align:center; color:white;">
          <h1 style="margin:0; font-size: 28px;">📢 Acadly</h1>
          <p style="margin:5px 0 0; font-size: 14px; opacity: 0.9;">Assignment Platform</p>
        </td>
      </tr>

      <tr>
        <td style="padding:30px; border-bottom: 1px solid #eee;">
          <h2 style="color:#1f2937; margin-top:0; font-size: 22px;">${title}</h2>

          <div style="background: #f9fafb; border-left: 4px solid #4f46e5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="color:#444; line-height:1.8; margin: 0; font-size: 15px;">
              ${message.replace(/\n/g, "<br>")}
            </p>
          </div>

          <div style="margin-top:25px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color:#666; margin: 0; font-size: 13px;">
              📧 <strong>Posted by:</strong> ${teacherName}
            </p>
            <p style="color:#999; margin: 5px 0 0; font-size: 12px;">
              ${new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          <div style="text-align:center; margin:30px 0;">
            <a href="http://localhost:3000/dashboard"
               style="display: inline-block; background:#4f46e5; color:white; padding:12px 28px; text-decoration:none; border-radius:6px; font-weight: bold; font-size: 14px;">
               📋 View All Announcements
            </a>
          </div>
        </td>
      </tr>

      <tr>
        <td style="background:#f1f1f1; padding:20px; text-align:center; font-size:12px; color:#777;">
          <p style="margin: 0;">You're receiving this because you're registered on Acadly</p>
          <p style="margin: 5px 0 0;">© 2026 Acadly. All rights reserved.</p>
        </td>
      </tr>

    </table>
  </div>
  `;
};

exports.otpEmailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f5f7fb; padding: 20px;">
      <table width="100%" style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

        <tr>
          <td style="background: linear-gradient(90deg, #4f46e5, #7c3aed); padding: 30px 20px; text-align:center; color:white;">
            <h1 style="margin:0; font-size: 28px;">🔐 Acadly</h1>
            <p style="margin:5px 0 0; font-size: 14px; opacity: 0.9;">Verification Code</p>
          </td>
        </tr>

        <tr>
          <td style="padding:40px; text-align:center;">
            <h2 style="color:#1f2937; margin-top:0;">Your OTP Code</h2>
            <p style="color:#666; margin:20px 0;">Use this code to verify your account:</p>

            <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h1 style="color:#4f46e5; margin:0; letter-spacing: 3px; font-size: 36px; font-weight: bold;">${otp}</h1>
            </div>

            <p style="color:#999; font-size: 13px; margin: 20px 0;">This OTP will expire in 5 minutes.</p>
            <p style="color:#d32f2f; font-size: 12px; margin: 15px 0;">Do not share this code with anyone.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#f1f1f1; padding:20px; text-align:center; font-size:12px; color:#777;">
            <p style="margin: 0;">You're receiving this because someone requested verification for your account</p>
            <p style="margin: 5px 0 0;">© 2026 Acadly. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
};
