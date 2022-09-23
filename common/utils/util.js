//校验手机号
function isPoneAvailable(phone) {
	var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	if (!myreg.test(phone)) {
		return false;
	} else {
		return true;
	}
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

function formatTime(value) {
	let seconds = parseInt((value % (1000 * 60)) / 1000) // 秒数
	let minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60)) // 分钟数
	let hours = parseInt((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) // 小时数
	let time = [hours, minutes, seconds]
	// 补 0
	time.forEach((el, index) => {
		if (el < 10) {
			time[index] = '0' + el
		}
	})
	return time
}


// 时间日期格式化
function dateFormat(fmt, date) {
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}

// 点是否在某个区域内
function isInRegion(longitudeCur, latitudeCur, pathList) {
	//点小于3无法构成多边形
	if (pathList.length < 3)
		return false;
	let iSum = 0;
	let pathCount = pathList.length;
	let longStart = 0, latiStart = 0, longEnd = 0, latiEnd = 0;
	let dLong = 0;
	for (let i = 0; i < pathCount; i++) {
		let nextIndex = i + 1;
		if (i == pathCount - 1) {
			nextIndex = 0;
		}
		longStart = pathList[i].lng;
		latiStart = pathList[i].lat;
		longEnd = pathList[nextIndex].lng;
		latiEnd = pathList[nextIndex].lat;
		//判断纬度即Y坐标是否在2点的Y坐标内，只有在其内水平线才会相交
		if ((latitudeCur >= latiStart && latitudeCur < latiEnd) ||
			(latitudeCur >= latiEnd && latitudeCur < latiStart)) {
			if (Math.abs(latiStart - latiEnd) > 0) {
				dLong = longStart - ((longStart - longEnd) * (latiStart - latitudeCur)) / (latiStart - latiEnd);
				if (dLong < longitudeCur) {
					iSum++;
				}
			}
		}
	}
	
	if ((iSum % 2) != 0) {
		return true;
	}
	return false;
}

// 比较两个数组是否包含另一个数组
function includesLocal(array1, array2) {
	return array1.length == array2.length && array1.every(function(v, i) {
		return v === array2[i]
	});
}

module.exports = {
	isPoneAvailable: isPoneAvailable,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	formatTime: formatTime,
	dateFormat: dateFormat,
	isInRegion: isInRegion,
	includesLocal: includesLocal
}
