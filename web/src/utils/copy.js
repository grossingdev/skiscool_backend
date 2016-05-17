/**
 * Created by baebae on 5/10/16.
 */
/**
 * Unified place to edit all copy on the application
 * @author  Legion Development Group
 *
 */

export default {
  common: {
    required: 'This field is required.',
    invalidCharacters: 'Invalid characters.',
    invalidEmail: 'This email is invalid.',
  },
  login: {
    header: 'Log into Skiscool',
    not_signed_in: 'Sign up for Skiscool.',
    emailError: 'The username or email you entered is incorrect.',
    passwordError: 'The password you entered is incorrect.',
    passwordMatchError: 'These passwords don\'t match.',
    buttonText: 'Log in',
  },
  logout: {
    buttonText: 'Log out',
  },
  forgotPassword: {
    header: 'Welcome',
    title: 'It\'s chill.',
    subtitle: 'We\'ll sort you out.',
    buttonText: 'Submit',
    success: {
      header: 'Welcome',
      title: 'Dope.',
      subtitle: 'We sent your username via email.',
    },
  },
  forgotUsername: {
    header: 'Welcome',
    title: 'It\'s chill.',
    subtitle: 'We\'ll sort you out.',
    buttonText: 'Submit',
    success: {
      header: 'Welcome',
      title: 'Dope.',
      subtitle: 'We sent you a link to reset your password via email.',
      buttonText: 'Resend Link',
    },
  },

  signup: {
    header: 'Sign into Skiscool',
    buttonText: 'Signup',
    already_sign_in: 'Already have an account?',
    chooseName: {
      title: 'One more step.',
      subtitle: 'Choose a name worthy of your boss-ness.',
    },
    chooseNameError: {
      title: 'Bummer.',
      subtitle: 'This username is\nalready taken.',
      errorText: 'Choose a different username.',
    },
    chooseNameSuccess: {
      title: 'Thank you.',
      subtitle: 'Check your email to confirm registration.',
    },
    emailExists: 'Email already exists.',
  },

  values: {
    typeUser: 'User Type: ',
    typeGender: 'Gender: ',
    typeLanguage: 'Language',
    genders: ['Man', 'Woman'],
    userTypes: ['Player', 'Instructor'],
    languages: ['En', 'Fr', 'Ru', 'GR']
  }
};
