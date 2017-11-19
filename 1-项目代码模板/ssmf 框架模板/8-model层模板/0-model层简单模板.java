package com.wh.eas.manage.model.*;

import java.sql.Date;
import java.sql.Timestamp;

public class RegEnrollBatch {
	
	private String      id;                //'标识'
	private Date        startTime;         //'起始招生时间(年月日)'
	private Timestamp   publishTime;       //'发布时间'
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Date getStartTime() {
		return startTime;
	}
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	public int getPublishTime() {
		return publishTime;
	}
	public void setPublishTime(int publishTime) {
		this.publishTime = publishTime;
	}
}
