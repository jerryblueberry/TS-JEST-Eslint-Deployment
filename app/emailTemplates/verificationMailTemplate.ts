export const verificationMailTemplate = (otp: number) => {
  return `
  <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              <h1>Signup Successfull</h1>
              <p>Thank you for registering.</p>
              <p>OTP</p>
              <p>Dont Share with anyone</p>
              <p>${otp}</p>
              
              
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
`;
};
