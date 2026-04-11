module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
  getHumanConnection: (req, res) => {
    res.render("human-connection.ejs");
  },
  getAbout: (req, res) => {
    res.render("about.ejs");
  },
  getSettings: (req, res) => {
    res.render("settings.ejs");
  },
};
