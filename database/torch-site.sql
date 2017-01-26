-- ----------------------------
-- Table structure for login
-- ----------------------------
DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `student_id` int(9) NOT NULL,
  `password` varchar(255) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `id_card` char(255) NOT NULL,
  `major` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  `login_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf-8;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `article_id` int(11) NOT NULL,
  `article_title` varchar(255) NOT NULL,
  `article_content` text NOT NULL,
  `article_clicks` int(11) NOT NULL,
  `support_number` int(11) NOT NULL,
  `oppose_number` int(11) NOT NULL,
  `comments_number` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `article_type` varchar(255) NOT NULL,
  `article_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf-8;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `comment_content` varchar(255) NOT NULL,
  `student_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `comment_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf-8;

-- ----------------------------
-- Table structure for oppose
-- ----------------------------
DROP TABLE IF EXISTS `oppose`;
CREATE TABLE `oppose` (
  `oppose_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `oppose_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`oppose_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf-8;

-- ----------------------------
-- Table structure for support
-- ----------------------------
DROP TABLE IF EXISTS `support`;
CREATE TABLE `support` (
  `support_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `support_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`support_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf-8;
