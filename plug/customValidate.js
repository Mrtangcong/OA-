jQuery.validator.addMethod("isIntEqZero", function(value, element) {
  value = parseInt(value);
  return this.optional(element) || value == 0;
}, "整数必须为0");

// 判断整数value是否大于0
jQuery.validator.addMethod("isIntGtZero", function(value, element) {
  value = parseInt(value);
  return this.optional(element) || value > 0;
}, "整数必须大于0");

// 判断整数value是否大于或等于0
jQuery.validator.addMethod("isIntGteZero", function(value, element) {
  value = parseInt(value);
  return this.optional(element) || value >= 0;
}, "整数必须大于或等于0");

// 判断整数value是否不等于0
jQuery.validator.addMethod("isIntNEqZero", function(value, element) {
  value = parseInt(value);
  return this.optional(element) || value != 0;
}, "整数必须不等于0");

// 判断整数value是否小于0
jQuery.validator.addMethod("isIntLtZero", function(value, element) {
  value = parseInt(value);
  return this.optional(element) || value < 0;
}, "整数必须小于0");

// 判断整数value是否小于或等于0
jQuery.validator.addMethod("isIntLteZero", function(value, element) {
  value = parseInt(value);
  return this.optional(element) || value <= 0;
}, "整数必须小于或等于0");

// 判断浮点数value是否等于0
jQuery.validator.addMethod("isFloatEqZero", function(value, element) {
  value = parseFloat(value);
  return this.optional(element) || value == 0;
}, "浮点数必须为0");

// 判断浮点数value是否大于0
jQuery.validator.addMethod("isFloatGtZero", function(value, element) {
  value = parseFloat(value);
  return this.optional(element) || value > 0;
}, "浮点数必须大于0");

// 判断浮点数value是否大于或等于0
jQuery.validator.addMethod("isFloatGteZero", function(value, element) {
  value = parseFloat(value);
  return this.optional(element) || value >= 0;
}, "浮点数必须大于或等于0");

// 判断浮点数value是否不等于0
jQuery.validator.addMethod("isFloatNEqZero", function(value, element) {
  value = parseFloat(value);
  return this.optional(element) || value != 0;
}, "浮点数必须不等于0");

// 判断浮点数value是否小于0
jQuery.validator.addMethod("isFloatLtZero", function(value, element) {
  value = parseFloat(value);
  return this.optional(element) || value < 0;
}, "浮点数必须小于0");

// 判断浮点数value是否小于或等于0
jQuery.validator.addMethod("isFloatLteZero", function(value, element) {
  value = parseFloat(value);
  return this.optional(element) || value <= 0;
}, "浮点数必须小于或等于0");

// 判断浮点型
jQuery.validator.addMethod("isFloat", function(value, element) {
  return this.optional(element) || /^[-\+]?\d+(\.\d+)?$/.test(value);
}, "只能包含数字、小数点等字符");

jQuery.validator.addMethod("isFloat01", function(value, element) {
  return this.optional(element) || /^0|0\.\d+$/.test(value);
}, "只能是0-1的浮点数");
// 匹配integer
jQuery.validator.addMethod("isInteger", function(value, element) {
  return this.optional(element) || (/^[-\+]?\d+$/.test(value) && parseInt(value) >= 0);
}, "请输入整数");

// 判断数值类型，包括整数和浮点数
jQuery.validator.addMethod("isNumber", function(value, element) {
  return this.optional(element) || /^[-\+]?\d+$/.test(value) || /^[-\+]?\d+(\.\d+)?$/.test(value);
}, "匹配数值类型，包括整数和浮点数");

// 只能输入[0-9]数字
jQuery.validator.addMethod("isDigits", function(value, element) {
  return this.optional(element) || /^\d+$/.test(value);
}, "只能输入0-9数字");

// 只能输入0-9数字，或者0-9带一位0-9的小数
jQuery.validator.addMethod("isDiscount", function(value, element) {
  return this.optional(element) || /^\d\.\d$|^\d$/.test(value);
}, "请输入正确折扣(一位整数，或者带一位小数)");

// 判断中文字符
jQuery.validator.addMethod("isChinese", function(value, element) {
  return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
}, "只能包含中文字符。");

// 判断英文字符
jQuery.validator.addMethod("isEnglish", function(value, element) {
  return this.optional(element) || /^[A-Za-z]+$/.test(value);
}, "只能包含英文字符。");

// 手机号码验证
jQuery.validator.addMethod("isMobile", function(value, element) {
  var length = value.length;
  return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));
}, "请正确填写您的手机号码。");

// 电话号码验证
jQuery.validator.addMethod("isPhone", function(value, element) {
  var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
  return this.optional(element) || (tel.test(value));
}, "请正确填写您的电话号码。");

