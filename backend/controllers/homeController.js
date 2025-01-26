exports.renderHome = (req, res) => {
    res.render('college-home', { user: req.user });
  };
  