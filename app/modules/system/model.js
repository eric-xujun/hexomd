(function () {
  'use strict';

  var util = require('./helpers/util'),
      fs = require('fs'),
      system = hmd.system,
      //存储设置的文件
      dataFile = system.dataPath + '\\system.json';

  //初始化存储目录
  if (!fs.existsSync(system.dataPath)) {
    fs.mkdirSync(system.dataPath);
  }
 	
  //默认设置
  var defaultSystemData = {
    //最后一次打开的文件
    lastFile: null,
    //编辑器样式
    theme:'ambiance',
    //预览窗口样式
    preViewTheme:'github',
    //预览代码块样式
    preViewHighLightTheme:'default',
    
    /*七牛空间设置*/
    accessKey:'rrGYBTgg782dxQDxccsDpc9Q33FB26iA33zj9D-x',
    secretKey:'bAloaZ6TMAKyTz2Per3kIT68X8npkmhVAEH_viXf',
    //空间名称
    bucketName:'test',
    //空间访问地址
    bucketHost:'7xit3a.com1.z0.glb.clouddn.com',
    //过期时间,从设置之后多少小时过期.
    deadline:1000
  };
  
  //读取theme目录,生成样式列表
  system.readCssList = function(path){
    var files = fs.readdirSync(path),themes={};
    files.forEach(function (file) {
      if(~file.indexOf('.css')){
      	file = file.replace('.css','');
        themes[file] = file;
      } 
    });
    return themes;
  };

  //生成七牛存储空间token
  system.qiniuKeygen = function(systemSetting){
    var qiniu = require('../app/node_modules/qiniu');
    qiniu.conf.ACCESS_KEY = systemSetting.accessKey;
    qiniu.conf.SECRET_KEY = systemSetting.secretKey;
    var putPolicy = new qiniu.rs.PutPolicy(systemSetting.bucketName);
    putPolicy.expires = Math.round(new Date().getTime() / 1000) + systemSetting.deadline * 3600;
    systemSetting.qiniutoken = putPolicy.token();
    return systemSetting;
  };
  
  //读取设置
  system.get = function () {
    return $.extend(defaultSystemData,util.readJsonSync(dataFile));
  };

  //保存设置
  system.save = function (data) {
    data = data || defaultSystemData;
    util.writeFileSync(dataFile, JSON.stringify(data));
  };
  
    //设置最后打开的文件
  system.setLastFile = function (filepath) {
    var systemData  = system.get();
    systemData.lastFile = filepath;
    system.save(systemData);
  };
})();