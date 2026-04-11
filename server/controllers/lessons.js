module.exports = {
  getLessons: (req, res) => {
    res.render("train.ejs", { pagetitle: 'Train'});
  },
};