exports.renderIndex = (req, res) => {
  res.status(200).render('index', {
    pageTitle: 'ChatApi'
  });
}

exports.render404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'ChatApi'
  });
}