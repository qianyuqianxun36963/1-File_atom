package com.wh.eas.manage.service.myAreaPlace;

import java.util.Map;

import com.wh.eas.manage.model.dataTableUtils.DataTableModel;

/*
 * myAreaPlace  //大模块名 如招生：reg
 * AAA          //模块类名大写
 * bbb          //模块类名小写
 * #模块#       //模块中文名
*/

public interface IAAAService{
   
	/**
	 * 获取#模块#信息列表
	 * @param dataTableMap
	 * @return
	 */
	DataTableModel queryAAAList(Map<String, String> dataTableMap);

	/**
	 * 根据#模块#ID获取#模块#信息
	 * @param bbbId
	 * @return
	 */
	Map<String, Object> queryAAAInfo(String bbbId);

	/**
	 * 保存#模块#信息
	 * @param paramMap
	 * @return
	 */
	boolean saveAAA(Map<String, Object> paramMap);

	/**
	 * 删除#模块#信息
	 * @param bbbId
	 * @return
	 */
	boolean deleteAAA(String bbbId);
}