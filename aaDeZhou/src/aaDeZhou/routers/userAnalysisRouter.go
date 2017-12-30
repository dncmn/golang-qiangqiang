package routers

import (
	"aaDeZhou/controllers/user_analysis"

	"github.com/astaxie/beego"
)

func init() {
	//	beego.Router("/", &controllers.MainController{}, "*:ToIndex")

	////玩家留存的页面
	//beego.Router("/toFindDayUserPreservePage", &controllers.UserPreserve{}, "*:DayUserPreserve")
	beego.Router("/toFindDayUserPreservePage", &user_analysis.UserPreserveController{}, "*:DayUserPreserve")
	//beego.Router("/toTranslateTime", &controllers.UserPreserve{}, "*:TranslateTime")
	//beego.Router("/toTranslateTime", &user_analysis.UserPreserveController{}, "*:TranslateTime")

	//玩家的次日留存
	beego.Router("/toDayPreserveUser", &user_analysis.UserPreserveController{}, "*:ToDayPreserveUser")

	//玩家的七日留存
	beego.Router("/toWeekPreserveUser", &user_analysis.UserPreserveController{}, "*:ToWeekPreserveUser")

	//玩家的30日留存
	beego.Router("/toMonthPreserveUser", &user_analysis.UserPreserveController{}, "*:ToMonthPreserveUser")

	//活跃玩家
	//beego.Router("/toFindDayUserActivePage", &controllers.UserActive{}, "*:ToFindDayUserActivePage")
	beego.Router("/toFindDayUserActivePage", &user_analysis.UserActiveController{}, "*:ToFindDayUserActivePage")

	//新增用户
	beego.Router("/toNewAddUser", &user_analysis.UserActiveController{}, "*:ToNewAddUser")

	//活跃用户
	beego.Router("/toActiveUser", &user_analysis.UserActiveController{}, "*:ToActiveUser")
	//历史用户
	beego.Router("/toHistoryUser", &user_analysis.UserActiveController{}, "*:ToHistoryUser")

	//周流失率
	beego.Router("/toChooseUserLossPage", &user_analysis.UserLossController{}, "*:ToChooseUserLossPage")

	//流失率
	beego.Router("/toLossRate", &user_analysis.UserLossController{}, "*:ToLossRate")
	//单独显示某一个省份的流失信息
	beego.Router("/toShowSingleInfo", &user_analysis.UserLossController{}, "*:ToShowSingleInfo")

	//流失账号
	beego.Router("/toLossMemberInfo", &user_analysis.UserLossController{}, "*:ToLossMemberInfo")
	//在线习惯---玩家峰值
	beego.Router("/toCalPeakValPage", &user_analysis.UserPeakValueController{}, "*:ToCalPeakValPage")

	//在线峰值
	beego.Router("/toPeakValue", &user_analysis.UserPeakValueController{}, "*:ToPeakValue")

	//日均在线用户数
	beego.Router("/toDayAvgUserCount", &user_analysis.UserPeakValueController{}, "*:ToDayAvgUserCount")

	//日均在线时长
	beego.Router("/toDayAvgOnlineTime", &user_analysis.UserPeakValueController{}, "*:ToDayAvgOnlineTime")

	//单次使用时长分布
	beego.Router("/toSingleOnlineTime", &user_analysis.UserPeakValueController{}, "*:ToSingleOnlineTime")

}
