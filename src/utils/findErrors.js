Array.prototype.findErrors = function(name) {
    let result = []
    this.forEach(ele => {
        if(ele.path === name) {
            result.push(ele.msg)
        }
    })
    return result.join(",")
    // for(let i = 0; i < this.length; i++) {
    //     let result = ""
    //     if(this[i].path === name) {
    //         result += this[i].msg
    //     }
    //     return result
    // }
}