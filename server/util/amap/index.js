'use strict';
const _ = require('lodash');
const config = require('../../config/env');
const fetch = require("node-fetch");

exports.getTrafficInfo = function(location) {
  let key = config.amap.key;
  let uri = "http://restapi.amap.com/v3/place/around?" +
  "key=" + key + "&location=" + location[0] + "," + location[1] +
  "&keywords=%E5%9C%B0%E9%93%81&types=150500&offset=1&page=1&extensions=base";
  return fetch(uri).then(function(res) {
    return res.json();
  }).then(function(json) {
    let poi = json.pois[0];
    if(poi) {
      let name = poi.name.substring(0, poi.name.indexOf("(地铁站)"));
      let line = poi.address.split(";")
      return {
        traffic_name: name,
        traffic_line: line,
        traffic_distance: poi.distance
      };
    }
  });
}

exports.getGeoInfo = function(location) {
  let key = config.amap.key;
  let uri = "http://restapi.amap.com/v3/geocode/regeo?" +
  "key=" + key + "&location=" + location[0] + "," + location[1] +
  "&poitype=商务住宅&radius=0&extensions=base&batch=false&roadlevel=0";
  return fetch(uri).then(function(res) {
    return res.json();
  }).then(function(json) {
    let poi = json.regeocode;
    if(poi) {
      let address = poi.addressComponent;
      let businessAreas = address.businessAreas;
      console.log(JSON.stringify(address));
      let data = {
        district: address.district,
        adcode: address.adcode,
        township: address.township,
        towncode: address.towncode
      };
      if(businessAreas && businessAreas.length > 0) {
        data.biz_id = businessAreas[0].id;
        data.biz_name = businessAreas[0].name;
        data.biz_location = businessAreas[0].location.split(',');
      }
      return data;
    }
  });
}
