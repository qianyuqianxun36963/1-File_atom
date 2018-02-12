package com.wh.eas.manage.dao.myAreaPlace;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.wh.eas.manage.model.Page;

/*
 * myAreaPlace  //大模块名 如招生：reg
 * AAA          //模块类名大写
 * bbb          //模块类名小写
 * #模块#       //模块中文名
*/

public interface AAAMapper {

	/**
	 * 获取#模块#信息列表
	 * @param page
	 * @return
	 */
	List<Map<String, Object>> queryAAAList(Page<Map<String, Object>> page);

	/**
	 * 获取#模块#总数
	 * @param paramMap
	 * @return
	 */
	Integer queryAAACount(Map<String, Object> paramMap);
	
	/**
	 * 根据#模块#ID获取#模块#信息
	 * @param bbbId
	 * @return
	 */
	Map<String, Object> queryAAAInfo(@Param("bbbId")String bbbId);
	
	/**
	 * 添加#模块#信息
	 * @param paramMap
	 * @return
	 */
	int addAAA(Map<String, Object> paramMap);
	
	/**
	 * 更新#模块#信息
	 * @param paramMap
	 * @return
	 */
	int updateAAA(Map<String, Object> paramMap);

	/**
	 * 删除#模块#信息_逻辑删除
	 * @param bbbId
	 * @return
	 */
	int deleteAAA_lg(@Param("bbbId")String bbbId);
	
	/**
	 * 删除#模块#信息_物理删除
	 * @param bbbId
	 * @return
	 */
	int deleteAAA_wl(@Param("bbbId")String bbbId);
}