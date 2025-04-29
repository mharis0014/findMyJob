export const STRINGS = {
  appTitle: 'FindMyJob',
  companySignup: {
    title: 'Create Account',
    fields: {
      name: 'Name',
      email: 'Email',
      contact: 'Contact',
      companyName: 'Company Name',
      address: 'Address',
      password: 'Password',
    },
    buttons: {
      signup: 'Sign Up',
      login: 'Login',
    },
    validation: {
      name: {
        required: 'Name is required',
        min: 'Name must be at least 3 characters',
      },
      email: {
        required: 'Email is required',
        invalid: 'Invalid email format',
      },
      contact: {
        required: 'Contact is required',
        invalid: 'Contact must be a number',
      },
      companyName: {
        required: 'Company name is required',
      },
      address: {
        required: 'Address is required',
      },
      password: {
        required: 'Password is required',
        min: 'Password must be at least 6 characters',
      },
    },
  },
  companyLogin: {
    title: 'Login',
    fields: {
      email: 'Email',
      password: 'Password',
    },
    buttons: {
      login: 'Login',
      signup: 'Create Account',
      forgotPassowrd: 'Forgot Password?',
    },
  },
  selectUserType: {
    title: 'What are you looking for?',
    buttons: {
      hire: 'Want to Hire a Candidate',
      getJob: 'Want to Get a Job',
    },
  },
}
