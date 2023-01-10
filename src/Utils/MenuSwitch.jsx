export default function MenuSwitch (props) {
    const { menuList, menuItem, menuFunc } = props
    let tempObj = {}
    Object.keys(menuList).forEach(key => tempObj[key] = false)
    Object.values(menuList).find(item => item)
      ? menuFunc(tempObj)
      : menuFunc({ ...menuList, [menuItem]: !menuList[menuItem] })
  }