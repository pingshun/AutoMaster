/**
 * Created by pge on 16/8/25.
 */

var am_server = 'http://am.emontech.cn';
//var am_server = 'http://127.0.0.1:3002';
var CONSTANTS = {
  app_en_name: 'auto_master',
  version: '0.1.0',
  is_dev: 1,
  days_for_warn_update_mileage: 10,
  days_for_alert_update_mileage: 15,

  update_notification_id: 1,
  service_notification_id: 2,

  backup_url: am_server + '/api/am_backup',
  login_url: am_server + '/api/login',
  register_url: am_server + '/api/user/register',
  forgot_pw_url: am_server + '/api/user/forgot_pw',
  db_operator_url: am_server + '/api/am_db_operator',
  db_bootstrap_url: am_server + '/api/am_db_bootstrap',
  get_cars: am_server + '/api/get_cars',
  url_api_add_car: am_server + '/api/add_car',

  login_status_not_login: -1,
  login_status_login_error: 0,
  login_status_login_done: 1,

  reg_user_name: /^[a-zA-Z0-9_/-]*$/,


  brands: {
    1: {
      id: 1,
      name: "acura",
      chinese_name: "讴歌",
    },
    2: {
      id: 2,
      name: "aston-martin",
      chinese_name: "阿斯顿马丁",
    },
    3: {
      id: 3,
      name: "audi",
      chinese_name: "奥迪",
    },
    4: {
      id: 4,
      name: "baojun",
      chinese_name: "宝骏",
    },
    5: {
      id: 5,
      name: "baw",
      chinese_name: "北汽",
    },
    6: {
      id: 6,
      name: "beijingqiche",
      chinese_name: "北京汽车",
    },
    7: {
      id: 7,
      name: "benten",
      chinese_name: "奔腾",
    },
    8: {
      id: 8,
      name: "bentley",
      chinese_name: "宾利",
    },
    9: {
      id: 9,
      name: "benz",
      chinese_name: "奔驰",
    },
    10: {
      id: 10,
      name: "bmw",
      chinese_name: "宝马",
    },
    11: {
      id: 11,
      name: "bugatti",
      chinese_name: "布加迪",
    },
    12: {
      id: 12,
      name: "buick8060",
      chinese_name: "别克",
    },
    13: {
      id: 13,
      name: "byd",
      chinese_name: "比亚迪",
    },
    14: {
      id: 14,
      name: "cadillac",
      chinese_name: "凯迪拉克",
    },
    15: {
      id: 15,
      name: "chaanjiaoche",
      chinese_name: "长安",
    },
    16: {
      id: 16,
      name: "changanshangyong",
      chinese_name: "长安（商用）",
    },
    17: {
      id: 17,
      name: "changfeng",
      chinese_name: "长丰",
    },
    18: {
      id: 18,
      name: "changhe",
      chinese_name: "昌河",
    },
    19: {
      id: 19,
      name: "chery",
      chinese_name: "奇瑞",
    },
    20: {
      id: 20,
      name: "chevrolet",
      chinese_name: "雪佛兰",
    },
    21: {
      id: 21,
      name: "chrysler",
      chinese_name: "克莱斯勒",
    },
    22: {
      id: 22,
      name: "citroen",
      chinese_name: "雪铁龙",
    },
    23: {
      id: 23,
      name: "dadi",
      chinese_name: "大迪",
    },
    24: {
      id: 24,
      name: "dihao",
      chinese_name: "帝豪",
    },
    25: {
      id: 25,
      name: "dodge",
      chinese_name: "道奇",
    },
    26: {
      id: 26,
      name: "dongfeng",
      chinese_name: "东风",
    },
    27: {
      id: 27,
      name: "dongfengfengshen",
      chinese_name: "风神",
    },
    28: {
      id: 28,
      name: "ferrari",
      chinese_name: "法拉利",
    },
    29: {
      id: 29,
      name: "fiat",
      chinese_name: "菲亚特",
    },
    30: {
      id: 30,
      name: "ford",
      chinese_name: "福特",
    },
    31: {
      id: 31,
      name: "fudi",
      chinese_name: "福迪",
    },
    32: {
      id: 32,
      name: "futian",
      chinese_name: "福田",
    },
    33: {
      id: 33,
      name: "geely",
      chinese_name: "吉利",
    },
    34: {
      id: 34,
      name: "gmc",
      chinese_name: "GMC",
    },
    35: {
      id: 35,
      name: "greatwall",
      chinese_name: "长城",
    },
    36: {
      id: 36,
      name: "guanggang",
      chinese_name: "光冈",
    },
    37: {
      id: 37,
      name: "guangqi",
      chinese_name: "广汽",
    },
    38: {
      id: 38,
      name: "hafei",
      chinese_name: "哈飞",
    },
    39: {
      id: 39,
      name: "haima",
      chinese_name: "海马",
    },
    40: {
      id: 40,
      name: "haimashangyong",
      chinese_name: "海马郑州",
    },
    41: {
      id: 41,
      name: "heibao",
      chinese_name: "黑豹",
    },
    42: {
      id: 42,
      name: "honda",
      chinese_name: "本田",
    },
    43: {
      id: 43,
      name: "hongqi",
      chinese_name: "红旗",
    },
    44: {
      id: 44,
      name: "huachenjinbei",
      chinese_name: "金杯",
    },
    45: {
      id: 45,
      name: "huanghai",
      chinese_name: "黄海",
    },
    46: {
      id: 46,
      name: "huapu",
      chinese_name: "华普",
    },
    47: {
      id: 47,
      name: "huatai",
      chinese_name: "华泰",
    },
    48: {
      id: 48,
      name: "huizong",
      chinese_name: "汇众",
    },
    49: {
      id: 49,
      name: "hummer",
      chinese_name: "悍马",
    },
    50: {
      id: 50,
      name: "hyundai",
      chinese_name: "现代",
    },
    51: {
      id: 51,
      name: "infiniti",
      chinese_name: "英菲尼迪",
    },
    52: {
      id: 52,
      name: "iveco",
      chinese_name: "依维柯",
    },
    53: {
      id: 53,
      name: "ja8060",
      chinese_name: "吉奥",
    },
    54: {
      id: 54,
      name: "jac",
      chinese_name: "江淮",
    },
    55: {
      id: 55,
      name: "jaguar",
      chinese_name: "捷豹",
    },
    56: {
      id: 56,
      name: "jeep",
      chinese_name: "吉普",
    },
    57: {
      id: 57,
      name: "jiangling",
      chinese_name: "江铃",
    },
    58: {
      id: 58,
      name: "jiangnan",
      chinese_name: "江南",
    },
    59: {
      id: 59,
      name: "jinlonglianhe",
      chinese_name: "厦门金龙",
    },
    60: {
      id: 60,
      name: "jiulong",
      chinese_name: "九龙",
    },
    61: {
      id: 61,
      name: "karry",
      chinese_name: "开瑞",
    },
    62: {
      id: 62,
      name: "kia",
      chinese_name: "起亚",
    },
    63: {
      id: 63,
      name: "koenigsegg",
      chinese_name: "柯尼塞格",
    },
    64: {
      id: 64,
      name: "lamborghini",
      chinese_name: "兰博基尼",
    },
    65: {
      id: 65,
      name: "landrover",
      chinese_name: "路虎",
    },
    66: {
      id: 66,
      name: "lexus",
      chinese_name: "雷克萨斯",
    },
    67: {
      id: 67,
      name: "lifan",
      chinese_name: "力帆",
    },
    68: {
      id: 68,
      name: "lincoln",
      chinese_name: "林肯",
    },
    69: {
      id: 69,
      name: "ln",
      chinese_name: "理念",
    },
    70: {
      id: 70,
      name: "lorinser",
      chinese_name: "劳伦士",
    },
    71: {
      id: 71,
      name: "lotus-motor",
      chinese_name: "莲花",
    },
    72: {
      id: 72,
      name: "lotus8060",
      chinese_name: "路特斯",
    },
    73: {
      id: 73,
      name: "lufeng",
      chinese_name: "陆风",
    },
    74: {
      id: 74,
      name: "maserati",
      chinese_name: "玛莎拉蒂",
    },
    75: {
      id: 75,
      name: "maybach",
      chinese_name: "迈巴赫",
    },
    76: {
      id: 76,
      name: "mazda",
      chinese_name: "马自达",
    },
    77: {
      id: 77,
      name: "mg",
      chinese_name: "MG",
    },
    78: {
      id: 78,
      name: "mini",
      chinese_name: "迷你",
    },
    79: {
      id: 79,
      name: "mitsubishi",
      chinese_name: "三菱",
    },
    80: {
      id: 80,
      name: "nazhijie8060",
      chinese_name: "纳智捷",
    },
    81: {
      id: 81,
      name: "nissan",
      chinese_name: "日产",
    },
    82: {
      id: 82,
      name: "opel",
      chinese_name: "欧宝",
    },
    83: {
      id: 83,
      name: "pagani",
      chinese_name: "帕加尼",
    },
    84: {
      id: 84,
      name: "peugeot",
      chinese_name: "标致",
    },
    85: {
      id: 85,
      name: "porsche",
      chinese_name: "保时捷",
    },
    86: {
      id: 86,
      name: "qingling",
      chinese_name: "庆铃",
    },
    87: {
      id: 87,
      name: "quanqiuying",
      chinese_name: "全球鹰",
    },
    88: {
      id: 88,
      name: "renault",
      chinese_name: "雷诺",
    },
    89: {
      id: 89,
      name: "riich",
      chinese_name: "瑞麒",
    },
    90: {
      id: 90,
      name: "roewe",
      chinese_name: "荣威",
    },
    91: {
      id: 91,
      name: "rolls-royce",
      chinese_name: "劳斯莱斯",
    },
    92: {
      id: 92,
      name: "rossion",
      chinese_name: "Rossion",
    },
    93: {
      id: 93,
      name: "ruilink",
      chinese_name: "威麟",
    },
    94: {
      id: 94,
      name: "saab",
      chinese_name: "萨博",
    },
    95: {
      id: 95,
      name: "seat8060",
      chinese_name: "西亚特",
    },
    96: {
      id: 96,
      name: "shuanghuan",
      chinese_name: "双环",
    },
    97: {
      id: 97,
      name: "shuanglong",
      chinese_name: "双龙",
    },
    98: {
      id: 98,
      name: "skoda8060",
      chinese_name: "斯柯达",
    },
    99: {
      id: 99,
      name: "smart",
      chinese_name: "Smart",
    },
    100: {
      id: 100,
      name: "soueast-motor",
      chinese_name: "东南",
    },
    101: {
      id: 101,
      name: "spykers",
      chinese_name: "世爵",
    },
    102: {
      id: 102,
      name: "subaru",
      chinese_name: "斯巴鲁",
    },
    103: {
      id: 103,
      name: "suzuki",
      chinese_name: "铃木",
    },
    104: {
      id: 104,
      name: "toyota",
      chinese_name: "丰田",
    },
    105: {
      id: 105,
      name: "ufo",
      chinese_name: "永源",
    },
    106: {
      id: 106,
      name: "volkswagen",
      chinese_name: "大众",
    },
    107: {
      id: 107,
      name: "volvo",
      chinese_name: "沃尔沃",
    },
    108: {
      id: 108,
      name: "wuling",
      chinese_name: "五菱",
    },
    109: {
      id: 109,
      name: "ww8060",
      chinese_name: "威旺",
    },
    110: {
      id: 110,
      name: "xinyatu",
      chinese_name: "南汽",
    },
    111: {
      id: 111,
      name: "yinglun",
      chinese_name: "英伦汽车",
    },
    112: {
      id: 112,
      name: "yiqi",
      chinese_name: "吉林",
    },
    113: {
      id: 113,
      name: "zhonghua",
      chinese_name: "中华",
    },
    114: {
      id: 114,
      name: "zhongou",
      chinese_name: "中欧",
    },
    115: {
      id: 115,
      name: "zhongtai8060",
      chinese_name: "众泰",
    },
    116: {
      id: 116,
      name: "zhongxing",
      chinese_name: "中兴",
    },
    117: {
      id: 117,
      name: "ziyoufeng",
      chinese_name: "自由风",
    }
  },
};