// 联系电话(手机/电话皆可)验证
jQuery.validator.addMethod("isTel", function(value, element) {
  var length = value.length;
  var mobile = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
  return this.optional(element) || tel.test(value) || (length == 11 && mobile.test(value));
}, "请正确填写您的联系方式");

// 匹配qq
jQuery.validator.addMethod("isQq", function(value, element) {
  return this.optional(element) || /^[1-9]\d{4,12}$/;
}, "匹配QQ");

// 邮政编码验证
jQuery.validator.addMethod("isZipCode", function(value, element) {
  var zip = /^[0-9]{6}$/;
  return this.optional(element) || (zip.test(value));
}, "请正确填写您的邮政编码。");

// 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。
jQuery.validator.addMethod("isPwd", function(value, element) {
	  return this.optional(element) || /^[A-Za-z0-9]{6,12}$/.test(value);
	}, "长度在6-12之间，只能包含字符和数字。");


jQuery.validator.addMethod("isWECHATPwd", function(value, element) {
  return this.optional(element) || /^(WX)(.|\w){6,22}$/.test(value);
}, "以WX字母开头，长度在8-24之间，不能包含中文字符。");

// 身份证号码验证
jQuery.validator.addMethod("isIdCardNo", function(value, element) {
  return this.optional(element) || idCardNoUtil.checkIdCardNo(value);
}, "请输入正确的身份证号码。");

// IP地址验证
jQuery.validator.addMethod("ip", function(value, element) {
  return this.optional(element) || /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);
}, "请填写正确的IP地址。");

// 字符验证，只能包含中文、英文、数字、下划线等字符。
jQuery.validator.addMethod("stringCheck", function(value, element) {
  return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_\/]+$/.test(value);
}, "只能包含中文、英文、数字、下划线等字符");

// 匹配english
jQuery.validator.addMethod("isEnglish", function(value, element) {
  return this.optional(element) || /^[A-Za-z]+$/.test(value);
}, "只能是英文");

// 匹配汉字
jQuery.validator.addMethod("isChinese", function(value, element) {
  return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);
}, "匹配汉字");

// 匹配中文(包括汉字和字符)
jQuery.validator.addMethod("isChineseChar", function(value, element) {
  return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
}, "匹配中文(包括汉字和字符) ");

// 判断是否为合法字符(a-zA-Z0-9-_)
jQuery.validator.addMethod("isRightfulString", function(value, element) {
  return this.optional(element) || /^[A-Za-z0-9_-]+$/.test(value);
}, "只能包含英文、数字、下划线等字符");

