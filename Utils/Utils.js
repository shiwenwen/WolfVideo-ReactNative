/**
 * 检测手机号
 * @param phoneNum
 * @returns {boolean}
 */
function checkIsPhoneNum(phoneNum: string) {
    const rp =new RegExp("^((13[0-9])|(14[0-9])|(00[0-9])|(15[^4,\\D])|(18[0,0-9])|(17[0,0-9]))\\d{8}$");

    return rp.test(phoneNum);
}

/**
 * 检测密码是否合格 0 长度不符合 6-16 1 合格 -1 包含非法字符
 * @param psd
 */
function checkisAccordPsd(psd: string) {
    if (psd.length < 6 || psd.length > 16){
        return 0
    }

    for (let i = 0;i < psd.length;i++){
        let char = psd.charAt(i)
        let reg = /^[A-Za-z]+$/
        if (!(reg.test(char) || !isNaN(char) || char == '_')){
            return -1
        }
    }
    return 1
}

/**
 * 检测邮箱
 * @param email
 * @returns {boolean}
 */
function checkIsEmail(email: string) {
    const rp =new RegExp("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}");

    return rp.test(email);
}

export {checkIsPhoneNum, checkisAccordPsd,checkIsEmail}