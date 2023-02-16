#About YouPipe
This is a React project part of the MERN stack along side with MongoDB database and NextJS API https://github.com/WarlockJa/youpipe_api_mongodb . It imitates a video hosting platform. This project uses JWT authorization and API DB requests, loading with pagination, context-based, responsive design, lambda API requests for feedback form.

#Install
1) before working with this repository you need to prepare API and the database. You can do that following the instruction on the API page https://github.com/WarlockJa/youpipe_api_mongodb
2) clone this repository and run 'npm install' to install dependencies
3) rename 'env_template' into '.env' and replace its content with your data
  REACT_APP_DEFAULT_PASSWORD='Password for the default users'
  REACT_APP_YOUPIPE_URI='URL for the application' - in development http://localhost:PORT
  You can disable send feedback requirements by commenting 'sendMail...' line in 'src/Utils/API/SendEmail.jsx'
  REACT_APP_MAILER_API='mailer API' - email API
  REACT_APP_MAIL_USER='e-mail address for the feedback receiver'
  REACT_APP_MONGODB_API='URL for the MongoDB API'
4) start application by typing 'yarn start'
