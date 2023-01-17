export const sendMail = (props) => {
    const { emailAddress, emailTopic, emailBody } = props

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "email": emailAddress,
          "email_subject": emailTopic,
          "email_message": emailBody
        })
    }
    fetch(process.env.REACT_APP_MAILER_API, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
}
