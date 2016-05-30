/**
 * Created by BaeBae on 5/19/16.
 */
import checkAuth from '../account/checkAuth';
import statusCodeMessage from '../statusCodeMessage';
import Overlay from '../../db/OverlayModel';
export default function updatePlaceMarker(req) {
  return new Promise((resolve, reject) => {
    checkAuth(req).then((user) => {
      if (user.userType == 'instructor' && user.flagAdmin == true) {
        let overlay_uuid = req.body.overlay_uuid;
        let location = req.body.location;

        Overlay.update({overlay_uuid}, {location}, function(err, overlay) {
          if (err) {
            let statusCode = 1020;
            return reject({
              success: false,
              msg: statusCodeMessage[statusCode],
              statusCode,
            });
          }
          if (!err && overlay) {
            return resolve({
              success: true,
              statusCode: 0,
              msg: 'update marker successfully',
            });
          }
        });
      } else {
        let statusCode = 1022;
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode,
        });
      }
    }, () => {
      let statusCode = 1015;
      return reject({
        success: false,
        msg: statusCodeMessage[statusCode],
        statusCode,
      });
    })
  });
}