// 判断是否包含中英文特殊字符，除英文"-_"字符外
jQuery.validator.addMethod("isContainsSpecialChar", function(value, element) {
  var reg = RegExp(/[(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);
  return this.optional(element) || !reg.test(value);
}, "含有中英文特殊字符");

// 0到99.99的数字
jQuery.validator.addMethod("ispercentage", function(value, element) {
  return this.optional(element) || /^(0|[1-9][0-9]?)(\.[0-9]{0,2})?$/.test(value);
}, "0到99.99的数字");
jQuery.validator.addMethod("isverypercentage", function(value, element) {
  return this.optional(element) || /^(0|[1-9]|10?)(\.[0-9]{0,1})?$/.test(value);
}, "0到10.0的数字");
jQuery.validator.addMethod("is2Float", function(value, element) {
  return this.optional(element) || (/^[-\+]?\d+(\.[0-9]{0,2})?$/.test(value) && value >= 0);
}, "只能包含数字、小数点等字符(最多两位小数且大于等于0)");
jQuery.validator.addMethod("is3Float", function(value, element) {
  return this.optional(element) || (/^[-\+]?\d+(\.[0-9]{0,2})?$/.test(value) && value > 0);
}, "只能包含数字、小数点等字符(最多两位小数且大于0)");
jQuery.validator.addMethod("greaterThanOrEqualTo", function(value, element, obj) {
  return this.optional(element) || value >= $(obj).val();
}, "必须大于或等于最小值");
jQuery.validator.addMethod("lessThanOrEqualTo", function(value, element, obj) {
  return this.optional(element) || value <= $(obj).val();
}, "必须小于或等于最大值");

$.extend($.validator.messages, {
  required: "必选字段",
  remote: "请修正该字段",
  email: "请输入正确格式的电子邮件",
  url: "请输入合法的网址",
  date: "请输入合法的日期",
  dateISO: "请输入合法的日期 (ISO).",
  number: "请输入合法的数字",
  digits: "只能输入整数",
  creditcard: "请输入合法的信用卡号",
  equalTo: "请再次输入相同的值",
  accept: "请输入拥有合法后缀名的字符串",
  maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
  minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
  rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
  range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
  max: $.validator.format("请输入一个最大为 {0} 的值"),
  min: $.validator.format("请输入一个最小为 {0} 的值")
});
var idCardNoUtil = {
  provinceAndCitys: {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  },

  powers: ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"],

  parityBit: ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"],

  genders: {
    male: "男",
    female: "女"
  },

  checkAddressCode: function(addressCode) {
    var check = /^[1-9]\d{5}$/.test(addressCode);
    if (!check) return false;
    if (idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
      return true;
    } else {
      return false;
    }
  },

  checkBirthDayCode: function(birDayCode) {
    var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
    if (!check) return false;
    var yyyy = parseInt(birDayCode.substring(0, 4), 10);
    var mm = parseInt(birDayCode.substring(4, 6), 10);
    var dd = parseInt(birDayCode.substring(6), 10);
    var xdata = new Date(yyyy, mm - 1, dd);
    if (xdata > new Date()) {
      return false; //生日不能大于当前日期
    } else if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
      return true;
    } else {
      return false;
    }
  },

  getParityBit: function(idCardNo) {
    var id17 = idCardNo.substring(0, 17);
    var power = 0;
    for (var i = 0; i < 17; i++) {
      power += parseInt(id17.charAt(i), 10) * parseInt(idCardNoUtil.powers[i]);
    }
    var mod = power % 11;
    return idCardNoUtil.parityBit[mod];
  },

  checkParityBit: function(idCardNo) {
    var parityBit = idCardNo.charAt(17).toUpperCase();
    if (idCardNoUtil.getParityBit(idCardNo) == parityBit) {
      return true;
    } else {
      return false;
    }
  },

  checkIdCardNo: function(idCardNo) {
    //15位和18位身份证号码的基本校验
    var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
    if (!check) return false;
    //判断长度为15位或18位
    if (idCardNo.length == 15) {
      return idCardNoUtil.check15IdCardNo(idCardNo);
    } else if (idCardNo.length == 18) {
      return idCardNoUtil.check18IdCardNo(idCardNo);
    } else {
      return false;
    }
  },
  //校验15位的身份证号码
  check15IdCardNo: function(idCardNo) {
    //15位身份证号码的基本校验
    var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
    if (!check) return false;
    //校验地址码
    var addressCode = idCardNo.substring(0, 6);
    check = idCardNoUtil.checkAddressCode(addressCode);
    if (!check) return false;
    var birDayCode = '19' + idCardNo.substring(6, 12);
    //校验日期码
    return idCardNoUtil.checkBirthDayCode(birDayCode);
  },
  //校验18位的身份证号码
  check18IdCardNo: function(idCardNo) {
    //18位身份证号码的基本格式校验
    var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
    if (!check) return false;
    //校验地址码
    var addressCode = idCardNo.substring(0, 6);
    check = idCardNoUtil.checkAddressCode(addressCode);
    if (!check) return false;
    //校验日期码
    var birDayCode = idCardNo.substring(6, 14);
    check = idCardNoUtil.checkBirthDayCode(birDayCode);
    if (!check) return false;
    //验证校检码
    return idCardNoUtil.checkParityBit(idCardNo);
  },
  formateDateCN: function(day) {
    var yyyy = day.substring(0, 4);
    var mm = day.substring(4, 6);
    var dd = day.substring(6);
    return yyyy + '-' + mm + '-' + dd;
  },
  //获取信息
  getIdCardInfo: function(idCardNo) {
    var idCardInfo = {
      gender: "", //性别
      birthday: "" // 出生日期(yyyy-mm-dd)
    };
    if (idCardNo.length == 15) {
      var aday = '19' + idCardNo.substring(6, 12);
      idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
      if (parseInt(idCardNo.charAt(14)) % 2 == 0) {
        idCardInfo.gender = idCardNoUtil.genders.female;
      } else {
        idCardInfo.gender = idCardNoUtil.genders.male;
      }
    } else if (idCardNo.length == 18) {
      var aday = idCardNo.substring(6, 14);
      idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
      if (parseInt(idCardNo.charAt(16)) % 2 == 0) {
        idCardInfo.gender = idCardNoUtil.genders.female;
      } else {
        idCardInfo.gender = idCardNoUtil.genders.male;
      }
    }
    return idCardInfo;
  },

  getId15: function(idCardNo) {
    if (idCardNo.length == 15) {
      return idCardNo;
    } else if (idCardNo.length == 18) {
      return idCardNo.substring(0, 6) + idCardNo.substring(8, 17);
    } else {
      return null;
    }
  },

  getId18: function(idCardNo) {
    if (idCardNo.length == 15) {
      var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);
      var parityBit = idCardNoUtil.getParityBit(id17);
      return id17 + parityBit;
    } else if (idCardNo.length == 18) {
      return idCardNo;
    } else {
      return null;
    }
  }
};
//验证护照是否正确
function checknumber(number) {
  var str = number;
  //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
  var Expression = /(P\d{7})|(G\d{8})/;
  var objExp = new RegExp(Expression);
  if (objExp.test(str) == true) {
    return true;
  } else {
    return false;
  }
};
