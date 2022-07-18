/*
 * @Abstract: 权限管理-菜单管理
 * @Author: zhang wen jie
 * @Date: 2022-07-16
 * @LastEditors: zhang wen jie
 * @LastEditTime: 2022-07-16
 */

import { getInstance } from "@/api/axios";
import faceName from "@/api/faceName";
import { IUrlObj } from "@/pageComponent/views/thingModel/factoryManage";
const formatParams = (obj = {}) => {
	let params = "";
	Object.keys(obj).forEach((key) => {
		const value: any = obj[key];
		if (value !== null && value !== undefined) {
			params += `${key}=${value}&`;
		}
	});
	return params.slice(0, params.length - 1);
};

let instance = getInstance({
	prefix: "/api/",
	serverName: faceName.thingmodel,
});
let instance2 = getInstance({
	prefix: "/api/",
	serverName: faceName.common,
});
export function setInstance({
	serverName = faceName.thingmodel,
	prefix = "/api/",
}) {
	instance = getInstance({ prefix, serverName });
}
export function setInstance2({
	serverName = faceName.common,
	prefix = "/api/",
}) {
	instance2 = getInstance({ prefix, serverName });
}
const findUrl = (urlObj: Partial<IUrlObj>, sort: string, type: string) => {
	if (type === "insert") {
		if (sort === "factory") {
			return urlObj.addFactory || "/base/factory/insert";
		} else if (sort === "brand") {
			return urlObj.addBrand || "/base/brand/insert";
		} else if (sort === "model") {
			return urlObj.addModel || "/base/model/insert";
		}
	} else if (type === "update") {
		if (sort === "factory") {
			return urlObj.updateFactory || "/base/factory/update";
		} else if (sort === "brand") {
			return urlObj.updateBrand || "/base/brand/update";
		} else if (sort === "model") {
			return urlObj.updateModel || "/base/model/update";
		}
	} else if (type === "del") {
		if (sort === "factory") {
			return urlObj.delFactory || "/base/factory/deleteById?id=";
		} else if (sort === "brand") {
			return urlObj.delBrand || "/base/brand/deleteById?id=";
		} else if (sort === "model") {
			return urlObj.delModel || "/base/model/deleteById?id=";
		}
	} else if (type === "compare") {
		if (sort === "factory") {
			return urlObj.compareConditionFactory || "/base/factory/comparecondition";
		} else if (sort === "brand") {
			return urlObj.compareConditionBrand || "/base/brand/comparecondition";
		} else if (sort === "model") {
			return urlObj.compareConditionModel || "/base/model/comparecondition";
		}
	}
	return "";
};

const api = {
	/**
	 * 厂家树
	 */
	getList: (url?: string) => () => {
		return instance.post(url ?? "/base/factory/findAll");
	},
	/**
	 * 详情
	 */
	findOne: (url?: string) => (id: string) => {
		return instance.post(`${url ?? "/base/factory/findAll"}?id=${id}`);
	},

	/**
	 * 更新
	 */
	update:
		(urlObj: Partial<IUrlObj>) => (data: any, type: string, sort: string) => {
			const url = findUrl(urlObj, sort, type);
			return instance.post(`${url}`, data);
		},
	/**
	 * 删除
	 */
	remove: (urlObj: Partial<IUrlObj>) => (id: string, sort: string) => {
		const url = findUrl(urlObj, sort, "del");
		return instance.post(`${url}${id}`);
	},

	/**
	 * 名字 code 唯一性
	 */

	compareCondition: (urlObj: Partial<IUrlObj>) => (data: any, type: string) => {
		const param = formatParams(data);
		const url = findUrl(urlObj, type, "compare");
		return instance.post(`${url}?${param}`);
	},
	
	/**
	 * 获取用户信息
	 */

	getUserInfo: (url?: string) => (userId:string) => {
		return instance2.get(url ?? `/user/detail?userId=${userId}`);
	},
};

export default api;
