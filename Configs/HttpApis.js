module.exports = {
    WolfVideoApis: {
        Base:"https://www.5781000.co/api2/", //base
        CodeBase: "http://61.222.131.65:8080/vod/mp4:", //有码
        codelessBase: "http://cdnxxx.5781000.co/", //无码
        HostList: "get_video_list/hit", //热门列表
        NewList: "get_video_list/new", //热门列表
        PlayersList: "players", //演员列表
        Category: "categories_new", //分类列表
        CatDetail: "get_video_list/cat", //分类详情
        PlayerDetail: "get_video_list/player", //演员的影片
        VideoDetail: "get_video_data_v2", //详情
        Search: "get_video_list/search", //搜索
    },
    keys: {
        SignVerify:"2edJwjL9Rwcb5dtUH32NdbINSP0kOqoIcIy6yWDT99hgmBeoCUtPtJo4YidbISC6"
    },
    MyServerApis: {
      Base: "http://47.94.175.119:8181/wolfVideo/", //我的服务地址 ip 35.163.52.183  ec2-35-163-52-183.us-west-2.compute.amazonaws.com
      Login:"account/login", //登录
      Register: "account/register", //注册
      Info: "account/info", //获取个人信息
      GetAuthList: "authCodeManager/getAuthList", //邀请码列表
      AddNewAuthCodes: "authCodeManager/addNewAuthCodes", //添加邀请码
      GetCollectList: "collects/getCollectList", //获取收藏列表
      AddNewCollect: "collects/addNewCollect", //收藏
      CancelCollect: "collects/cancelCollect", //取消收藏
      GetCollectsCount: "collects/getCollectsCount", //收藏数量
      CheckIsCollect: "collects/checkIsCollect", //收藏数量
      UploadAvatar: "upload/avatar", //上传头像
      UpdateInfo: "account/updateInfo" //更新信息
    }


}