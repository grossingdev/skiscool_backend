/**
 * Created by BaeBae on 5/20/16.
 */
import statusCodeMessage from '../statusCodeMessage';
import Overlay from '../../db/OverlayModel';
export default function getPlaceMarkers(req) {
  return new Promise((resolve, reject) => {
    Overlay.find({}, {overlay_uuid: 1, location: 1, overlay_type: 1}, (err, foundMarkers) => {
      if (err) {
        let statusCode = 1020;
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode,
        });
      }

      if (foundMarkers && foundMarkers.length > 0) {
        console.log('foundMarkers: '+ foundMarkers);
        return resolve({
          success: true,
          statusCode: 0,
          data: foundMarkers,
        });
      } else {
        let statusCode = 1021;
        return reject({
          success: false,
          msg: statusCodeMessage[statusCode],
          statusCode,
        });
      }
    });
  });
}