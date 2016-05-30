/**
 * Created by BaeBae on 5/12/16.
 */
const  statusCodeMessage = {
  0: 'Operation completed successfully',
  1000 : 'User name is required.',
  1001 : 'User email is required.',
  1002 : 'User password is required.',
  1003 : 'User age is required.',
  1004 : 'User language is required.',
  1005 : 'User gender is required.',
  1006 : 'User type is required.',
  1007 : 'Facebook token id is required',
  1008 : '',
  1009 : '',
  1010 : 'Mongodb error occured while checking user existing status',
  1011 : 'User email has been already registered.',
  1012 : 'User has not been registered yet.',
  1013 : 'Password is wrong.',
  1014 : 'Login method has not been implemented yet',
  1015 : 'User token is invalid.',
  1020 : 'Mongodb error occured while adding/removing/updating overlay information',
  1021 : 'There\'s no place markers on server.',
  1022 : 'Current user is not Instructor & Admin user.',
  1023 : 'Failed create verification email',
  1024 : 'Mongodb error occured while save boundary information',
};

export default statusCodeMessage;