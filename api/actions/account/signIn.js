import UserModel from '../../db/UserModel';
export default function signIn(req) {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      let data = req.body;
      console.info('data', data);
      UserModel.findOne({userId: data.userId}, function (err, user) {
        if (user == null) {
          let newDevice = new UserModel({
            userId: data.userId,
            userName: data.userName,
            password: data.password
          });

          // Save device information to database
          newDevice.save(function (err) {
            console.log(err);
            if (err === null) {
              resolve({
                authenticated: true
              });
              console.info("user added");
            } else {
              resolve({
                error: 'User save failed'
              });
              console.info("user save failed");
            }
          })
        } else {
          resolve({
            error: 'User already registered'
          });
          console.info("user existed");
        }
      });
    });
  } else {
    return Promise.resolve({
    });
  }
}
