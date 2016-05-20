/**
 * Created by BaeBae on 5/19/16.
 */
import checkAuth from '../account/checkAuth';
import statusCodeMessage from '../statusCodeMessage';
import Overlay from '../../db/OverlayModel';
export default function removePlaceMarker(req) {
  return new Promise((resolve, reject) => {
    checkAuth(req).then((user) => {
      if (user.userType == 'instructor' && user.flagAdmin == true) {
        let overlay_uuid = req.body.uuid;
        Overlay.remove({overlay_uuid}, (err) => {
          if (err) {
            let statusCode = 1020;
            return reject({
              success: false,
              msg: statusCodeMessage[statusCode],
              statusCode,
            });
          }
          return resolve({
            success: true,
            statusCode: 0,
            message: 'remove marker successfully',
          });
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