package com.wh.eas.manage.service.Impl.myAreaPlace;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;

import org.apache.log4j.Logger;
import com.wh.eas.manage.model.Page;
import com.wh.eas.manage.model.dataTableUtils.DataTableModel;
import com.wh.eas.manage.tools.PaginationUtil;
import com.wh.eas.manage.base.utils.StringUtils;

import com.wh.eas.manage.dao.myAreaPlace.AAAMapper;
import com.wh.eas.manage.service.myAreaPlace.IAAAService;

/*
 * myAreaPlace  //大模块名 如招生：reg
 * AAA          //模块类名大写
 * bbb          //模块类名小写
 * #模块#       //模块中文名
*/
	
	/**
	 * @Discription 获取#模块#信息列表
	 * @author ${user}
	 * @created ${time}
	 * @param dataTableMap
	 * @return **    
	 * @see **
	 */

@Service
public class AAAServiceImpl implements IAAAService{

    public static Logger logger = Logger.getLogger(AAAServiceImpl.class);
    
	@Resource
	private AAAMapper bbbMapper;

	@Override
	public DataTableModel queryAAAList(Map<String, String> dataTableMap) {
		DataTableModel dataTableModel = new DataTableModel();
		Map<String,Object> paramMap = new HashMap<String,Object>();
		String sEcho = dataTableMap.get("sEcho");
		int start = Integer.parseInt(dataTableMap.get("iDisplayStart"));
		int length = Integer.parseInt(dataTableMap.get("iDisplayLength"));
		int currentPage = start/length + 1;
		
		paramMap.put("bbbCode", dataTableMap.get("bbbCode").trim());   //注释
		paramMap.put("bbbName", dataTableMap.get("bbbName").trim());   //注释
		paramMap.put("status", dataTableMap.get("status").trim());          //注释
		
		Page<Map<String, Object>> page = PaginationUtil.setPageInfoStart(paramMap,currentPage,length);

		//获取#模块#列表
		List<Map<String, Object>> resList = bbbMapper.queryAAAList(page);
		Integer count = bbbMapper.queryAAACount(paramMap);
		dataTableModel.setiTotalDisplayRecords(count);
		dataTableModel.setiTotalRecords(count);
		dataTableModel.setsEcho(Integer.valueOf(sEcho));
		dataTableModel.setAaData(resList);
		return dataTableModel;
	}

	/**
	 * @Discription 根据#模块#ID获取#模块#信息
	 * @author ${user}
	 * @created ${time}
	 * @param  **
	 * @return **    
	 * @see **
	 */
	public Map<String, Object> queryAAAInfo(String bbbId) {
		return bbbMapper.queryAAAInfo(bbbId);
	}

	/**
	 * @Discription 保存#模块#信息
	 * @author ${user}
	 * @created ${time}
	 * @param  **
	 * @return **    
	 * @see **
	 */
	public void saveAAA(Map<String, Object> paramMap) {
		paramMap.put("userId", "0-1");//操作人ID
		String bbbId = (String)paramMap.get("bbbId");
		if (StringUtils.isEmpty(bbbId)) {
			paramMap.put("bbbId", StringUtils.getUUId());
			bbbMapper.addAAA(paramMap);
		} else {
			bbbMapper.updateAAA(paramMap);
		}
	}
	
	/**
	 * @Discription 删除#模块#信息
	 * @author ${user}
	 * @created 
	 * @param  **
	 * @return **    
	 * @see **
	 */
	public void deleteAAA(String bbbId) {
		Map<String, Object> bbbMap = bbbMapper.queryAAAInfo(bbbId);
		int isUse = (Integer)bbbMap.get("isUse");
		if (1 == isUse) {
			bbbMapper.deleteAAA_lg(bbbId);
		} else {
			bbbMapper.deleteAAA_wl(bbbId);
		}
	}
}
