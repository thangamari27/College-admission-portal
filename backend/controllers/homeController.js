exports.renderHome = (req, res) => {
    res.render('college-home', { user: req.user });
  };
  
exports.renderHome = (req, res) => {
  res.render('student-home', { user: req.user });
};
