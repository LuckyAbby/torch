
-- ----------------------------
-- Table structure for login
-- ----------------------------
DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `student_id` int(9) NOT NULL,
  `password` varchar(255) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `id-card` char(18) NOT NULL,
  `major` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `student_id` int(9) NOT NULL,
  `article_title` varchar(255) NOT NULL,
  `article_content` varchar(255) NOT NULL,
  `article_clicks` int(11) NOT NULL,
  `support_number` int(11) NOT NULL,
  `oppose_number` int(11) NOT NULL,
  `comments_number` int(11) NOT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
SET FOREIGN_KEY_CHECKS=1;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `article_name` varchar(255) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `comment_content` varchar(255) NOT NULL,
  `student_id` int(9) NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;