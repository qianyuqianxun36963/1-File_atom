package com.wh.eas.manage.controller.myAreaPlace;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wh.eas.manage.base.utils.DatatableUtil;
import com.wh.eas.manage.model.dataTableUtils.DataTableModel;
import com.wh.eas.manage.model.dataTableUtils.DataTableParam;

import com.wh.eas.manage.service.myAreaPlace.IAAAService;

/*
 * myAreaPlace  //大模块名 如招生：reg
 * viewDir      //视图所在文件夹
 * viewfileName //视图文件名
 * AAA          //模块类名大写
 * bbb          //模块类名小写
 * #模块#       //模块中文名
*/

@Controller
@RequestMapping(value="/bbb")
public class AAAController {
	public static Logger logger = Logger.getLogger(AAAController.class);
	
	@Resource
	IAAAService bbbService;	
	
	/**
	 * 
	 * @Discription 跳转到#模块#管理页面
	 * @author ${user}      
	 * @created 2017年9月16日
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/toAAA",method = RequestMethod.POST)
	public String toAAAManage(HttpServletRequest request,HttpServletResponse response){
		return "myAreaPlace/viewDir/viewfileName.ftl";
	}
	
	/**
	 * 
	 * @Discription 获取#模块#列表
	 * @author thinkpad       
	 * @created 2017年9月16日
	 * @param request
	 * @param response
	 * @param dataTableParams
	 * @return
	 */
	@RequestMapping(value="/queryAAAList",method=RequestMethod.POST)
	@ResponseBody
	public Object queryAAAList(HttpServletRequest request,HttpServletResponse response
			, @RequestBody DataTableParam[] dataTableParams){
		DataTableModel dataTableModel = new DataTableModel();
		Map<String, String> dataTableMap = DatatableUtil.convertToMap(dataTableParams);
		JSONObject json = new JSONObject();
		try {
			dataTableModel = bbbService.queryAAAList(dataTableMap);
			json.put("status", "success");
			json.put("bbbData", dataTableModel);
		}
		catch(Exception e)
		{
			json.put("status", "error");
			json.put("msg", "查询#模块#列表信息异常!");
			logger.error("[获取#模块#列表异常-ErrorMsg:]", e);
		}
		return json;
	}
	
	/**
	 * 
	 * @Discription 根据#模块#ID获取#模块#信息
	 * @author thinkpad       
	 * @created 2017年9月16日
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/queryAAAInfo",method=RequestMethod.POST)
	@ResponseBody
	public Object queryAAAInfo(HttpServletRequest request,HttpServletResponse response){
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> bbbMap = new HashMap<String, Object>();
		String bbbId = request.getParameter("bbbId");
		try {
			bbbMap = bbbService.queryAAAInfo(bbbId);
			resultMap.put("status", "success");
			resultMap.put("bbbMap", bbbMap);
		} catch(Exception e) {
			resultMap.put("status", "error");
			resultMap.put("msg", "根据#模块#ID获取#模块#信息异常!");
			logger.error("[根据#模块#ID获取#模块#信息-ErrorMsg:]", e);
		}
		return resultMap;
	}
	
	/**
	 * 
	 * @Discription 保存#模块#信息
	 * @author thinkpad       
	 * @created 2017年9月16日
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/saveAAA",method=RequestMethod.POST)
	@ResponseBody
	public Object saveAAA(HttpServletRequest request,HttpServletResponse response){
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> paramMap = new HashMap<String, Object>();
		
		paramMap.put("bbbId", request.getParameter("bbbId"));        //#模块#ID
		paramMap.put("bbbCode", request.getParameter("bbbCode"));    //#模块#代码
		paramMap.put("bbbName", request.getParameter("bbbName"));    //#模块#名称
		paramMap.put("detailAddress", request.getParameter("detailAddress"));      //地址
		paramMap.put("status", request.getParameter("status"));                    //启用状态
		try {
			bbbService.saveAAA(paramMap);
			resultMap.put("status", "success");
			resultMap.put("msg", "#模块#信息保存成功!");
		} catch(DuplicateKeyException e) {
			resultMap.put("status", "error");
			resultMap.put("msg", "该#模块#信息代码已存在!");
			logger.error("[保存#模块#信息-ErrorMsg:]", e);
		} catch(Exception e) {
			resultMap.put("status", "error");
			resultMap.put("msg", "#模块#信息保存失败!");
			logger.error("[保存#模块#信息-ErrorMsg:]", e);
		}
		return resultMap;
	}
	
	/**
	 * 
	 * @Discription 删除#模块#信息
	 * @author thinkpad       
	 * @created 2017年9月16日
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/deleteAAA",method=RequestMethod.POST)
	@ResponseBody
	public Object deleteAAA(HttpServletRequest request,HttpServletResponse response){
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		String bbbId = request.getParameter("bbbId");        //#模块#ID信息
		try {
			bbbService.deleteAAA(bbbId);
			resultMap.put("status", "success");
			resultMap.put("msg", "删除成功!");
		} catch(Exception e) {
			resultMap.put("status", "error");
			resultMap.put("msg", "删除失败!");
			logger.error("[删除#模块#信息-ErrorMsg:]", e);
		}
		return resultMap;
	}
}
