export const transValidation = {
    email_incorrect: "Invalid email",
    password_incorrect: "Password must have at least 6 characters",
    password_confirmation_incorrect: "The confirm password is not correct",
};

export const transMailBookingNew = {
    subject: "Email notification of booking progress at App-point",
    template: (data) => {
        return `<h3>Thank you for booking an appointment with App-point </h3>
        <h4>Information for booked appointment:</h4>
        <div>Business' name: ${data.merchant} </div>
        <div>Time: ${data.time}</div>
        <div>Date: ${data.date}</div>
        <div>Status: <b> Pending - A new appointment is waiting for confirmation</b></div>
        <h4>App-point system will automatically send email notification when confirmed appointment is complete. Thank you !</h4>`;
    },
};

export const transMailBookingFailed = {
    subject: "Email notification of booking progress at App-point",
    template: (data) => {
        return `<h3>Thank you for booking an appointment with App-point </h3>
        <h4>Information for booked appointment:</h4>
        <div>Business' name: ${data.merchant} </div>
        <div>Time: ${data.time}</div>
        <div>Date: ${data.date}</div>
        <div>Status: <b>Cancel - ${data.reason}</b></div>
        <h4>If you notice errors from this email, please contact the support operator: <b> 911 911 </b>. Thank you !</h4>`;
    },
};

export const transMailBookingSuccess = {
    subject: "Email notification of booking progress at App-point",
    template: (data) => {
        return `<h3>Thank you for booking an appointment with App-point </h3>
        <h4>Information for booked appointment:</h4>
        <div>Business' name: ${data.merchant} </div>
        <div>Time: ${data.time}</div>
        <div>Date: ${data.date}</div>
        <div>Status: <b>Succeed</b></div>
        <h4>Thank you very much !</h4>`;
    },
};
