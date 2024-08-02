let defaultSite = '/home/inventoryList.html'
try {
  if (sessionStorage.Site) {
    defaultSite = sessionStorage.Site
  }
} catch(e) {}

export default {
  Site: defaultSite
}