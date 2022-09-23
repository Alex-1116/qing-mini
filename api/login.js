import {
	getRequest,
	postRequest,
	putRequest,
	deleteRequest,
} from '../common/http/request.js'


const loginUrl = {
	login_url: '/random/user/login',
	addFood_url: '/random/food/create',
	sign_url: '/random/sign/one',
	meAddedFood_url: '/random/food/me/added',
	sysFood_url: '/random/food/sys/list',
	mineFood_url: '/random/food/mine/list',
	updateIsSelect_url: '/random/food/update/isSelect',
	delFood_url: '/random/food/delete',
	prizeFood_url: '/random/prize/eight'
}

// 登录
export const loginApi = (data) => {
	return postRequest(loginUrl.login_url, data)
}

// 添加食物
export const addFoodApi = (data) => {
	return postRequest(loginUrl.addFood_url, data)
}

// 今日签名
export const signApi = (data) => {
	return getRequest(loginUrl.sign_url, data)
}

// 获取我选中的
export const meAddedFoodDataApi = (data) => {
	return getRequest(loginUrl.meAddedFood_url, data)
}

// 默认的食物列表
export const sysFoodDataApi = (data) => {
	return getRequest(loginUrl.sysFood_url, data)
}

// 我创建的食物列表
export const mineFoodDataApi = (data) => {
	return getRequest(loginUrl.mineFood_url, data)
}

// 选择食物
export const updateIsSelectApi = (data) => {
	return postRequest(loginUrl.updateIsSelect_url, data)
}

// 选择食物
export const delFoodApi = (data) => {
	return postRequest(loginUrl.delFood_url, data)
}

// 获取首页食物列表
export const prizeFoodApi = (data) => {
	return getRequest(loginUrl.prizeFood_url, data)
}

// 默认全部导出
export default {
	loginApi,
	addFoodApi,
	signApi,
	meAddedFoodDataApi,
	sysFoodDataApi,
	mineFoodDataApi,
	updateIsSelectApi,
	delFoodApi,
	prizeFoodApi
}
