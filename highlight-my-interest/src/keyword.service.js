class KeywordService {
  static init (setting, href) {
    KeywordService.Setting = setting;
    KeywordService.keywords = [];
    const sites = Object.keys(KeywordService.Setting.keywords);
    if (!sites || !sites.length) return;
    sites.forEach((site) => {
      const sitePattern = new RegExp(site, 'gi');
      if (sitePattern.test(href)) {
        KeywordService.keywords.push(...KeywordService.Setting.keywords[ site ]);
      }
    });
  }

  static list () {
    return Promise.resolve(KeywordService.keywords);
  }
}

module.exports = KeywordService;
