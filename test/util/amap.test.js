var should = require("should");
var amap = require('../../server/util/amap');

describe('test/util/amap.js',function () {

	describe('getTrafficInfo',function () {
		it('should return success status 200',function () {
			amap.getTrafficInfo({lng: 116.42489500000000646, lat: 40.066007999999996514}).then(result => {
        console.log(result);
      });
		});
	});
});
